define(["ballot", "condorcet", "plurality", "irv", "borda", "stv", "utils"],
function (Ballot, condorcet, plurality, irv, borda, stv, utils) {

return {
  Ballot: Ballot,
  condorcet: condorcet,
  plurality: plurality,
  irv: irv,
  borda: borda,
  stv: stv,

  utils: utils
};

});
