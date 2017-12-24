import assert from 'assert';
import sinon from 'sinon';
import FileSystem from 'react-native-filesystem-v1';
import {
  assertProps,
  createTeam
} from '../../utils';
import MatchService from './index';
import TeamService from '../team-service';
import TournamentService from '../tournament-service';

const matchService = new MatchService();
const teamService = new TeamService();
const tournamentService = new TournamentService();

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

describe('Match Service', () => {

  beforeAll(() => sinon.stub(FileSystem, 'writeToFile').callsFake(() => Promise.resolve({ success: true })));

  describe('#get', () => {
    const match1 = matchService.getEmptyMatch('4318');
    const match2 = matchService.getEmptyMatch('4318');
    match2.tournament = 1;

    beforeAll(() => {
      matchService.matches.reload();
      tournamentService.tournaments.reload();
      teamService.teams.reload();
      stubDatabases({
        matches: [
          match2,
          matchService.getEmptyMatch(),
          match1,
          matchService.getEmptyMatch()
        ],
        teams: [createTeam('4318')],
        tournaments: [{ id: 0, name: 'WVA States' }, { id: 1, name: 'Anne Arundel' }]
      });
    });

    // FIXME: does not validate match number sort order
    it('should return matches', () => {
      return matchService.get({ team: '4318' })
        .then((results) => {
          assert(results.length === 2);
          results.forEach((match, i) => {
            assert(match.tournament.id === i, `expected tournament id ${match.tournament.id} to be ${i}`);
            assert(match.team.number === '4318', 'expected team === 4318');
          });
        });
    });

    afterAll(() => {
      matchService.matches.clear();
      teamService.teams.clear();
      tournamentService.tournaments.clear();
      FileSystem.readFile.restore();
    });

  });

  describe('#delete', () => {
    const newMatch = Object.assign(matchService.getEmptyMatch('4318'), { number: 1 });
    let id = null;

    beforeAll(() => {
      stubDatabases();
      return matchService.create(newMatch)
        .then((created) => {
          id = created.id;
        });
    });

    it('should properly delete a match', () => {
      return Promise.seq([
        Promise.make((done) => done(matchService.delete(id))),
        matchService.getAll.bind(matchService)
      ])
      .then(([deletedResult, matches]) => {
        assert(matches.length === 0, `expected no matches, found ${matches.length}`);
      });
    });

    afterAll(() => {
      matchService.matches.clear();
      FileSystem.readFile.restore();
    });

  });

  afterAll(() => FileSystem.writeToFile.restore());

});