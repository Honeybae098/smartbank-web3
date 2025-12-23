// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SmartBank
 * @dev A secure decentralized banking contract for ETH deposits and withdrawals
 * @author SmartBank Team
 */
contract SmartBank {
    
    // Events
    event Deposit(address indexed user, uint256 amount, uint256 timestamp);
    event Withdrawal(address indexed user, uint256 amount, uint256 timestamp);
    event EmergencyWithdrawal(address indexed recipient, uint256 amount, uint256 timestamp);
    event MinDepositUpdated(uint256 newMinDeposit, uint256 timestamp);
    event MinWithdrawUpdated(uint256 newMinWithdraw, uint256 timestamp);
    
    // State variables
    address public owner;
    uint256 public totalDeposits;
    uint256 public totalWithdrawals;
    uint256 public totalUsers;
    uint256 public minDeposit = 0.001 ether;
    uint256 public minWithdraw = 0.001 ether;
    
    // User balances and transaction tracking
    mapping(address => uint256) public userBalances;
    mapping(address => uint256) public userTransactionCount;
    mapping(address => uint256) public lastTransactionTime;
    
    struct Transaction {
        bool isDeposit;
        uint256 amount;
        uint256 timestamp;
        uint256 blockNumber;
    }
    
    mapping(address => mapping(uint256 => Transaction)) public userTransactions;
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Deposit ETH into the bank
     */
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        require(msg.value >= minDeposit, "Amount below minimum deposit");
        
        // Update user's balance
        userBalances[msg.sender] += msg.value;
        
        // Update total deposits and user count
        totalDeposits += msg.value;
        if (userBalances[msg.sender] == msg.value) {
            totalUsers++;
        }
        
        // Record transaction
        uint256 txIndex = userTransactionCount[msg.sender];
        userTransactions[msg.sender][txIndex] = Transaction({
            isDeposit: true,
            amount: msg.value,
            timestamp: block.timestamp,
            blockNumber: block.number
        });
        userTransactionCount[msg.sender]++;
        
        // Emit deposit event
        emit Deposit(msg.sender, msg.value, block.timestamp);
        
        // Update last transaction time
        lastTransactionTime[msg.sender] = block.timestamp;
    }
    
    /**
     * @dev Withdraw ETH from the bank
     * @param amount Amount of ETH to withdraw
     */
    function withdraw(uint256 amount) external {
        require(amount > 0, "Withdraw amount must be greater than 0");
        require(amount >= minWithdraw, "Amount below minimum withdrawal");
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        
        // Update user's balance
        userBalances[msg.sender] -= amount;
        
        // Update total withdrawals
        totalWithdrawals += amount;
        
        // Record transaction
        uint256 txIndex = userTransactionCount[msg.sender];
        userTransactions[msg.sender][txIndex] = Transaction({
            isDeposit: false,
            amount: amount,
            timestamp: block.timestamp,
            blockNumber: block.number
        });
        userTransactionCount[msg.sender]++;
        
        // Transfer ETH to user
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "ETH transfer failed");
        
        // Emit withdraw event
        emit Withdrawal(msg.sender, amount, block.timestamp);
        
        // Update last transaction time
        lastTransactionTime[msg.sender] = block.timestamp;
    }
    
    /**
     * @dev Get user's current balance
     * @param user Address of the user
     * @return Current balance of the user
     */
    function getBalance(address user) external view returns (uint256) {
        return userBalances[user];
    }
    
    /**
     * @dev Get contract's total ETH balance
     * @return Total ETH balance held by the contract
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Get user's transaction history count
     * @param user Address of the user
     * @return Number of transactions for the user
     */
    function getTransactionCount(address user) external view returns (uint256) {
        return userTransactionCount[user];
    }
    
    /**
     * @dev Get transaction details by index
     * @param user Address of the user
     * @param index Index of the transaction
     * @return isDeposit True if deposit, false if withdrawal
     * @return amount Amount of ETH
     * @return timestamp When the transaction occurred
     * @return blockNumber Block number of the transaction
     */
    function getTransaction(address user, uint256 index) 
        external 
        view 
        returns (
            bool isDeposit,
            uint256 amount,
            uint256 timestamp,
            uint256 blockNumber
        ) 
    {
        require(index < userTransactionCount[user], "Transaction index out of bounds");
        Transaction memory txData = userTransactions[user][index];
        return (txData.isDeposit, txData.amount, txData.timestamp, txData.blockNumber);
    }
    
    /**
     * @dev Emergency function to withdraw all funds (only owner)
     * @param recipient Address to send the funds to
     */
    function emergencyWithdraw(address recipient) external onlyOwner {
        require(recipient != address(0), "Invalid recipient address");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = recipient.call{value: balance}("");
        require(success, "Emergency withdrawal failed");
        
        emit EmergencyWithdrawal(recipient, balance, block.timestamp);
    }
    
    /**
     * @dev Update minimum deposit amount (only owner)
     * @param newMinDeposit New minimum deposit amount in wei
     */
    function updateMinDeposit(uint256 newMinDeposit) external onlyOwner {
        minDeposit = newMinDeposit;
        emit MinDepositUpdated(newMinDeposit, block.timestamp);
    }
    
    /**
     * @dev Update minimum withdrawal amount (only owner)
     * @param newMinWithdraw New minimum withdrawal amount in wei
     */
    function updateMinWithdraw(uint256 newMinWithdraw) external onlyOwner {
        minWithdraw = newMinWithdraw;
        emit MinWithdrawUpdated(newMinWithdraw, block.timestamp);
    }
    
    /**
     * @dev Get contract statistics
     * @return totalDeposits Total ETH deposited
     * @return totalWithdrawals Total ETH withdrawn
     * @return totalUsers Total number of unique users
     * @return contractBalance Current ETH balance of contract
     */
    function getContractStats() 
        external 
        view 
        returns (
            uint256 totalDeposits,
            uint256 totalWithdrawals,
            uint256 totalUsers,
            uint256 contractBalance
        ) 
    {
        return (totalDeposits, totalWithdrawals, totalUsers, address(this).balance);
    }
    
    /**
     * @dev Check if user has made any transactions
     * @param user Address of the user
     * @return hasTransactions True if user has transactions
     */
    function hasTransactions(address user) external view returns (bool) {
        return userTransactionCount[user] > 0;
    }
    
    /**
     * @dev Get time of user's last transaction
     * @param user Address of the user
     * @return lastTransactionTime Timestamp of last transaction
     */
    function getLastTransactionTime(address user) external view returns (uint256) {
        return lastTransactionTime[user];
    }
    
    /**
     * @dev Receive function to accept direct ETH transfers
     */
    receive() external payable {
        // Automatically treat as deposit
        userBalances[msg.sender] += msg.value;
        totalDeposits += msg.value;
        if (userBalances[msg.sender] == msg.value) {
            totalUsers++;
        }
        
        // Record transaction
        uint256 txIndex = userTransactionCount[msg.sender];
        userTransactions[msg.sender][txIndex] = Transaction({
            isDeposit: true,
            amount: msg.value,
            timestamp: block.timestamp,
            blockNumber: block.number
        });
        userTransactionCount[msg.sender]++;
        
        emit Deposit(msg.sender, msg.value, block.timestamp);
        lastTransactionTime[msg.sender] = block.timestamp;
    }
    
    /**
     * @dev Fallback function
     */
    fallback() external payable {
        revert("Function not found");
    }
}
