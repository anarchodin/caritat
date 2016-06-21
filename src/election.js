import Ballot from './ballot';

import _ from 'lodash';

function Election (config) {
  config = _.defaults(config, {
    allowTies: false,
    minSeats: 0,
    maxSeats: Infinity
  });

  if (config.ballots) {
    this.ballots = _.cloneDeep(config.ballots);
  } else {
    this.ballots = [];
  }

  if (!!config.candidates) {
    Object.defineProperty(this, '_providedCandidates', {
      value: _.cloneDeep(config.candidates),
      enumerable: false,
      writable: false,
      configurable: false
    });
  }

  Object.defineProperty(this, 'allowTies', {
    value: config.allowTies,
    enumerable: true,
    writable: false,
    configurable: false
  });

  Object.defineProperty(this, 'minSeats', {
    value: config.minSeats,
    enumerable: true,
    writable: false,
    configurable: false
  });

  Object.defineProperty(this, 'maxSeats', {
    value: config.maxSeats,
    enumerable: true,
    writable: false,
    configurable: false
  });

}

Object.defineProperty(Election.prototype, 'candidates', {
  get: function () {
    if (!!this._providedCandidates) {
      return this._providedCandidates;
    } else {
      return _.uniq(_.flatten(_.map(this.ballots, ballot => {
        let vote = ballot.votes;
        if (_.isArray(vote)) {
          return vote;
        } else {
          return [vote];
        }
      })));
    }
  },
  enumerable: true,
  configurable: false
});

Election.prototype.validBallot = function validBallot (ballot) {
  if (!!this._providedCandidates) {
    if (_.difference(ballot.candidates, this._providedCandidates).length !== 0) {
      return false;
    }
  }

  if (!!this.allowTies) {
    if (_.some(ballot.votes, _.isArray)) return false;
  }

  if (!!this.maxSeats) {
    if (_.size(ballot.votes) > this.maxSeats) return false;
  }

  if (!!this.minSeats) {
    if (_.size(ballot.votes) < this.minSeats) return false;
  }

  return true;
};

Election.prototype.addBallot = function addBallot (ballot) {
  if (!(ballot instanceof Ballot)) {
    ballot = new Ballot(ballot);
  }

  if (!this.validBallot(ballot)) {
    throw new Error("Ballot not valid.");
  } else {
    this.ballots.push(ballot);
    return true;
  }
};

export default Election;
