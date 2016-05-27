import _ from 'lodash';

import {countFirstPrefs} from './utils';

function irv (election) {
  "use strict";
  var curBallots, curCandidates, voteCount, firstPrefs, ratios, winner, loser;

  curBallots = election.ballots;
  curCandidates = election.candidates;

  while (true) {
    voteCount = _.sumBy(curBallots, 'count');
    firstPrefs = countFirstPrefs(curBallots, curCandidates);
    ratios = _.mapValues(firstPrefs, function (votes) {
      return votes / voteCount;
    });

    winner = _.findKey(ratios, function (x) {return x > 0.5; });
    if (!!winner) return winner;

    loser = _.map(_.orderBy(_.toPairs(firstPrefs), x => { return x[1] }, ['asc']), x => { return x[0] })[0];

    curBallots = _.compact(_.map(curBallots, function (ballot) {
      return ballot.eliminate(loser);
    }));
    curCandidates = _.without(curCandidates, loser);

  }
}

export default irv;
