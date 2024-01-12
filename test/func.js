const MenuManagement = artifacts.require("MenuManagement");
const FastCoin = artifacts.require("FastCoin"); // Assuming FastCoin contract is also being deployed
const PromotionsAndDiscounts = artifacts.require("PromotionsAndDiscounts");
const OrderProcessing = artifacts.require("OrderProcessing");

module.exports = async function (callback) {
    const menu = await MenuManagement.deployed();
    console.log('here');    
    console.log(menu.address);
    const fc = await FastCoin.deployed();
    console.log('here1');
    const discount = await PromotionsAndDiscounts.deployed(); 
    console.log('here1.1');
    const order = await OrderProcessing.deployed();   
    console.log('here2');
    let discountDescription = "SALE !!!!";
    let discountPercentage = 50; 
    let validUntilTimestamp = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); 
    await discount.addDiscount(discountDescription, discountPercentage, validUntilTimestamp);
    let disc = await discount.getDiscount(0);
    console.log(disc);
    console.log(order.address);
    order.getaddress();
    await fc.approve(order.address,100000000);
    console.log('here3');
    await menu.addMenuItem("Burger",10000);
    console.log(fc.address);
    console.log('here4');
    const accounts = await web3.eth.getAccounts();
    console.log('here5');
    const sender = accounts[0];
    console.log('here6');
    const balance = await fc.balanceOf(sender);
    console.log('here7');
    console.log(balance.toString());
    console.log('here8');
    const get = menu.getMenuItem(0);
    console.log('here9');
    console.log('here10');
    await order.placeOrder([0],[1],0);
    console.log('here11');
    const balance1 = await fc.balanceOf(sender);
    console.log(balance1.toString());
    
    callback();
}