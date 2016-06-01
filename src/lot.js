import _ from 'lodash';

function draw (election, config) {
  config = _.defaults(config, {
    seats: 1,
    tiebreak: _.sample
  });

  var candidates, chosen;

  candidates = _.clone(election.candidates);
  chosen = [];

  while (_.size(chosen) < config.seats) {
    var choose = config.tiebreak(candidates);
    chosen.push(choose);
    candidates = _.without(candidates, choose);
  }
  if (config.seats === 1) {
    return chosen[0];
  } else {
    return chosen;    
  }
}

export default draw;
