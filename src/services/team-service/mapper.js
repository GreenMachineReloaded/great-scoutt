import MatchService from '../match-service';

const matchService = new MatchService();

function getCategoryScore (category) {
  return category.rules.reduce((totalCategoryScore, rule) => {
    return totalCategoryScore + rule.points;
  }, 0);
}

function getScores (match) {

  // GRIPE: it's not terrible to hardcode the categories, but it's not great either.
  // going with ok here because this is used for display purposes only, so if it doesn't work... oh well
  const scores = {
    autonomous: getCategoryScore(match.data.categories[0]),
    teleop: getCategoryScore(match.data.categories[1]),
    endGame: getCategoryScore(match.data.categories[2])
  };
  scores.total = scores.autonomous + scores.teleop + scores.endGame;
  return scores;
}

export function format (team) {
  return matchService.get({ team: team.number })
    .then((matches) => {
      const scores = matches.map(getScores);
      const avgScores = scores.reduce((runningAvgScores, currentScores) => {
        return {
          autonomous: (runningAvgScores.autonomous + currentScores.autonomous) / 2,
          teleop: (runningAvgScores.teleop + currentScores.teleop) / 2,
          endGame: (runningAvgScores.endGame + currentScores.endGame) / 2,
          total: (runningAvgScores.total + currentScores.total) / 2,
        };
      }, { autonomous: 0, teleop: 0, endGame: 0, total: 0 });

      return {
        id: team.id,
        name: team.name,
        number: team.number,
        isTop: avgScores.total > 120
      };
    });
}