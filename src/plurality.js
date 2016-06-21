import _ from 'lodash';
import {countFirstPrefs} from './utils';

function winner (election, config) {
  let ballots = election.ballots;
  let candidates = election.candidates;

  config = _.defaults(config, {
    seats: 1
  });

  var firstPrefs = countFirstPrefs(ballots, candidates);

  var sorted = _.orderBy(_.toPairs(firstPrefs), x => x[1], ['desc']);

  return _.take(_.map(sorted, x => x[0]), config.seats);
}

export default winner;
