import _ from 'lodash';

function countVotes (oldState, ballots) {
  var state = _.cloneDeep(oldState);

  state.excess = 0;
  _.forEach(state.candidates, function (candidate) {
    candidate.votes = 0;
  });

  _.forEach(ballots, function (ballot) {
    var value = ballot.count;
    _.forEach(ballot.votes, function (candidate) {
      if (_.isArray(candidate)) {
        var totalWeight = 0;
        _.forEach(candidate, function (name) {
          totalWeight += state.candidates[name].weight;
        });

        if (totalWeight === 0) { return false; }

        _.forEach(candidate, function (name) {
          var portion = state.candidates[name].weight / totalWeight;
          var voteUsed = portion * state.candidates[name].weight;
          state.candidates[name].votes += value * voteUsed;
          value *= 1 - portion;
        });
      } else {
        state.candidates[candidate].votes += value * state.candidates[candidate].weight;
        value *= 1 - state.candidates[candidate].weight;
      }
    });
    state.excess += value;

  });

  state.quota = (state.totalVotes - state.excess) * state.hbFactor;

  return state;
}

function updateWeights (oldState) {
  var state = _.cloneDeep(oldState);
  _.forEach(state.candidates, function (candidate) {
    if (candidate.status === 'elected') {
      var ratio = state.quota / candidate.votes;
      candidate.weight *= ratio;
    }
  });

  return state;
}

function isConverged (state) {
  var converged = true;
  _.forEach(_.filter(state.candidates, {status: 'elected'}), function (candidate) {
    var ratio = state.quota / candidate.votes;
    if (ratio > 1.00001 || ratio < 0.9999) {
      converged = false;
      return false;
    }
  });

  return converged;
}

function declareElected (oldState) {
  var state = _.cloneDeep(oldState);
  var potentials = [];
  var someoneElected = false;
  var electAll = false;

  var elected = _.pickBy(state.candidates, function (candidate) {
    return candidate.status === 'elected';
  });

  var hopefuls = _.pickBy(state.candidates, function (candidate) {
    return candidate.status === 'hopeful';
  });

  if (state.seats === _.size(elected) + _.size(hopefuls)) {
    electAll = true;
  }

  potentials = _.keys(_.pickBy(state.candidates, candidate => {
    if (candidate.status === 'hopeful' && candidate.votes > state.quota) {
      return true;
    } else {
      return false;
    }
  }));

  // if there are more over quota than there are seats, eliminate one randomly
  // the mathematics involved should mean that suffices
  if ((_.size(potentials) + state.electedCount) > state.seats) {
    state = eliminate(state, _.sample(potentials));
  }

  _.forEach(_.filter(state.candidates, {status: 'hopeful'}), function (candidate) {
    if (candidate.votes > state.quota || electAll) {
      someoneElected = true;
      candidate.status = 'elected';
      state.electedCount++;
    }
  });

  if (someoneElected) {
    return state;
  } else {
    return false;
  }
}

function findLowest (state) {
  var active = _.pickBy(state.candidates, candidate => {
    return candidate.status === 'hopeful';
  });

  var votes = _.mapValues(active, 'votes');

  if (_.isEmpty(votes)) {
    throw new Error("No hopefuls remain. Are there enough candidates?");
  }

  var lowestVote = _.min(_.values(votes));

  var retVal = _.keys(_.pickBy(active, cand => {
    return cand.votes === lowestVote;
  }));

  return retVal;
}

function eliminate (oldState, names) {
  var state = _.cloneDeep(oldState);
  function __eliminate (name) {
    var toEliminate = state.candidates[name];
    if (_.isObject(toEliminate)) {
      toEliminate.status = 'eliminated';
      toEliminate.weight = 0;
    } else {
      throw new Error("Can't find candidate to be eliminated.");
    }
  }

  if (_.isArray(names)) {
    _.forEach(names, __eliminate);
  } else {
    __eliminate(names);
  }

  return state;
}

function eliminateLowest (state) {
  var lowestCandidate = _.sample(findLowest(state));
  return eliminate(state, lowestCandidate);
}

function meek (election, config) {
  let ballots = election.ballots;

  var retVal;
  var log = [];
  var state = Object.create(null);
  state.candidates = Object.create(null);

  _.forEach(election.candidates, function (candidate) {
    state.candidates[candidate] = {
      status: 'hopeful',
      votes: 0,
      weight: 1
    };
  });

  if (!_.isInteger(config.seats)) { throw new TypeError("The number of seats must be an integer."); }
  state.seats = config.seats;

  state.excess = 0;
  state.totalVotes = _.sumBy(ballots, "count");
  state.hbFactor = 1 / (config.seats + 1);
  state.quota = state.totalVotes * state.hbFactor;
  state.electedCount = 0;

  while (state.electedCount < config.seats) {
    do {
      state = countVotes(state, ballots);
      state = updateWeights(state);
    } while (!isConverged(state));
    state = declareElected(state) || eliminateLowest(state);
    log.push(_.cloneDeep(state));
  }

  retVal = _.filter(_.keys(state.candidates), function (candidate) {
    if (state.candidates[candidate].status === 'elected') {
      return true;
    } else {
      return false;
    }
  });
  retVal.log = log;

  return retVal;
}

export default meek;
