import assert from 'assert';
import sinon from 'sinon';
import FileSystem from 'react-native-filesystem-v1';
import TeamService from './index';
import MatchService from '../match-service';
import {
  assertProps,
  createTeam
} from '../../utils';

const teamService = new TeamService();
const matchService = new MatchService();

function resolveAsString (data) {
  return Promise.resolve(JSON.stringify(data));
}

function stubDatabases (fakeData) {
  sinon.stub(FileSystem, 'readFile').callsFake((path) => {
    switch (path)  {
      case 'teams.json':
        return resolveAsString(fakeData.teams || []);
      case 'matches.json':
        return resolveAsString(fakeData.matches || []);
      case 'settings.json':
        return resolveAsString(fakeData.settings || []);
      case 'tournaments.json':
        return resolveAsString(fakeData.tournaments || []);
    }
  });
}

describe('Team Service', () => {

  beforeAll(() => {
    sinon.stub(FileSystem, 'writeToFile').callsFake(() => Promise.resolve({ success: true }))
  });

  describe('#getAll', () => {

    describe('when readFile returns an empty array', () => {

      beforeAll(() => {
        teamService.teams.reload(); // forces collection to reload data from disk
        stubDatabases({
          teams: [],
          matches: []
        });
        // fsStub.withArgs('teams.json').returns(resolveAsString([]));
      });

      it('should respond with an empty array', () => {
        return teamService.getAll()
          .then((teams) => {
            assert(teams.length === 0);
          });
      });

      afterAll(() => {
        FileSystem.readFile.restore();
      });

    });

    describe('when readFile returns an array with 1 team', () => {
      const team = createTeam();
      const matches = [Object.assign(matchService.getEmptyMatch(), { team: team.number })];

      beforeAll(() => {
        teamService.teams.reload();
        matchService.matches.reload();
        stubDatabases({
          teams: [team],
          matches: matches
        });
      });

      it('should return properly formatted teams', () => {
        return teamService.getAll()
          .then((teams) => {
            assert(teams.length === 1, 'expected an array with 1 teams...');
            assertProps(teams[0], {
              ...team, // we expect all the standard team fields, plus some more
              matches: matches,
              isTop: false,
              averageScores: {
                autonomous: 0,
                teleop: 0,
                endGame: 0,
                total: 0
              },
              timesDead: 0
            });
          });
      });

      afterAll(() => {
        FileSystem.readFile.restore();
      });
    });

  });

  describe('#getByNumber', () => {
    const teamToGet = createTeam();
    const teams = [
      teamToGet,
      createTeam()
    ];

    beforeAll(() => {
      teamService.teams.reload();
      stubDatabases({
        teams: teams
      });
    });

    it('should respond with the requested team', () => {
      return teamService.getByNumber(teamToGet.number)
        .then((team) => {
          assert(team.number === teamToGet.number, `expected team ${teamToGet.number} got ${team.number}`);
          assertProps(team, Object.assign({ matches: [] }, teamToGet));
        });
    });

    afterAll(() => FileSystem.readFile.restore());

  });

  describe('#get', () => {
    const teamToGet = createTeam();
    const teams = [
      teamToGet,
      createTeam(),
      createTeam()
    ];

    beforeAll(() => {
      teamService.teams.reload();
      stubDatabases({
        teams: teams
      });
    });
  
    it('should return matching teams', () => {
      return teamService.get({ name: teamToGet.name })
        .then(([firstResult]) => assertProps(firstResult, teamToGet));
    });
  
    afterAll(() => FileSystem.readFile.restore());

  });

  describe('#create', () => {
    const newTeam = createTeam();

    describe('when team is not already present', () => {

      beforeAll(() => {
        teamService.teams.reload();
        matchService.matches.reload();
        stubDatabases({
          teams: [],
          matches: []
        });
      });
  
      it('should create a new team', () => {
        return teamService.create(newTeam)
          .then((created) => {
            assertProps(created, newTeam);
          })
          .catch((err) => assert.fail(err.message));
      });

      afterAll(() => FileSystem.readFile.restore());

    });

    describe('when team is already present', () => {
      const teamToCreate = createTeam();
      const teams = [
        teamToCreate,
        createTeam()
      ];

      beforeAll(() => {
        teamService.teams.reload();
        stubDatabases({
          teams: teams
        })
      });
      
      it('should not create a new team', () => {
        return teamService.create(teamToCreate)
          .then(() => assert.fail('should not resolve successfully'))
          .catch((err) => assert(err.name === 'DbAddOpError', `${err.message}`));
      });

      afterAll(() => FileSystem.readFile.restore());

    });

  });

  describe('#update', () => {
    const teamToUpdate = createTeam();

    beforeAll(() => {
      teamService.teams.reload();
      stubDatabases({
        teams: [teamToUpdate, createTeam()]
      });
    });

    it('should update the requested team', () => {
      return teamService.update(teamToUpdate.number, { name: 'wibbly wobbly robots' })
        .then()
        .catch((err) => assert.fail(err.message));
    });

    afterAll(() => FileSystem.readFile.restore());

  });

  describe.only('#delete', () => {
    const teamToDelete = createTeam();

    beforeAll(() => {
      teamService.teams.reload();
      stubDatabases({
        teams: [teamToDelete]
      });
    });

    it('should delete the requested team', () => {
      return Promise.seq([
        Promise.make((done) => teamService.delete(teamToDelete.number).then(done)),
        Promise.make((done) => teamService.getAll().then(done))
      ])
      .then(([deleteResult, data]) => {
        assert(data.length === 0, `expected data to have 0 elements, has ${data.length}`)
      });
    });

    afterAll(() => FileSystem.readFile.restore());

  });

  afterAll(() => FileSystem.writeToFile.restore());

});