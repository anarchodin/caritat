import _ from 'lodash';
import {countFirstPrefs} from './utils';

function winner (election) {
  let ballots = election.ballots;
  let candidates = election.candidates;

  var firstPrefs = countFirstPrefs(ballots, candidates);

  var sorted = _.orderBy(_.toPairs(firstPrefs), x => { return x[1] }, ['desc']);

  return _.map(sorted, x => { return x[0] })[0];
}

export default winner;
