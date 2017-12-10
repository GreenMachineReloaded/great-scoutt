import TournamentService from '../tournament-service';
import TeamService from '../team-service/service';

const gameConfig = require('../../data/game-config');

const tourneyService = new TournamentService();
const teamService = new TeamService();

/**
 * This function grabs information from other services to provide a more
 * complete match result, and also merges in rule metadata data from gameConfig
 */
export function format (match) {
  return Promise.all([
    tourneyService.get({ id: match.tournament }).then(([tournament]) => tournament),
    teamService.get({ number: match.team }).then(([team]) => team)
  ])
  .then(([tournament, team]) => {
    return {
      id: match.id,
      team: team,
      tournament: tournament || { id: -1, name: 'Unknown' },
      number: match.number,

      // TODO: rename to code
      matchId: match.matchId,
      win: match.win,
      alliance: match.alliance,
      comments: match.comments,
      data: {
        categories: match.data.categories.map((category) => {

          // get category with rule metadata from configuration
          const categoryMetadata = gameConfig.categories.find((cat) => cat.name === category.name);

          // merge points for current match with rule metadata
          category.rules = category.rules.map((rule, i) => {
            const ruleMetadata = categoryMetadata.rules.find((ruleMData) => ruleMData.name === rule.name);
            return Object.assign(rule, ruleMetadata);
          });

          return category;
        })
      }
    };
  })
  .catch((error) => {
    console.log(error);
  });
}

// TODO: create a canonical model structure
export function empty (team) {
  return {
    team: team,
    tournament: 0,
    number: 0,
    matchId: '',
    win: false,
    alliance: 'RED',
    comments: '',
    data: {
      categories: gameConfig.categories.map((category) => {

        // merge points for current match with rule metadata
        category.rules = category.rules.map((rule, i) => {
          rule.points = 0;
          return rule;
        });

        return category;
      })
    }
  }
}