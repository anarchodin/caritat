define(["lodash", "condorcet/common", "condorcet/schulze"], function (_, common, schulze) {

var condorcet = {
  schulze: schulze
};

condorcet.winner = function condorcetWinner (ballots, candidates) {
  var winPairs = common.ballotArrayToPairs(ballots, candidates);
  var isWinner = Object.create(null);
  _.forEach(candidates, function (first) {
    var others = _.filter(candidates, function (second) {
      return first != second;
    });
    isWinner[first] = _.every(others, function (second) {
      if (winPairs[first][second] > winPairs[second][first]) {
        return true;
      } else {
        return false;
      }
    });
  });

  var winner = _.findKey(isWinner);
  if (winner) {
    return winner;
  } else {
    return false;
  }
};

return condorcet;

});
