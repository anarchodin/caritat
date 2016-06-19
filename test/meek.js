var caritat = require('../dist/caritat');
var Election = caritat.Election;
var meek = caritat.stv.meek;

var expect = require('chai').expect;

describe('Single Transferable Vote', function () {
  describe('Meek\'s Method', function () {
    it('should give the right number of seats', function () {
      var ballots = [
        ["Jóhann","Indriði","Kjartan"],
        ["Indriði","Jóhann","Kjartan"],
        ["Indriði","Kjartan","Jóhann"],
        ["Kjartan","Indriði","Jóhann"]
      ];
      var election = new Election();
      ballots.forEach(x => election.addBallot(x));

      expect(meek(election, {seats: 2})).to.have.length(2);

    });
  });
});
