define(['lodash'], function (_) {

function Ballot (votes, count) {
  this.votes = _.cloneDeep(votes);
  this.ranks = ballotToRanks(votes);
  this.candidates = _(votes).uniq().value();
  this.count = count || 1;
}

Ballot.prototype.eliminate = function eliminate (candidate) {
  if (!_.isString(candidate)) return this;

  var newVotes = _(this.votes).map(function (entry) {
    if (entry === candidate) {
      return false;
    } else if (_.isArray(entry)) {
      return _.without(entry,candidate);
    } else {
      return entry;
    }
  }).compact().value();

  return new Ballot(newVotes, this.count);
}

Ballot.prototype.isValid = function isValid (config) {
  config = _.defaults(config, {
    allowTies: true
  });

  if (!!config.candidates) {
    if (_.difference(this.candidates, config.candidates).length !== 0) {
      return false;
    }
  }

  if (!!config.allowTies) {
    if (_.some(this.votes, _.isArray)) return false;
  }


  return true;
};

function ballotToRanks (ballot) {
  var result;
  
  result =  _.reduce(ballot, function (result, candidate, rank) {
    if (_.isString(candidate)) {
      result[candidate] = rank;
      return result;
    } else if (_.isArray(candidate)) {
      _.forEach(candidate, function (candidate) {
        result[candidate] = rank;
      });
      return result;
    }
  }, Object.create(null));

  return result;
}

return Ballot;

});
