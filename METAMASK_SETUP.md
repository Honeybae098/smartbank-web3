# MetaMask Setup Guide for SmartBank

## What You Need to Do with MetaMask

Here's your step-by-step guide to set up MetaMask and test your SmartBank Web3 application:

### 🔧 **Step 1: Install MetaMask**

1. **Download MetaMask:**
   - Go to https://metamask.io/
   - Click "Download" for your browser
   - Install the browser extension

2. **Create Wallet:**
   - Open MetaMask extension
   - Click "Create a Wallet"
   - Create a strong password
   - **Important**: Write down your Secret Recovery Phrase (12 words)
   - This is the only way to recover your wallet!

### 🧪 **Step 2: Get Test ETH (Sepolia)**

1. **Switch to Sepolia Testnet:**
   - Click network dropdown in MetaMask
   - Select "Sepolia Test Network"
   - If not visible, click "Add Network" → "Add Network Manually"
   - Use these details:
     - Network name: Sepolia Test Network
     - RPC URL: https://rpc.sepolia.org
     - Chain ID: 11155111
     - Currency symbol: ETH
     - Block explorer: https://sepolia.etherscan.io

2. **Get Free Test ETH:**
   - Visit: https://sepoia-faucet.pk910.de/ (or any Sepolia faucet)
   - Enter your MetaMask address
   - Wait for confirmation
   - Your balance should show 0.1-1 ETH in Sepolia

### 🔗 **Step 3: Connect to SmartBank**

1. **Open SmartBank App:**
   - Make sure `npm start` is running
   - Go to http://localhost:3000

2. **Connect Wallet:**
   - Look for "Connect Wallet" button in navbar
   - Click it
   - MetaMask will pop up asking for permission
   - Click "Connect"
   - Your wallet address should appear in navbar

3. **Verify Connection:**
   - Should see green "Sepolia" indicator
   - Your wallet balance displayed
   - Account address shown (truncated)

### 💰 **Step 4: Test SmartBank Features**

#### **Test Deposit:**
1. Go to "Deposit" page
2. Enter amount (minimum 0.001 ETH)
3. Click "Deposit ETH"
4. MetaMask will show transaction details
5. Click "Confirm"
6. Wait for confirmation
7. Check dashboard for updated balance

#### **Test Withdrawal:**
1. Go to "Withdraw" page
2. Click "Max" to withdraw all balance
3. Click "Withdraw ETH"
4. Confirm in MetaMask
5. Wait for confirmation
6. Check wallet balance increased

#### **View Dashboard:**
1. Go to "Dashboard"
2. See real-time balances
3. View transaction history
4. Click transaction hashes to see on Etherscan

### 🔍 **Step 5: Verify on Blockchain**

1. **Etherscan Verification:**
   - Click any transaction hash in dashboard
   - Opens Sepolia Etherscan
   - Verify transaction details
   - See gas fees, status, etc.

2. **Contract Interaction:**
   - Transactions show SmartBank contract address
   - Verify deposit/withdrawal events
   - Check event logs

### 🛡️ **Security Best Practices**

#### **Do's:**
✅ **Always test with small amounts first**
✅ **Keep your Secret Recovery Phrase safe**
✅ **Use strong passwords**
✅ **Test on testnet before mainnet**
✅ **Verify contract addresses**

#### **Don'ts:**
❌ **Never share your Secret Recovery Phrase**
❌ **Don't send real ETH to test contracts**
❌ **Don't approve suspicious transactions**
❌ **Don't ignore gas fees**
❌ **Don't skip security reviews**

### 🎯 **Quick Testing Checklist**

- [ ] MetaMask installed and wallet created
- [ ] Connected to Sepolia testnet
- [ ] Got test ETH from faucet
- [ ] Connected wallet to SmartBank app
- [ ] Made a test deposit (small amount)
- [ ] Made a test withdrawal
- [ ] Viewed transaction history
- [ ] Verified transactions on Etherscan

### 💡 **Pro Tips**

1. **Network Switching:**
   - App will prompt you to switch to Sepolia
   - Accept the network change
   - Your transactions will be on testnet only

2. **Gas Fees:**
   - Sepolia testnet has small gas fees
   - Some transactions might cost 0.001-0.01 ETH
   - Monitor your test ETH balance

3. **Account Management:**
   - Create multiple accounts in MetaMask
   - Test with different addresses
   - Each account has separate balance

4. **Debugging:**
   - Check browser console for errors
   - Verify network in MetaMask
   - Check account balance before transactions

### 🚨 **Important Notes**

**For Development:**
- Use test ETH only (Sepolia)
- SmartBank contract not deployed to mainnet yet
- Contract address needs to be updated after deployment

**For Production:**
- Wait for contract audit
- Deploy to Ethereum mainnet
- Update contract addresses in code
- Use real ETH with caution

### 📞 **Need Help?**

**Common Issues:**
1. **"Connection failed"**: Check if MetaMask is unlocked
2. **"Wrong network"**: Switch to Sepolia in MetaMask
3. **"Insufficient funds"**: Get more test ETH from faucet
4. **"Transaction failed"**: Check gas fees and balance

**Resources:**
- MetaMask Help: https://metamask.io/support/
- Sepolia Faucet: https://sepoia-faucet.pk910.de/
- Etherscan: https://sepolia.etherscan.io/

Your SmartBank Web3 app is ready to test with MetaMask! 🚀
