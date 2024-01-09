const PromotionsAndDiscounts = artifacts.require("PromotionsAndDiscounts");

module.exports = function (deployer) {
  deployer.deploy(PromotionsAndDiscounts);
};
