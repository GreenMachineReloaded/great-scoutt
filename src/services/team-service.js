import DbClient from '../db/client';

function TeamService(teamDataDir) {
  const database = new DbClient();
  this.teams = database.teamCollection;
}

TeamService.prototype.getAll = function () {
  return this.teams.getAll();
};

// get a team by number
TeamService.prototype.getByNumber = function (number) {
  return this.teams.find((team) => team.number === number);
};

// get a team by number
TeamService.prototype.get = function (params) {
  return this.teams.filter(params);
};

TeamService.prototype.create = function (team) {
  return this.getByNumber(team.number).then((foundTeam) => {
    return foundTeam ?
      Promise.reject({ name: 'DbAddOpError', message: 'A team with that number already exists.' })
      : this.teams.add(team);
  });
};

TeamService.prototype.update = function (number, newTeamData) {
  return this.teams.update(this.getByNumber(number).id, newTeamData);
};

TeamService.prototype.delete = function (number) {
  return this.getByNumber(number)
    .then((team) => this.teams.remove(team.id));
};

export default TeamService;
