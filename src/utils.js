import _ from 'lodash';

export function countFirstPrefs (ballots, candidates) {
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

export function countAppearances (ballots, candidates) {
  var appearances = Object.create(null);

  _.forEach(candidates, candidate => {
    appearances[candidate] = 0;
  });

  _.forEach(ballots, ballot => {
    _.forEach(ballot.candidates, candidate => {
      appearances[candidate] += ballot.count;
    });
  });

  return appearances;
}
