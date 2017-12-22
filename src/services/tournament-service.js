import DbClient from '../db/client';

function TournamentService () {
  const database = new DbClient();
  this.tournaments = database.tournamentCollection;
}

TournamentService.prototype.getAll = function () {
  return this.tournaments.getAll();
};

TournamentService.prototype.get = function (params) {
  return this.tournaments.filter(params);
};

TournamentService.prototype.create = function (team) {
  return this.tournaments.add(team);
};

TournamentService.prototype.update = function (number, newTournamentData) {
  return this.tournaments.update(this.getByNumber(number).id, newTournamentData);
};

TournamentService.prototype.delete = function (number) {
  return this.tournaments.remove(this.getByNumber(number).id);
};

export default TournamentService;
