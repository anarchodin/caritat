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
    if (!!winner) {
      config.log({
        type: 'elected',
        candidate: winner,
        state: firstPrefs
      });
      return winner;
    }

    let lowestVote = _.min(_.values(firstPrefs));
    let lowestCandidates = _.keys(_.pickBy(firstPrefs, x => x === lowestVote));

    if (_.size(lowestCandidates) === 1) {
      loser = lowestCandidates[0];
    } else if (lowestVote === 0){
      // special case for candidates with no votes: they _all_ go
      // this can only happen in the first round
      loser = lowestCandidates;
    } else {
      loser = config.tiebreak(lowestCandidates);
      config.log({
        type: 'tiebreak',
        candidate: loser,
        tied: lowestCandidates,
        state: firstPrefs
      });
    }

    _.forEach(_.castArray(loser), loser => {
      config.log({
        type: 'eliminated',
        candidate: loser,
        state: firstPrefs
      });

      curCandidates = _.without(curCandidates, loser);
    });

    curBallots = _.compact(_.map(curBallots, function (ballot) {
      return ballot.eliminate(_.castArray(loser));
    }));

  }
}

export default irv;
