import DbClient from '../../db/client';
import { matchMapper, getEmptyMatch } from './mapper';

function MatchService (matchDataDir) {
  const database = new DbClient();
  this.matches = database.matchCollection;
  this.getEmptyMatch = getEmptyMatch;
}

MatchService.prototype.getAll = function () {
  return this.matches.getAll();
};

MatchService.prototype.get = function (params) {
  return this.matches.filter(params)
    .then((matches) => Promise.all(matches.map(matchMapper)));
};

// TODO: consider reworking this horrible CRUD system
MatchService.prototype.create = function (match) {
  return this.matches.add(Object.assign(match, { matchId: `${match.tournament}-${match.number}` }));
};

MatchService.prototype.update = function (id, newMatchData) {
  return this.matches.update(id, newMatchData);
};

MatchService.prototype.delete = function (number) {
  return this.matches.remove(this.getByNumber(number).id);
};

export default MatchService;
