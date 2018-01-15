import GenericModel from './generic';
const gameConfig = require('../../data/game-config'); // TODO: dep inject this
const { csvDelimiter } = require('../../../config');

function Match (m, config=gameConfig) {
  GenericModel.call(this);

  this.data = {
    team: typeof m.team === 'object' ? m.team.number : m.team,
    tournament: typeof m.tournament === 'object' ? m.tournament.id : m.tournament,
    number: m.number,
    matchId: m.matchId,
    alliance: m.alliance,
    comments: m.comments,
    data: {
      categories: gameConfig.categories.map((category) => {

        const matchCategory = m.data.categories.find((cat) => cat.name === category.name);

        // merge points for current match with rule metadata
        return {
          rules: category.rules.map((rule, i) => {
            const matchRule = matchCategory.rules.find((ruleMData) => ruleMData.name === rule.name);
            return {
              name: matchRule.name,
              points: matchRule.points || 0
            };
          })
        };
      })
    }
  };

  this.toCSV = () => {

    function getData (match) {
      return Object.keys(match).map((key) => {
        const value = match[key];
        if (key === 'data') {
          const t = match.data.categories.map((cat) => 
            cat.rules.map(rule => rule.points).join(csvDelimiter)
          ).join(csvDelimiter);
          return t;
        } else if (key === 'comments') {
          return `"${value}"`;
        } else {
          return value;
        }
      });
    }

    return getData(this.data).join(csvDelimiter);
  };
}

Match.schema = {
  team: '',
  tournament: 0,
  number: 0,
  matchId: '',
  alliance: '',
  comments: '',
  data: gameConfig
};

Match.getCSVHeaders = () => {

  function getHeaders (match) {
    return Object.keys(match).map((key) => {
      const childKey = Object.keys(match[key]);
      if (key === 'data') {
        return match.data.categories.map((cat) =>
          cat.rules.map((rule) => `"${rule.name}"`)
        );
      } else {
        return key;
      }
    });
  }

  return getHeaders(Match.schema).join(csvDelimiter);
};

export default Match;