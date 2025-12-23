import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

// Network configurations
const NETWORKS = {
  sepolia: {
    chainId: '0xaa36a7',
    chainName: 'Sepolia Test Network',
    nativeCurrency: {
      name: 'Sepolia ETH',
      symbol: 'SEP',
      decimals: 18
    },
    rpcUrls: ['https://rpc.sepolia.org'],
    blockExplorerUrls: ['https://sepolia.etherscan.io']
  }
};

// Smart contract addresses (update after deployment)
const CONTRACT_ADDRESSES = {
  sepolia: '0x0000000000000000000000000000000000000000', // Update after deployment
};

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState('0.0');
  const [smartBankBalance, setSmartBankBalance] = useState('0.0');

  // Initialize provider
  useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);
      
      // Check if already connected
      checkExistingConnection(web3Provider);
    }
  }, []);

  const checkExistingConnection = async (web3Provider) => {
    try {
      const accounts = await web3Provider.listAccounts();
      if (accounts.length > 0) {
        const web3Signer = await web3Provider.getSigner();
        const web3Account = await web3Signer.getAddress();
        const web3Network = await web3Provider.getNetwork();

        setSigner(web3Signer);
        setAccount(web3Account);
        setNetwork(web3Network);
        setIsConnected(true);

        // Load contract and balances
        loadContract(web3Provider, web3Signer, web3Network);
        loadBalances(web3Provider, web3Account);
      }
    } catch (error) {
      console.error('Error checking existing connection:', error);
    }
  };

  const loadContract = (web3Provider, web3Signer, web3Network) => {
    try {
      const contractAddress = CONTRACT_ADDRESSES[web3Network.name] || CONTRACT_ADDRESSES.sepolia;
      if (contractAddress === '0x0000000000000000000000000000000000000000') {
        console.warn('Contract not deployed on this network');
        return;
      }

      const abi = require('../config/abi/SmartBank.json');
      const web3Contract = new ethers.Contract(contractAddress, abi, web3Signer);
      setContract(web3Contract);
    } catch (error) {
      console.error('Error loading contract:', error);
    }
  };

  const loadBalances = async (web3Provider, web3Account) => {
    try {
      // Load wallet balance
      const walletBalance = await web3Provider.getBalance(web3Account);
      setBalance(ethers.formatEther(walletBalance));

      // Load SmartBank balance if contract is available
      if (contract) {
        const bankBalance = await contract.getBalance(web3Account);
        setSmartBankBalance(ethers.formatEther(bankBalance));
      }
    } catch (error) {
      console.error('Error loading balances:', error);
    }
  };

  const connectWallet = async () => {
    if (!provider) {
      alert('Please install MetaMask to use this application');
      window.open('https://metamask.io/', '_blank');
      return;
    }

    try {
      setIsConnecting(true);

      // Request account access
      await provider.send('eth_requestAccounts', []);

      // Get signer and account
      const web3Signer = await provider.getSigner();
      const web3Account = await web3Signer.getAddress();
      const web3Network = await provider.getNetwork();

      setSigner(web3Signer);
      setAccount(web3Account);
      setNetwork(web3Network);
      setIsConnected(true);

      // Load contract and balances
      loadContract(provider, web3Signer, web3Network);
      await loadBalances(provider, web3Account);

    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setNetwork(null);
    setContract(null);
    setIsConnected(false);
    setBalance('0.0');
    setSmartBankBalance('0.0');
  };

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORKS.sepolia.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORKS.sepolia],
          });
        } catch (addError) {
          console.error('Error adding Sepolia network:', addError);
          alert('Please manually add Sepolia network to MetaMask');
        }
      } else {
        console.error('Error switching to Sepolia:', switchError);
      }
    }
  };

  const deposit = async (amount) => {
    if (!contract || !signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const amountInWei = ethers.parseEther(amount.toString());
      const tx = await contract.deposit({ value: amountInWei });
      
      // Wait for transaction confirmation
      await tx.wait();
      
      // Reload balances after deposit
      await loadBalances(provider, account);
      
      return tx.hash;
    } catch (error) {
      console.error('Error depositing:', error);
      throw error;
    }
  };

  const withdraw = async (amount) => {
    if (!contract || !signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const amountInWei = ethers.parseEther(amount.toString());
      const tx = await contract.withdraw(amountInWei);
      
      // Wait for transaction confirmation
      await tx.wait();
      
      // Reload balances after withdrawal
      await loadBalances(provider, account);
      
      return tx.hash;
    } catch (error) {
      console.error('Error withdrawing:', error);
      throw error;
    }
  };

  const getTransactionHistory = async () => {
    if (!contract || !account) return [];

    try {
      const txCount = await contract.getTransactionCount(account);
      const transactions = [];

      for (let i = 0; i < txCount; i++) {
        const tx = await contract.getTransaction(account, i);
        transactions.push({
          id: i,
          type: tx.isDeposit ? 'Deposit' : 'Withdraw',
          amount: ethers.formatEther(tx.amount),
          timestamp: new Date(Number(tx.timestamp) * 1000).toISOString().split('T')[0],
          hash: tx.blockNumber ? `${tx.blockNumber.toString().slice(0, 6)}...${tx.blockNumber.toString().slice(-4)}` : '0x0000...0000'
        });
      }

      return transactions.reverse();
    } catch (error) {
      console.error('Error loading transaction history:', error);
      return [];
    }
  };

  const getContractStats = async () => {
    if (!contract) return null;

    try {
      const stats = await contract.getContractStats();
      return {
        totalDeposits: ethers.formatEther(stats[0]),
        totalWithdrawals: ethers.formatEther(stats[1]),
        totalUsers: stats[2].toString(),
        contractBalance: ethers.formatEther(stats[3])
      };
    } catch (error) {
      console.error('Error loading contract stats:', error);
      return null;
    }
  };

  // Listen for account and network changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        // Reconnect with new account
        checkExistingConnection(provider);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [provider]);

  const value = {
    // State
    provider,
    signer,
    account,
    network,
    contract,
    isConnecting,
    isConnected,
    balance,
    smartBankBalance,
    
    // Actions
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    deposit,
    withdraw,
    getTransactionHistory,
    getContractStats,
    loadBalances
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Context;
