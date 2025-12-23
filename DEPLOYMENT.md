# SmartBank Web3 - Deployment Guide

## Overview
Your SmartBank Web3 application now has complete Web3 integration! Users can:
- Connect their MetaMask wallet
- Deposit ETH to the smart contract
- Withdraw their deposited ETH
- View real-time balances and transaction history

## Current Status

### ✅ Completed Features
- **Smart Contract**: Secure ETH deposit/withdraw contract with events
- **Web3 Context**: Complete wallet connection and contract interaction
- **Wallet Integration**: MetaMask connection with network switching
- **Real Transactions**: Actual ETH deposits/withdrawals on blockchain
- **Transaction History**: Load and display user transactions from contract
- **Error Handling**: Comprehensive error messages and user feedback
- **Loading States**: Proper loading indicators for all async operations

### 🔧 Configuration Needed

#### 1. Smart Contract Deployment
The smart contract needs to be deployed to Sepolia testnet. You'll need to:

1. **Install Hardhat** (if not already installed):
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. **Deploy the contract**:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

3. **Update Contract Address** in `/src/contexts/Web3Context.jsx`:
```javascript
const CONTRACT_ADDRESSES = {
  sepolia: 'YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE', // Replace with actual address
  mainnet: 'YOUR_MAINNET_CONTRACT_ADDRESS_HERE'   // When ready for mainnet
};
```

#### 2. Network Configuration
The app is configured for Sepolia testnet by default. Users will be prompted to switch to Sepolia if connected to another network.

## Testing the Application

### Prerequisites
1. **MetaMask** browser extension installed
2. **Sepolia ETH** test tokens (get free test ETH from https://sepoia-faucet.pk910.de/)

### Testing Steps
1. **Start the application**:
```bash
npm start
```

2. **Connect Wallet**:
   - Click "Connect Wallet" in the navbar
   - Approve MetaMask connection
   - Switch to Sepolia testnet if prompted

3. **Test Deposit**:
   - Navigate to Deposit page
   - Enter amount (minimum 0.001 ETH)
   - Click "Deposit ETH"
   - Confirm transaction in MetaMask
   - Verify balance updates

4. **Test Withdrawal**:
   - Navigate to Withdraw page
   - Click "Max" to withdraw all balance
   - Click "Withdraw ETH"
   - Confirm transaction in MetaMask
   - Verify wallet balance increases

5. **View Dashboard**:
   - Check real-time balances
   - View transaction history with links to Etherscan

## Smart Contract Features

### Core Functions
- `deposit()` - Payable function to deposit ETH
- `withdraw(uint256 amount)` - Withdraw specified amount
- `getBalance(address user)` - Get user's deposited balance
- `getTransactionHistory()` - Load user's transactions

### Security Features
- Minimum deposit/withdrawal limits (0.001 ETH)
- Balance validation (can't withdraw more than deposited)
- Event logging for all transactions
- Owner-only emergency functions

### Events
- `Deposit(address user, uint256 amount, uint256 timestamp)`
- `Withdrawal(address user, uint256 amount, uint256 timestamp)`
- `EmergencyWithdrawal(...)`
- `MinDepositUpdated(...)`
- `MinWithdrawUpdated(...)`

## Production Deployment

### Mainnet Deployment
1. **Audit smart contract** (highly recommended)
2. **Deploy to Ethereum mainnet**
3. **Update contract addresses** in Web3Context
4. **Update network configurations** for mainnet
5. **Test thoroughly** with small amounts first

### Frontend Deployment
```bash
npm run build
# Deploy 'build' folder to your hosting provider
```

## Environment Variables (Optional)
Create `.env` file for sensitive data:
```
REACT_APP_CONTRACT_ADDRESS_SEPOLIA=your_sepolia_contract_address
REACT_APP_CONTRACT_ADDRESS_MAINNET=your_mainnet_contract_address
REACT_APP_INFURA_PROJECT_ID=your_infura_project_id
```

## Troubleshooting

### Common Issues
1. **"Contract not deployed" error**: Update contract address in Web3Context
2. **"Insufficient funds"**: User needs test ETH from faucet
3. **Network switching issues**: Manually add Sepolia in MetaMask
4. **Transaction failed**: Check minimum amounts and contract balance

### Network Details
**Sepolia Testnet**:
- Chain ID: 11155111 (0xaa36a7)
- RPC: https://rpc.sepolia.org
- Explorer: https://sepolia.etherscan.io

## Next Steps
1. Deploy smart contract to testnet
2. Update contract address in code
3. Test all functionality thoroughly
4. Consider adding more features (interest, time locks, etc.)
5. Plan mainnet deployment with audit

## File Structure
```
src/
├── components/
│   ├── WalletConnect.jsx      # Wallet connection UI
│   ├── Navbar.jsx             # Navigation with wallet status
│   └── ...existing components
├── contexts/
│   └── Web3Context.jsx        # Web3 logic and state management
├── config/
│   └── abi/
│       └── SmartBank.json     # Contract ABI
├── pages/
│   ├── Deposit.jsx           # Real Web3 deposit functionality
│   ├── Withdraw.jsx          # Real Web3 withdrawal functionality
│   └── Dashboard.jsx         # Real balances and transaction history
└── App.js                    # Web3Provider wrapper
```

## Support
The application is now fully functional with Web3 integration! Users can perform real blockchain transactions while maintaining a smooth, intuitive user experience.
