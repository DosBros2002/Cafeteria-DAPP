const MenuManagement = artifacts.require("MenuManagement");
const OrderProcessing = artifacts.require("OrderProcessing");
const FastCoin = artifacts.require("FastCoin"); // Assuming FastCoin contract is also being deployed

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(MenuManagement);
  const menuManagementInstance = await MenuManagement.deployed();
  await deployer.deploy(FastCoin);
  const fastCoinInstance = await FastCoin.deployed(); 

  // Replace 'cafeteriaWalletAddress' with the actual Ethereum address of the cafeteria's wallet
  const cafeteriaWalletAddress = '0xAa7673ee308c10A7aC74d11A8A51310BaddeeF76'; 

  await deployer.deploy(OrderProcessing, menuManagementInstance.address, fastCoinInstance.address, cafeteriaWalletAddress, FastCoin.address);
};
