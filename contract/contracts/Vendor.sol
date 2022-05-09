// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./LomadsToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vendor is Ownable {

    // Our Token Contract
    LomadsToken lomadsToken;

    // token price for MATIC
    uint256 public tokensPerMATIC;
    uint256 public withdrawLimit = 0;
    uint256 public maxWithdrawPercent = 80; // 80%

    // Event that log buy operation
    event BuyTokens(address buyer, uint256 amountOfMATIC, uint256 amountOfTokens);
    event SellTokens(address seller, uint256 amountOfTokens, uint256 amountOfMATIC);

    constructor(address tokenAddress, uint256 _tokensPerMatic) {
        lomadsToken = LomadsToken(tokenAddress);
        tokensPerMATIC = _tokensPerMatic;
    }

    /**
    * @notice Allow users to buy token for MATIC
    */
    function buyTokens() public payable returns (uint256 tokenAmount) {
        require(msg.value > 0, "Send MATIC to buy some tokens");

        uint256 noOfTokensToBuy = msg.value * tokensPerMATIC;

        // check if the Vendor Contract has enough amount of tokens for the transaction
        uint256 vendorBalance = lomadsToken.balanceOf(address(this));
        require(vendorBalance >= noOfTokensToBuy, "Vendor contract has not enough tokens in its balance");

        // Transfer token to the msg.sender
        (bool sent) = lomadsToken.transfer(msg.sender, noOfTokensToBuy);
        require(sent, "Failed to transfer token to user");

        withdrawLimit += (msg.value * maxWithdrawPercent/100);

        // emit the event
        emit BuyTokens(msg.sender, msg.value, noOfTokensToBuy);

        return noOfTokensToBuy;
    }

    /**
    * @notice Allow users to sell tokens for MATIC
    */
    function sellTokens(uint256 noOfTokensToSell) public {
        // Check that the requested amount of tokens to sell is more than 0
        require(noOfTokensToSell > 0, "Specify an amount of token greater than zero");

        // Check that the user's token balance is enough to do the swap
        uint256 userBalance = lomadsToken.balanceOf(msg.sender);
        require(userBalance >= noOfTokensToSell, "Your balance is lower than the amount of tokens you want to sell");

        // Check that the Vendor's balance is enough to do the swap
        uint256 totalMATICToTransfer = noOfTokensToSell / tokensPerMATIC;
        uint256 ownerMATICBalance = address(this).balance;
        require(ownerMATICBalance >= totalMATICToTransfer, "Vendor has not enough funds to accept the sell request");

        // lomadsToken.approve(msg.sender, noOfTokensToSell); // check if we need this here
        (bool sent) = lomadsToken.transferFrom(msg.sender, address(this), noOfTokensToSell);
        require(sent, "Failed to transfer tokens from user to vendor");

        (sent,) = msg.sender.call{value: totalMATICToTransfer}("");
        require(sent, "Failed to send MATIC to the user");
        withdrawLimit -= (totalMATICToTransfer * maxWithdrawPercent/100);

        // emit the event
        emit SellTokens(msg.sender, noOfTokensToSell, totalMATICToTransfer);
    }

    /**
    * @notice Allow the owner of the contract to withdraw max allowed MATIC
    */
    function withdrawMax() public onlyOwner {
        uint256 ownerBalance = address(this).balance;
        require(ownerBalance > 0, "Owner has not balance to withdraw");
        require(withdrawLimit > 0, "Withdraw limit is 0");
        require(withdrawLimit <= ownerBalance, "Owner funds are less than withdrawl limit.");

        (bool sent,) = msg.sender.call{value: withdrawLimit}("");
        require(sent, "Failed to send user balance back to the owner");
        withdrawLimit = 0;
    }

    /**
    * @notice Allow the owner of the contract to withdraw MATIC
    */
    function withdraw(uint256 withdrawAmount) public onlyOwner {
        require(withdrawAmount > 0, "Withdraw amount should be positive");
        require(withdrawLimit > 0, "Withdraw limit is 0");
        require(withdrawLimit >= withdrawAmount, "Withdraw amount is greater than allowed limit");
        uint256 ownerBalance = address(this).balance;
        require(ownerBalance > 0, "Owner has not balance to withdraw");
        require(withdrawAmount <= ownerBalance, "Owner funds are less than withdraw amount");

        (bool sent,) = msg.sender.call{value: withdrawAmount}("");
        require(sent, "Failed to send user balance back to the owner");
        withdrawLimit -= withdrawAmount;
    }

    /**
    * @notice update DAO tokens exchange rate per MATIC token
    */
    function updateTokensPerMATIC(uint256 newRate) onlyOwner public {
        tokensPerMATIC = newRate;
    }

    /**
    * @notice update token withdraw percentage limit for Owner
    */
    function updateWithdrawPercentLimit(uint256 newLimit) onlyOwner public {
        require(newLimit > 0, "Withdraw limit can't be less than 0%");
        require(newLimit <= 100, "Withdraw limit can't be greater than 100%");
        maxWithdrawPercent = newLimit;
    }
}