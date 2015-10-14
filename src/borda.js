define(["lodash"], function (_) {

function bordaScore (ballot, candidates) {
  var scores = Object.create(null);
  var maxScore = candidates.length - 1;

  _.forEach(ballot.votes, function (candidate, rank) {
    var score = ballot.count * (maxScore - rank);

    if (_.isString(candidate)) {
      scores[candidate] = score;
    } else if (_.isArray(candidate)) {
      score = (score * candidate.length) / candidate.length;
      _.forEach(candidate, function (candidate) {
        scores[candidate] = score;
      });
    }
  });

  return scores;

}

function scores (ballots, candidates) {
  var scores = Object.create(null);
  _.forEach(candidates, function (candidate) {
    scores[candidate] = 0;
  });

  _.forEach(ballots, function (ballot) {
    _.forEach(bordaScore(ballot, candidates), function (score, candidate) {
      scores[candidate] += score;
    });
  });

  return scores;
    
}

function borda (ballots, candidates) {
  return _(scores(ballots, candidates))
    .pairs()
    .map(function (pair) { return { name: pair[0], score: pair[1]}; })
    .sortByOrder('score', ['desc'])
    .pluck('name').value();
}

return borda;

});
