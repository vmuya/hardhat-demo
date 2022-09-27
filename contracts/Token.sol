//SPDX-License-Identifier: UNLICENSED

//solidity version
pragma solidity ^0.8.9;

contract Token {
    //type variable to identify the token
    string public name = "Sample Hardhat Token";
    string public symbol = "SHT";

    //fixed supply of the tokens, stored in an unsigned integer 
    uint256 public totalSupply = 1000000;

    //variable of type address to store ethereum accounts
    address public owner;

    //mapping to store the balance of each account, as a key/value map
    mapping(address => uint256) balances;

    //event to be emitted when a transfer is made
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    /**
     *contract initialization
     */
    constructor() {
        //assign totalSupply to the account deploying the contract
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    /**
     *function to transfer tokens
     *
     * the `external` modifier makes the function callable ONLY from outside the contract
     */
     function transfer(address to, uint256 amount) external {
        //check if the sender has enough tokens. If false, transaction reverts
        require(balances[msg.sender] >= amount, "Not enough tokens");

        //transfer the amount
        balances[to] += amount;
        balances[msg.sender] -= amount;

        //notify off-chain apps of the transfer
        emit Transfer(msg.sender, to, amount);
     }

        /**
        *read only function to check the balance of an account
        *
        * the `view` modifier indicates that it doesn't modify the state of the contract: can be called without triggering a transaction
        */

        function balanceOf(address account) external view returns (uint256) {
            return balances[account];
        }
        
}