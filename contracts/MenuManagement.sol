// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
contract MenuManagement {
    struct MenuItem {
        uint id;
        string name;
        uint price;
        bool isAvailable;
    }

    mapping(uint => MenuItem) public menuItems;
    uint public nextItemId;
    address public manager;
    
    event MenuItemAdded(uint itemId, string name, uint price);
    event MenuItemRemoved(uint itemId);
    event MenuItemUpdated(uint itemId, string name, uint price, bool isAvailable);
    event MenuItemGet(uint id,string name,uint price,bool isAvailable);

    constructor() {
        manager = msg.sender;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call this");
        _;
    }

    function addMenuItem(string memory _name, uint _price) public onlyManager {
        menuItems[nextItemId] = MenuItem(nextItemId, _name, _price, true);
        nextItemId++;
        emit MenuItemAdded(nextItemId, _name, _price);

    }

    function updateMenuItem(uint _itemId, string memory _name, uint _price, bool _isAvailable) public onlyManager {
        require(_itemId < nextItemId, "Item does not exist");
        menuItems[_itemId] = MenuItem(_itemId, _name, _price, _isAvailable);
        emit MenuItemUpdated(_itemId, _name, _price, _isAvailable);

    }

    function removeMenuItem(uint _itemId) public onlyManager {
        require(_itemId < nextItemId, "Item does not exist");
        delete menuItems[_itemId];
        emit MenuItemRemoved(_itemId);

    }

    function getMenuItem(uint _itemId) public  returns (  uint ,string memory ,uint,bool) {
        require(_itemId < nextItemId, "Item does not exist");
        MenuItem memory item = menuItems[_itemId];
        emit MenuItemGet(item.id, item.name, item.price, item.isAvailable);
        return (item.id, item.name, item.price,true);
        
    }
}
