import DbClient from '../../db/client';
import { format, empty } from './mapper';

function MatchService (matchDataDir) {
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
      return Promise.all(matches.map(format));
    });
};

// TODO: consider reworking this horrible CRUD system
MatchService.prototype.create = function (match) {
  return this.matches.add(match);
};

MatchService.prototype.update = function (id, newMatchData) {
  return this.matches.update(id, newMatchData);
};

MatchService.prototype.delete = function (number) {
  return this.matches.remove(this.getByNumber(number).id);
};

export default MatchService;
