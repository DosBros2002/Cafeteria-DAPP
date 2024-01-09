const LoyaltyRewards = artifacts.require("LoyaltyRewards");

module.exports = function (deployer) {
  deployer.deploy(LoyaltyRewards);
};
