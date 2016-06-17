var caritat = require('../index.js');
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
});
