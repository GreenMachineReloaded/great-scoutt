import GenericModel from './generic';
const gameConfig = require('../../data/game-config');

export default function Match (m) {
  GenericModel.call(this);

  const self = {
    data: {
      team: m.team,
      tournament: m.tournament,
      number: m.number,
      matchId: m.matchId,
      alliance: m.alliance,
      comments: m.comments,
      data: {
        categories: gameConfig.categories.map((category) => {

          const matchCategory = m.data.categories.find((cat) => cat.name === category.name);

          // merge points for current match with rule metadata
          category.rules = category.rules.map((rule, i) => {
            const matchRule = matchCategory.rules.find((ruleMData) => ruleMData.name === rule.name);
            rule.points = matchRule.points || 0;
            return rule;
          });

          return category;
        })
      }
    }
  };

  this.getCSVHeaders = () => {

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

    return getHeaders(self.data).join(',');
  };

  this.toCSV = () => {
    
    function getData (match) {
      return Object.keys(match).map((key) => {
        const value = match[key];
        if (key === 'data') {
          return match.data.categories.map((cat) =>
            cat.rules.map((rule) => `"${rule.points}"`)
          );
        } else if (key === 'comments') {
          return `"${value}"`;
        } else {
          return value;
        }
      });
    }

    return getData(self.data).join(',');
  };
}