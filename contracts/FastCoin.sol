//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract FastCoin is ERC20 {
    address public admin;
    address public cafeteria = 0xF0d1611c0C7FbB61F72f5fBEc835A71E59C5edbF;
    mapping (address => mapping (address => uint256)) private _allowances;


    constructor() ERC20("FastCoin", "FST") {
        admin = msg.sender;
        cafeteria = 0xF0d1611c0C7FbB61F72f5fBEc835A71E59C5edbF;
        _mint(admin, 1000000 * 10 ** decimals()); // Mint initial supply
    }

    //modifier onlyAdmin() {
    //      require(msg.sender == admin, "Only admin can perform this action");
    //      _;
    //  }

    function setCafeteria(address _cafeteria)  public {
        cafeteria = _cafeteria;
    }

    function mint(address to, uint amount) public {
        _mint(to, amount);
    }

    function burn(uint amount) external {
        _burn(msg.sender, amount);
    }

    function payForOrder(uint amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _transfer(msg.sender, cafeteria, amount);
        // Additional logic for order processing can be implemented here
    }

    function refundOrder(address customer, uint amount) external {
        require(msg.sender == cafeteria, "Only cafeteria can perform this action");
        _transfer(cafeteria, customer, amount);
        // Additional checks and logic for refunds can be added
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);

        return true;
    }


}
    
    