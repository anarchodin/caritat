import _ from 'lodash';

function Ballot (votes, count) {
  let validp = _.every(votes, vote => {
    if (_.isString(vote)) return true;
    if (_.isArray(vote)) {
      if (_.every(vote, _.isString)) return true;
    }

    return false;
  });

  if (!validp) {
    throw new TypeError('Invalid votes.');
  }

  this.votes = _.cloneDeep(votes);
  this.ranks = ballotToRanks(votes);
  this.candidates = _.uniq(votes);
  this.count = count || 1;
}

Ballot.prototype.eliminate = function eliminate (candidate) {
  let validp = false;
  if (_.isString(candidate)) validp = true;
  if (_.isArray(candidate) && _.every(candidate, _.isString)) validp = true;
  if (!validp) return this;

  let toEliminate = _.castArray(candidate);

  var newVotes = _.compact(_.map(this.votes, function (entry) {
    if (_.isArray(entry)) {
      let diff = _.difference(entry,toEliminate);
      if (diff.length > 1) {
        return diff;
      } else if (diff.length === 1) {
        return diff[0];
      } else {
        return false;
      }
    } else if (toEliminate.indexOf(entry) !== -1) {
      return false;
    } else {
      return entry;
    }
  }));

  return new Ballot(newVotes, this.count);
};

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

  if (!!config.maxCandidates) {
    if (_.size(this.votes) > config.maxCandidates) return false;
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

export default Ballot;
