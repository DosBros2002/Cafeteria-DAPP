const MenuManagement = artifacts.require("MenuManagement");
const FastCoin = artifacts.require("FastCoin"); // Assuming FastCoin contract is also being deployed
const OrderProcessing = artifacts.require("OrderProcessing");

module.exports = async function (callback) {
    const menu = await MenuManagement.deployed();
    console.log('here');    
    console.log(menu.address);
    const fc = await FastCoin.deployed();
    console.log('here1');
    const order = await OrderProcessing.deployed();    
    console.log('here2');
    console.log(order.address);
    order.getaddress();
    await fc.approve(order.address,100000);
    console.log('here3');
    await menu.addMenuItem("Burger",1000);
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
    //console.log(get.name.toString());
    console.log('here10');
    await order.placeOrder([0],[1],0);
    console.log('here11');
    const balance1 = await fc.balanceOf(sender);
    console.log(balance1.toString());
    
    callback();
}