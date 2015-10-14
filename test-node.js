var _ = require('lodash');
var caritat = require('./index.js');

var Ballot = caritat.Ballot;

var candidates = [
  'Chattanooga',
  'Knoxville',
  'Memphis',
  'Nashville'
];

var Memphis = new Ballot([
  'Memphis',
  'Nashville',
  'Chattanooga',
  'Knoxville'
], 42);

var Nashville = new Ballot([
  'Nashville',
  'Chattanooga',
  'Knoxville',
  'Memphis'
], 26);

var Chattanooga = new Ballot([
  'Chattanooga',
  'Knoxville',
  'Nashville',
  'Memphis'
], 15);

var Knoxville = new Ballot([
  'Knoxville',
  'Chattanooga',
  'Nashville',
  'Memphis'
], 17);

var Tennessee = [Chattanooga, Knoxville, Memphis, Nashville];

console.log("Plurality winner: " + caritat.plurality(Tennessee, candidates));
console.log("Condorcet winner: " + caritat.condorcet.winner(Tennessee, candidates));
console.log("IRV winner: " + caritat.irv(Tennessee, candidates));
console.log("Schulze result: " + JSON.stringify(caritat.condorcet.schulze(Tennessee, candidates)));
console.log("Borda result: " + JSON.stringify(caritat.borda(Tennessee, candidates)));

console.log("Meek test:\n" + JSON.stringify(caritat.stv.meek(Tennessee, {candidates: candidates, seats: 2})));
