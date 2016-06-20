var caritat = require('../dist/caritat');
var Ballot = caritat.Ballot;

var expect = require('chai').expect;

describe('Ballot', function () {
  it('should reject a ballot with non-string votes', function () {
    var badBallots = function () {
      new Ballot([24, 16, 5, ['hi', 6]]);
    };

    expect(badBallots).to.throw(TypeError);

  });

  it('should allow tied votes', function () {
    var goodBallots = function () {
      new Ballot([['foo', 'bar'], 'smu']);
    }

    expect(goodBallots).not.to.throw(TypeError);

  });

  describe('eliminate', function () {
    it('should remove a candidate from inside a tie', function () {
      var testBallot = new Ballot([['Tom', 'Dick'], 'Harry']);
      var eliminated = testBallot.eliminate('Tom');
      expect(eliminated.candidates).not.to.include('Tom');
      expect(eliminated.candidates).to.include('Dick');
    });

    it('should remove multiple candidates', function () {
      var testBallot = new Ballot(['Tom', 'Dick', 'Harry', 'Gísli', 'Eiríkur', 'Helgi']);
      var eliminated = testBallot.eliminate(['Gísli', 'Eiríkur', 'Helgi']);
      expect(eliminated.candidates).not.to.include('Gísli');
      expect(eliminated.candidates).not.to.include('Eiríkur');
      expect(eliminated.candidates).not.to.include('Helgi');
      expect(eliminated.candidates).to.include('Tom');
      expect(eliminated.candidates).to.include('Dick');
      expect(eliminated.candidates).to.include('Harry');
    });
  });
});
