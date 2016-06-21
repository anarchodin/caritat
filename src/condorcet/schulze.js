import _ from 'lodash';

import {ballotArrayToPairs} from './common';

export function pairsToStrongestPaths(pairs, candidates) {
  var paths = Object.create(null);
  var result = _.clone(candidates);

  _.forEach(candidates, function (first) {
    paths[first] = Object.create(null);
    var others = _.without(candidates, first);
    _.forEach(others, function (second) {
      if (pairs[first][second] > pairs[second][first]) {
        paths[first][second] = pairs[first][second];
      } else {
        paths[first][second] = 0;
      }
    });
  });

  _.forEach(candidates, function (first) {
    var others = _.without(candidates, first);
    _.forEach(others, function (second) {
      _.forEach(_.without(others, second), function (third) {
        paths[second][third] = _.max([paths[second][third],
                                      _.min([paths[second][first],
                                             paths[first][third]])]);
      });
    });
  });

  return paths;
}

function schulze (election) {
  let ballots = election.ballots;
  let candidates = election.candidates;

  var pairs = ballotArrayToPairs(ballots, candidates);
  var paths = pairsToStrongestPaths(pairs, candidates);

  let result = _.clone(candidates);

  result = result.sort(function (first, second) {
    return paths[second][first] - paths[first][second];
  });

  return result;
}

export default schulze;
