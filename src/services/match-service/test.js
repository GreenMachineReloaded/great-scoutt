import assert from 'assert';
import sinon from 'sinon';
import FileSystem from 'react-native-filesystem-v1';
import {
  assertProps,
  stubReadFile,
  unStubReadFile,
  stubWriteToFile,
  unStubWriteToFile,
  createTeam
} from '../../utils';
import MatchService from './index';
import TeamService from '../team-service';
import TournamentService from '../tournament-service';

const matchService = new MatchService();
const teamService = new TeamService();
const tournamentService = new TournamentService();

describe('Match Service', () => {

  beforeAll(() => stubWriteToFile());

  describe('#get', () => {
    const match1 = matchService.getEmptyMatch('4318');
    const match2 = matchService.getEmptyMatch('4318');
    match2.tournament = 1;

    beforeAll(() => {
      return Promise.seq([

        // set up matches
        Promise.make((done) => {
          matchService.matches.reload();
          stubReadFile([
            match2,
            matchService.getEmptyMatch(),
            match1,
            matchService.getEmptyMatch()
          ]);
          return matchService.getAll()
            .then((matches) => {
              unStubReadFile();
              done(matches);
            });
        }),

        // set up teams
        Promise.make((done) => {
          teamService.teams.reload();
          stubReadFile([createTeam('4318')]);
          return teamService.getAll()
            .then((teams) => {
              unStubReadFile();
              done(teams);
            });
        }),

        // set up tournaments
        Promise.make((done) => {
          tournamentService.tournaments.reload();
          stubReadFile([{ id: 0, name: 'WVA States' }, { id: 1, name: 'Anne Arundel' }]);
          return tournamentService.getAll()
            .then((tournaments) => {
              unStubReadFile();
              done(tournaments);
            });
        })

      ]);
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
      unStubReadFile();
    });

  });

  describe('#delete', () => {
    const newMatch = Object.assign(matchService.getEmptyMatch('4318'), { number: 1 });
    let id = null;

    beforeAll(() => {
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
    });

  });

  afterAll(() => unStubWriteToFile());

});