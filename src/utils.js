define(["lodash"], function (_) {

var utils = {};

utils.countFirstPrefs = function (ballots, candidates) {
  var firstPrefs = Object.create(null);

  _.forEach(candidates, function (candidate) {
    firstPrefs[candidate] = 0;
    _.forEach(ballots, function (ballot) {
      if (ballot.ranks[candidate] === 0) {
        firstPrefs[candidate] += ballot.count;
      }
    });
  });

  return firstPrefs;
}

return utils;

});
