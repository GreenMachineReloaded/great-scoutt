import assert from 'assert';
import sinon from 'sinon';
import FileSystem from 'react-native-filesystem-v1';
import TeamService from './index';
import { assertProps, stubReadFile, unStubReadFile } from '../../utils';

const teamService = new TeamService();

let teamCounter = 0;

function createTeam () {
  return {
    id: Date.now(),
    name: `Team ${teamCounter++}`,
    number: `${Math.round(Math.random() * 20000)}`
  };
}

describe('Team Service', () => {

  beforeAll(() => sinon.stub(FileSystem, 'writeToFile').callsFake(() => Promise.resolve({ success: true })));

  describe('#getAll', () => {

    describe('when readFile returns an empty array', () => {

      beforeAll(() => {
        teamService.teams.reload(); // forces collection to reload data from disk
        stubReadFile([]);
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

      beforeAll(() => {
        teamService.teams.reload();
        stubReadFile([team]);
      });

      it('should return properly formatted teams', () => {
        return teamService.getAll()
          .then((teams) => {
            assert(teams.length === 1, 'expected an array with 1+ teams...');
            assertProps(teams[0], {
              ...team, // we expect all the standard team fields, plus some more
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
      stubReadFile(teams);
    });

    it('should respond with the requested team', () => {
      return teamService.getByNumber(teamToGet.number)
        .then((team) => {;
          assert(team.number === teamToGet.number, `expected team ${teamToGet.number} got ${team.number}`);
        });
    });

    afterAll(() => unStubReadFile());

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
      stubReadFile(teams);
    });
  
    it('should return matching teams', () => {
      return teamService.get({ name: teamToGet.name })
        .then(([firstResult]) => assertProps(firstResult, teamToGet));
    });
  
    afterAll(() => unStubReadFile());

  });

  describe('#create', () => {
    const newTeam = createTeam();

    describe('when team is not already present', () => {

      beforeAll(() => {
        teamService.teams.reload();
        stubReadFile([]);
      });
  
      it('should create a new team', () => {
        return teamService.create(newTeam)
          .then((created) => {
            assertProps(created, newTeam);
            return teamService.getAll();
          })
          .then(([created]) => assert(created.id === newTeam.id))
          .catch((err) => assert.fail(err));
      });

      afterAll(() => unStubReadFile());

    });

    describe('when team is already present', () => {
      const teamToCreate = createTeam();
      const teams = [
        teamToCreate,
        createTeam()
      ];

      beforeAll(() => {
        teamService.teams.reload();
        stubReadFile(teams);
      });
      
      it('should not create a new team', () => {
        return teamService.create(teamToCreate)
          .then(() => assert.fail('should not resolve successfully'))
          .catch((err) => assert(err.name === 'DbAddOpError', `${err.message}`));
      });

      afterAll(() => unStubReadFile());

    });

  });

  describe('#update', () => {
    const teamToUpdate = createTeam();

    beforeAll(() => {
      teamService.teams.reload();
      stubReadFile([teamToUpdate, createTeam()]);
    });

    it('should update the requested team', () => {
      return teamService.update(teamToUpdate.number, { name: 'wibbly wobbly robots' })
        .then()
        .catch((err) => assert.fail(err.message));
    });

    afterAll(() => unStubReadFile());

  });

  describe('#delete', () => {
    const teamToDelete = createTeam();

    beforeAll(() => {
      teamService.teams.reload();
      stubReadFile([teamToDelete]);
    });

    it('should delete the requested team', () => {
      return teamService.delete(teamToDelete.number)
        .then(() => teamService.getAll())
        .then((data) => assert(data.length === 0));
    });

    afterAll(() => unStubReadFile());

  });

  afterAll(() => FileSystem.writeToFile.restore());

});