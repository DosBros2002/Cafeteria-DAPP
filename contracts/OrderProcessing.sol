// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./FastCoin.sol";
import "./MenuManagement.sol";
import "./PromotionsAndDiscounts.sol";

contract OrderProcessing {
    struct Order {
        uint id;
        address customer;
        uint[] itemIds;
        uint[] quantities;
        uint256 totalPrice;
        bool isCompleted;
    }

    struct MenuItem {
        uint id;
        string name;
        uint price;
        bool isAvailable;
    }

    mapping(uint => Order) public orders;
    uint public nextOrderId;
    address public manager;
    MenuManagement menuManagement;
    PromotionsAndDiscounts promotionsAndDiscounts;
    FastCoin public fastcoinContract;

    address public cafeteriaWallet = 0x1a195a9e85eb5865720f215f4380871E5a1c5b28; 

    event OrderPlaced(uint orderId, address customer, uint[] itemIds, uint[] quantities, uint totalPrice);
    event OrderCompleted(uint orderId);
    event getAddress(address addy);

    constructor(address _menuManagementAddress,address _promotionsanddiscounts,address _cafeteriaWallet,address _fastcoinContract) {
        manager = msg.sender;
        menuManagement = MenuManagement(_menuManagementAddress);
        cafeteriaWallet = _cafeteriaWallet;
        fastcoinContract = FastCoin(_fastcoinContract);
        promotionsAndDiscounts = PromotionsAndDiscounts(_promotionsanddiscounts);
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call this");
        _;
    }

    function getaddress() public{
        emit getAddress (address(this)); 
    }

    function setPromotionsAndDiscountsAddress(address _address) public onlyManager {
        promotionsAndDiscounts = PromotionsAndDiscounts(_address);
    }

    function placeOrder(uint[] memory _itemIds, uint[] memory _quantities , uint _discountId) public {
        uint256 totalPrice_1 = 0;
        for (uint i = 0; i < _itemIds.length ; i++) {
            (, , uint price, bool isAvailable) = menuManagement.getMenuItem(_itemIds[i]);
            require(isAvailable, "Item not available");
            totalPrice_1 += price * _quantities[i];
        }
       // Apply discount if available
        if (_discountId != 0) {
            (, , uint discountPercent, uint validUntil, bool isActive) = promotionsAndDiscounts.getDiscount(_discountId);
            if (isActive && block.timestamp <= validUntil) {
                uint discountAmount = totalPrice_1 * discountPercent / 100;
                totalPrice_1 -= discountAmount; // Apply the discount
            }
        }
     //   require(fastcoinContract.approve(address(this), totalPrice), "Approval failed");
     //   require(fastcoinContract.approve(msg.sender, totalPrice), "Approval failed");

        // Pay for the order
       // fastcoinContract.payForOrder(totalPrice);
       // require(fastcoinContract.approve(address(this), totalPrice_1+20), "Approval failed");
        require(fastcoinContract.transferFrom(msg.sender, address(this), totalPrice_1), "Payment failed");
        orders[nextOrderId] = Order(nextOrderId, msg.sender, _itemIds, _quantities, totalPrice_1, false);
        emit OrderPlaced(nextOrderId, msg.sender, _itemIds, _quantities, totalPrice_1);
        nextOrderId++;
    }

  

    function completeOrder(uint _orderId) public onlyManager {
        require(_orderId < nextOrderId, "Order does not exist");
        require(!orders[_orderId].isCompleted, "Order is already completed");
        orders[_orderId].isCompleted = true;
        emit OrderCompleted(_orderId);
    }

    function getOrder(uint _orderId) public view returns (Order memory) {
        require(_orderId < nextOrderId, "Order does not exist");
        return orders[_orderId];
    }
}
