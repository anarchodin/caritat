import _ from 'lodash';
import {countFirstPrefs} from './utils';

function winner (election, config) {
  let ballots = election.ballots;
  let candidates = election.candidates;

  config = _.defaults(config, {
    seats: 1,
    tiebreak: _.sample,
    log: _.noop
  });

  let firstPrefs = countFirstPrefs(ballots, candidates);
  let lowestWinningVote = _.flow([
    _.values,
    x => _.orderBy(x, _.identity, ['desc']),
    x => _.take(x, config.seats),
    _.last
  ])(firstPrefs);

  let sorted = _.filter(candidates, x => {
    return firstPrefs[x] >= lowestWinningVote;
  });

  sorted.sort((x, y) => {
    let diff = firstPrefs[x] - firstPrefs[y];
    if (diff === 0) {
      let loser = config.tiebreak([x, y]);
      config.log({
        type: 'tiebreak',
        candidate: loser,
        tied: [x, y].sort()
      });
      diff = (loser === x ? 1 : -1);
    }
    return diff;
  });

  if (config.seats === 1) {
    return sorted[0];
  } else {
    return _.take(sorted, config.seats);
  }
}

export default winner;
