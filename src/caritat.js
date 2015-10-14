define(["ballot", "condorcet", "plurality", "irv", "borda", "utils"],
function (Ballot, condorcet, plurality, irv, borda, utils) {

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
