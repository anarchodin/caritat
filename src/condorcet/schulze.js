import _ from 'lodash';

import {ballotArrayToPairs} from './common';

let margin = (x, y) => x - y;

export function pairsToStrongestPaths(pairs, candidates, strength = margin) {
  var paths = Object.create(null);

  _.forEach(candidates, function (first) {
    paths[first] = Object.create(null);
    var others = _.without(candidates, first);
    _.forEach(others, function (second) {
      let linkStrength = 0;

      // register only _wins_
      if (pairs[first][second] > pairs[second][first]) {
        linkStrength = strength(pairs[first][second],pairs[second][first]);
      }
      paths[first][second] = linkStrength;
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

function schulze (election, config) {
  config = _.defaults(config, {
    log: _.noop,
    tiebreak: _.sample,
    seats: 1
  });

  let ballots = election.ballots;
  let candidates = election.candidates;

  var pairs = ballotArrayToPairs(ballots, candidates);
  var paths = pairsToStrongestPaths(pairs, candidates, config.strength);

  let result = _.clone(candidates);

  result = result.sort(function (first, second) {
    let diff = paths[second][first] - paths[first][second];
    if (diff === 0) {
      // tiebreak needed
      let loser = config.tiebreak([first, second]);
      config.log({
        type: 'tiebreak',
        candidate: loser,
        tied: [first, second]
      });

      diff = loser === first ? 1 : -1;
    }

    return diff;

  });

  if (config.seats === 1) {
    return result[0];
  } else {
    let winners = _.take(result, config.seats);
    _.forEach(winners, winner => {
      config.log({
        type: 'elected',
        candidate: winner
      });
    });

    return winners;
  }
}

export default schulze;
