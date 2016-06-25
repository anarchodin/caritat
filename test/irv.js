"use strict";

var caritat = require('../dist/caritat');
var Election = caritat.Election;
var Ballot = caritat.Ballot;
var irv = caritat.irv;

var expect = require('chai').expect;

describe('Instant Runoff Voting', function () {
  it('should return an outright majority winner', function () {
    var election = new Election();
    election.addBallot(new Ballot(['Gísli', 'Eiríkur', 'Helgi'], 2));
    election.addBallot(['Helgi', 'Eiríkur', 'Gísli']);

    expect(irv(election)).to.equal('Gísli');
  });

  it('should eliminate the fewest votes first', function () {
    var election = new Election();
    election.addBallot(new Ballot(['Gísli', 'Eiríkur', 'Helgi'], 2));
    election.addBallot(new Ballot(['Eiríkur', 'Helgi', 'Gísli'], 2));

    let eliminated = [];

    irv(election, {
      log(ev) {
        if (ev.type === 'eliminated') {
          eliminated.push(ev.candidate);
        }
      }
    });

    expect(eliminated[0]).to.equal('Helgi');
  });
});
