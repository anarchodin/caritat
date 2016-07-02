"use strict";

let _ = require('lodash');

const caritat = require('../dist/caritat');
const Ballot = caritat.Ballot;
const Election = caritat.Election;
const plurality = caritat.plurality;

const expect = require('chai').expect;
const sinon = require('sinon');

describe('Plurality (First Past the Post)', function () {
  it('should pick the candidate with most votes', function () {
    let election = new Election();
    election.addBallot(new Ballot(['Gísli'], 3));
    election.addBallot(new Ballot(['Eiríkur'], 2));
    election.addBallot(new Ballot(['Helgi'], 2));

    expect(plurality(election)).to.equal('Gísli');
  });

  it('should call a tiebreaker', function () {
    let election = new Election();
    election.addBallot(new Ballot(['Gísli'], 2));
    election.addBallot(new Ballot(['Eiríkur'], 2));
    election.addBallot(new Ballot(['Helgi']));

    let spy = sinon.spy(_.sample);

    plurality(election, {
      tiebreak: spy
    });

    expect(spy.callCount).to.equal(1);
  });

  it('should return an array if more than one seat is requested', function () {
    let election = new Election();
    election.addBallot(new Ballot(['Gísli'], 2));
    election.addBallot(new Ballot(['Eiríkur'], 3));
    election.addBallot(new Ballot(['Helgi'], 1));

    expect(plurality(election, {seats: 2})).to.have.lengthOf(2);
  });

  it('should tiebreak later seats if required', function () {
    let election = new Election();
    election.addBallot(new Ballot(['Gísli'], 2));
    election.addBallot(new Ballot(['Eiríkur'], 1));
    election.addBallot(new Ballot(['Helgi'], 1));

    let spy = sinon.spy(_.sample);

    plurality(election, {
      tiebreak: spy,
      seats: 2
    });

    expect(spy.callCount).to.equal(1);
  });

  it('should not tiebreak for more seats than needed', function () {
    let election = new Election();
    election.addBallot(new Ballot(['Gísli'], 2));
    election.addBallot(new Ballot(['Eiríkur'], 1));
    election.addBallot(new Ballot(['Helgi'], 1));

    let spy = sinon.spy(_.sample);

    plurality(election, {
      tiebreak: spy,
      seats: 1
    });

    expect(spy.callCount).to.equal(0);
  });
});
