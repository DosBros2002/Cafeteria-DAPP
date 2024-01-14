// SPDX-License-Identifier: MIT
//pragma solidity ^0.8.11;
pragma solidity >=0.4.22 <0.9.0;

contract LoyaltyRewards {
    address public owner;
    mapping(address => uint) public loyaltyPoints;
    uint public constant pointsPerEther = 100;

    event PointsEarned(address indexed customer, uint points);
    event PointsRedeemed(address indexed customer, uint points);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    function earnPoints(address customer) external payable {
        //require(msg.value > 0, "No Ether sent");
        uint points = msg.value * pointsPerEther;
        points = points + 10;
        loyaltyPoints[customer] += points;
        emit PointsEarned(customer, points);
    }

    function redeemPoints(address customer, uint points) external onlyOwner {
        require(loyaltyPoints[customer] >= points, "Not enough loyalty points");
        loyaltyPoints[customer] -= points;
        emit PointsRedeemed(customer, points);
    }

    function getPoints(address customer) public view returns (uint) {
        return loyaltyPoints[customer];
    }
}
