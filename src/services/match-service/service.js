import DbClient from '../../db/client';
import { empty } from './mapper';

function MatchService () {
  const database = new DbClient();
  this.matches = database.matchCollection;
  this.getEmptyMatch = empty;
}

MatchService.prototype.getAll = function () {
  return this.matches.getAll();
};

MatchService.prototype.get = function (params) {
  return this.matches.filter(params)
    .then((matches) => {
      matches.sort((a, b) => {
        const tDiff = a.tournament.id - b.tournament.id;
        if (tDiff === 0) {
          return a.number - b.number;
        }
        return tDiff;
      });
      return matches;
    });
};

// TODO: consider reworking this horrible CRUD system
MatchService.prototype.create = function (match) {
  return this.matches.add(match);
};

MatchService.prototype.update = function (id, newMatchData) {
  return this.matches.update(id, newMatchData);
};

MatchService.prototype.delete = function (id) {
  return this.matches.remove(id);
};

export default MatchService;
