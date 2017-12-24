const deadSynonyms = require('./dead-synonyms');

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
  let numOfDead = 0;
  const scores = team.matches.map((match)=> {
    const didDie = !!deadSynonyms.find((ds) => match.comments.toLowerCase().includes(ds));
    if (didDie) {
      numOfDead++;
    }
    return getScores(match);
  });
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
    matches: team.matches,
    isTop: avgScores.total > 120,
    averageScores: avgScores,
    timesDead: numOfDead
  };
}