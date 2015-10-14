define(["lodash", "utils"], function (_, utils) {

function irv (ballots, candidates) {
  "use strict";
  var curBallots, curCandidates, voteCount, firstPrefs, ratios, winner, loser;

  curBallots = ballots;
  curCandidates = candidates;

  while (true) {
    voteCount = _.sum(curBallots, 'count');
    firstPrefs = utils.countFirstPrefs(curBallots, curCandidates);
    ratios = _.mapValues(firstPrefs, function (votes) {
      return votes / voteCount;
    });

    winner = _.findKey(ratios, function (x) {return x > 0.5; });
    if (!!winner) return winner;

    loser = _(firstPrefs).pairs().map(function (pair) {
      return {
        name: pair[0],
        votes: pair[1]
      };
    }).sortBy('votes').pluck('name').first();
    curBallots = _.compact(_.map(curBallots, function (ballot) {
      return ballot.eliminate(loser);
    }));
    curCandidates = _.without(curCandidates, loser);

  }
}

return irv;

});
