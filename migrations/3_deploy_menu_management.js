const MenuManagement = artifacts.require("MenuManagement");
const OrderProcessing = artifacts.require("OrderProcessing");
const FastCoin = artifacts.require("FastCoin"); 
const PromotionsAndDiscounts = artifacts.require("PromotionsAndDiscounts");
const LoyaltyRewards = artifacts.require("LoyaltyRewards");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(MenuManagement);
  const menuManagementInstance = await MenuManagement.deployed();
  await deployer.deploy(FastCoin);
  const fastCoinInstance = await FastCoin.deployed(); 
  await deployer.deploy(PromotionsAndDiscounts);
  const PromotionsAndDiscountsInstance = await PromotionsAndDiscounts.deployed();
  await deployer.deploy(LoyaltyRewards);
  const LoyaltyRewardsInstance = await LoyaltyRewards.deployed();
 

  // Replace 'cafeteriaWalletAddress' with the actual Ethereum address of the cafeteria's wallet
  const cafeteriaWalletAddress = '0xAa7673ee308c10A7aC74d11A8A51310BaddeeF76'; 

  await deployer.deploy( OrderProcessing,menuManagementInstance.address, PromotionsAndDiscountsInstance.address, cafeteriaWalletAddress, FastCoin.address,LoyaltyRewardsInstance.address);

};
