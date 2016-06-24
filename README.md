# Caritat — vote counting tools

Caritat counts votes. Caritat is designed _only_ to provide the step from
ballots to results. It provides no mechanism for people to cast votes; this is
left to whatever code calls Caritat. A number of different counting mechanisms
are provided:

- [Simple plurality winner](https://en.wikipedia.org/wiki/First-past-the-post_voting)

- [Approval voting](https://en.wikipedia.org/wiki/Approval_voting)

- [Instant Runoff Voting](https://en.wikipedia.org/wiki/Instant-runoff_voting)

- [Borda count](https://en.wikipedia.org/wiki/Borda_count)

- [Condorcet methods](https://en.wikipedia.org/wiki/Condorcet_method)

    - [Condorcet winner](https://en.wikipedia.org/wiki/Condorcet_criterion) (only if one exists!)

    - [Schulze method](https://en.wikipedia.org/wiki/Schulze_method)

- [Single Transferable Vote](https://en.wikipedia.org/wiki/Single_transferable_vote)

    - [Meek method](http://www.votingmatters.org.uk/ISSUE1/P1.HTM) (see also [the second paper](http://www.votingmatters.org.uk/ISSUE1/P2.HTM))

Additional Condorcet and STV methods are on a TODO-list, as are party-list
proportional representation multi-winner methods. (Chiefly
[D'Hondt](https://en.wikipedia.org/wiki/D'Hondt_method), which is used for
parliamentary elections in the author's country of origin.)

## Installation and use

Boilerplate bores me. This is JavaScript code, which doesn't touch on anything
to do with HTML or the DOM. So you're _probably_ going to get it through `npm`
and use it in a node.js program somewhere. If not, the `dist/caritat.js` package
is UMD, so should work in most any context you put it. It is heavily reliant on
[lodash](https://lodash.com), though, so make sure you've got that stowed away
somewhere.

The code itself is written using ES2015 modules, and gets picked up that way by
[rollup](http://rollupjs.org) if you want to bundle it. (Again, you'll
need to figure out how to get lodash in there. I use
[babel-plugin-lodash](https://www.npmjs.com/package/babel-plugin-lodash).)

## Examples

Wikipedia uses a fairly consistent example in its articles on voting systems,
where a capital for Tennessee is being chosen. That example is constructed in
such a way that the chief three single-winner methods give differing results:
Plurality ("first past the post") selects Memphis, Instant runoff voting
("alternative vote") selects Knoxville, and Condorcet methods select Nashville.

So here's how to run these examples through caritat.

```javascript
import {Election, irv, plurality, condorcet} from 'caritat';

var election = new Election({
  candidates: ['Chattanooga', 'Knoxville', 'Memphis', 'Nashville']
});

// Voters near Memphis.
election.addBallot(['Memphis', 'Nashville', 'Chattanooga', 'Knoxville'], 42);
// Voters near Nashville.
election.addBallot(['Nashville', 'Chattanooga', 'Knoxville', 'Memphis'], 26);
// Voters near Chattanooga.
election.addBallot(['Chattanooga', 'Knoxville', 'Nashville', 'Memphis'], 15);
// Voters near Knoxville.
election.addBallot(['Knoxville', 'Chattanooga', 'Nashville', 'Memphis'], 17);

var pluralityWinner = plurality(election); // Will return Memphis.
var irvWinner = irv(election); // Will return Knoxville.
var condorcetWinner = condorcet.winner(election); // Will return Nashville.
```

## Origins and allowed uses

All of this is written by an inexperienced programmer who has way too much
interest in the different counting systems, partly as a hobby project and partly
for production use for a political party. (I didn't say I had a sane plan.)

There's a highly understandable convention of liberal licencing for JavaScript
code. Most people going for liberal go for short and concise statements of
intent. Me, I choose [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
(That actually _is_ short and concise, as lawyer-vetted licences go.) The short
version is: I don't care. As far as I'm concerned, this is public domain. Do
whatever. (The code is probably crap anyway.)
