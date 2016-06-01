import Ballot from './ballot';
import Election from './election';
import * as condorcet from './condorcet';
import plurality from './plurality';
import irv from './irv';
import borda from './borda';
import * as stv from './stv';
import lot from './lot';

import * as utils from './utils';

export {Ballot, Election, condorcet, plurality, irv, borda, stv, utils, lot};

//define(["ballot", "condorcet", "plurality", "irv", "borda", "stv", "utils"],
//function (Ballot, condorcet, plurality, irv, borda, stv, utils) {
