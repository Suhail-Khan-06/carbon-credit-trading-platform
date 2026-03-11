// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CarbonCreditToken {

    string public name = "Carbon Credit Token";
    string public symbol = "CCT";
    uint256 public totalSupply;

    address public admin;

    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Mint(address indexed to, uint256 amount);
    event Approval(address indexed owner, address indexed spender, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can do this");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function mintCredits(address company, uint256 amount) external onlyAdmin {
        require(company != address(0), "Invalid address");
        balances[company] += amount;
        totalSupply += amount;
        emit Mint(company, amount);
    }

    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough credits");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }

    function approve(address spender, uint256 amount) external {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
    }

    function transferFrom(address from, address to, uint256 amount) external {
        require(balances[from] >= amount, "Not enough credits");
        require(allowances[from][msg.sender] >= amount, "Not approved");
        balances[from] -= amount;
        balances[to] += amount;
        allowances[from][msg.sender] -= amount;
        emit Transfer(from, to, amount);
    }
}
