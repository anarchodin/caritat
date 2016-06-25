import _ from 'lodash';

import {countFirstPrefs} from './utils';

function irv (election, config) {
  var curBallots, curCandidates, voteCount, firstPrefs, ratios, winner, loser;

  config = _.defaults(config, {
    threshold: 0.5,
    tiebreak: _.sample,
    log: _.noop
  });

  curBallots = election.ballots;
  curCandidates = election.candidates;

  while (true) {
    // jshint loopfunc:true
    voteCount = _.sumBy(curBallots, 'count');
    firstPrefs = countFirstPrefs(curBallots, curCandidates);
    ratios = _.mapValues(firstPrefs, votes => votes / voteCount);

    winner = _.findKey(ratios, function (x) {return x > config.threshold; });
    if (!!winner) return winner;

    loser = _.map(_.orderBy(_.toPairs(firstPrefs), x => x[1], ['asc']), x => x[0])[0];
    config.log({
      type: 'eliminated',
      candidate: loser,
      state: firstPrefs
    });

    curBallots = _.compact(_.map(curBallots, function (ballot) {
      return ballot.eliminate(loser);
    }));
    curCandidates = _.without(curCandidates, loser);

  }
}

export default irv;
