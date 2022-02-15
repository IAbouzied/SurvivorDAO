var Citizens = artifacts.require("Citizens");
var TribalCouncil = artifacts.require("TribalCouncil");

module.exports = function(deployer) {
  deployer.deploy(Citizens).then(() => {
    return deployer.deploy(TribalCouncil, Citizens.address);
  });
};