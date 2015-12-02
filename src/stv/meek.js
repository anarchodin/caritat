define(["lodash"], function (_) {

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

        if (totalWeight == 0) { return false; }

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

  state.quota = (state.totalVotes - state.excess) * state.droopFactor;
  
  return state;
}

function updateWeights (oldState) {
  var state = _.cloneDeep(oldState);
  _.forEach(state.candidates, function (candidate, name) {
    if (candidate.status === 'elected') {
      var ratio = state.quota / candidate.votes;
      candidate.weight *= ratio;
    }
  });

  return state;
}

function isConverged (state) {
  var converged = true;
  _.forEach(_.where(state.candidates, {status: 'elected'}), function (candidate) {
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
  var someoneElected = false;
  var electAll = false;

  var elected = _.pick(state.candidates, function (candidate) {
    return candidate.status === 'elected';
  });

  var hopefuls = _.pick(state.candidates, function (candidate) {
    return candidate.status === 'hopeful';
  });

  if (state.seats == _.size(elected) + _.size(hopefuls)) {
    electAll = true;
  }

  _.forEach(_.where(state.candidates, {status: 'hopeful'}), function (candidate) {
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
  var votes = _(state.candidates)
      .pick(function (candidate) {
        return candidate.status === 'hopeful';
      })
      .mapValues('votes').value();

  if (_.isEmpty(votes)) {
    throw "No hopefuls remain.";
  }

  var lowestVote = _.min(votes);

  var retVal = _(votes)
      .pick(function (votes) {
        return votes == lowestVote;
      })
      .keys().value();

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
      throw "There's a problem here.";
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
  
function meek (ballots, config) {
  var retVal;
  var log = [];
  var state = Object.create(null);
  state.candidates = Object.create(null);

  _.forEach(config.candidates, function (candidate) {
    state.candidates[candidate] = {
      status: 'hopeful',
      votes: 0,
      weight: 1
    };
  });

  if (!_.isNumber(config.seats)) { throw "The number of seats must be a number."; }
  state.seats = config.seats;

  state.excess = 0;
  state.totalVotes = _.sum(ballots, "count");
  state.droopFactor = 1 / (config.seats + 1);
  state.quota = state.totalVotes * state.droopFactor;
  state.electedCount = 0;

  while (state.electedCount < config.seats) {
    do {
      state = countVotes(state, ballots);
      state = updateWeights(state);
    } while (!isConverged(state));
    state = declareElected(state) || eliminateLowest(state);
    log.push(state);
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

return meek;

});
