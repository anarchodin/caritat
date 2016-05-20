import _ from 'lodash';

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
  var theScores = scores(ballots, candidates);

  var sorted = _.orderBy(_.toPairs(theScores), x => { return x[1] }, ['desc']);
  return _.map(sorted, x => { return x[0] });
}

export default borda;
