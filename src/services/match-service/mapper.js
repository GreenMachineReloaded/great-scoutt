import TournamentService from '../tournament-service';
import TeamService from '../team-service';

const gameConfig = require('../../data/game-config');

const tourneyService = new TournamentService();
const teamService = new TeamService();

function getTeams(teams) {
  return Promise.all(teams.map((number) => {
    return teamService.get({ number })
      .then(([firstResult]) => firstResult);
  }));
}

/**
 * This function grabs information from other services to provide a more
 * complete match result, and also merges in rule metadata data from gameConfig
 */
export function format (match) {
  return Promise.all([
    tourneyService.get({ id: match.tournament }),
    getTeams([match.team])
  ])
  .then(([[tournament], [self]]) => {
    return {
      id: match.id,
      team: self,
      tournament: tournament,
      number: match.number,

      // TODO: rename to code
      matchId: match.matchId,

      win: match.win,

      // need to ensure that 'RED' and 'BLUE' are the only two allowable options.
      // if for some reason we have a different value, record it as 'UNKNOWN'
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