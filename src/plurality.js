define(["lodash", "utils"], function (_, utils) {

function pluralityWinner (ballots, candidates) {
  var firstPrefs = utils.countFirstPrefs(ballots, candidates);

  return _(firstPrefs).pairs()
    .map(function (pair) { return { name: pair[0], votes: pair[1] }; })
    .sortByOrder('votes', ['desc'])
    .pluck('name').first();
}

return pluralityWinner;

});
