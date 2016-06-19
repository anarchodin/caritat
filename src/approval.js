import _ from "lodash";
import {countAppearances} from "./utils";

function approvalVote (election, config) {
  config = _.defaults(config, {
    seats: 1,
    tiebreak: _.sample
  });

  let appearances = countAppearances(election.ballots, election.candidates);

  let sorted = _.orderBy(_.toPairs(appearances), x => x[1], ['desc']);
  let orderedCandidates = _.map(sorted, x => x[0]);

  return _.take(orderedCandidates, config.seats);
}

export default approvalVote;
