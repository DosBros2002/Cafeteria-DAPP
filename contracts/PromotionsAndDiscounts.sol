// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
contract PromotionsAndDiscounts {
    address public owner;
    mapping(uint => Discount) public discounts;
    uint public nextDiscountId;

    struct Discount {
        uint id;
        string description;
        uint discountPercent;
        uint validUntil;
        bool isActive;
    }

    event DiscountAdded(uint id, string description, uint discountPercent, uint validUntil);
    event DiscountUpdated(uint id, bool isActive);
     event DiscountItemGet(uint id,string description,uint dsicountPercent,bool isActive);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    function addDiscount(string memory _description, uint _discountPercent, uint _validUntil) public onlyOwner {
    require(_discountPercent > 0 && _discountPercent <= 100, "Invalid discount percent");
    require(_validUntil > block.timestamp, "Invalid expiration time");

    discounts[nextDiscountId] = Discount(nextDiscountId, _description, _discountPercent, _validUntil, true);
    emit DiscountAdded(nextDiscountId, _description, _discountPercent, _validUntil);
    nextDiscountId++;

    }

    function updateDiscountStatus(uint _id, bool _isActive) public onlyOwner {
        require(_id < nextDiscountId, "Discount does not exist");
        discounts[_id].isActive = _isActive;
        emit DiscountUpdated(_id, _isActive);
    }

    function getDiscount(uint _id) public returns (uint,string memory,uint,uint,bool) {
        require(_id < nextDiscountId, "Discount does not exist");
        Discount memory disc = discounts[_id];
        emit DiscountItemGet(disc.id, disc.description, disc.discountPercent, disc.isActive);
        return (disc.id, disc.description, disc.discountPercent,disc.validUntil,true);
       
    }
}
