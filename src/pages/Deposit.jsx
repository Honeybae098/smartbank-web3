import React, { useState } from 'react';
import { ArrowDownCircle, AlertCircle, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import InfoCard from '../components/InfoCard';
import { useWeb3 } from '../contexts/Web3Context';

const DepositPage = ({ onNavigate }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');
  
  const { 
    isConnected, 
    connectWallet, 
    deposit, 
    balance,
    smartBankBalance 
  } = useWeb3();

  const handleDeposit = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > parseFloat(balance)) {
      setError('Insufficient balance');
      return;
    }

    setIsLoading(true);
    setError('');
    setTxHash('');
    
    try {
      const transactionHash = await deposit(amount);
      setTxHash(transactionHash);
      alert(`Deposit of ${amount} ETH initiated! Transaction: ${transactionHash}`);
      setAmount('');
    } catch (error) {
      console.error('Deposit failed:', error);
      setError(error.message || 'Deposit failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900">
      <Navbar currentPage="deposit" onNavigate={onNavigate} brandColor="green-400" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-10 rounded-2xl border border-white border-opacity-20 shadow-2xl">
          <div className="flex items-center justify-center mb-8">
            <ArrowDownCircle className="w-16 h-16 text-green-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-white text-center mb-3">Deposit ETH</h1>
          <p className="text-gray-300 text-center mb-8">
            Securely deposit your ETH into the SmartBank vault
          </p>

          {/* Wallet Connection Status */}
          {!isConnected && (
            <div className="bg-red-900 bg-opacity-30 border border-red-400 border-opacity-30 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-200 text-sm">
                  Please connect your MetaMask wallet to continue
                </p>
              </div>
              <button
                onClick={handleConnectWallet}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-900 bg-opacity-30 border border-red-400 border-opacity-30 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Transaction Hash Display */}
          {txHash && (
            <div className="bg-green-900 bg-opacity-30 border border-green-400 border-opacity-30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ExternalLink className="w-5 h-5 text-green-400" />
                  <p className="text-green-200 text-sm">Transaction submitted!</p>
                </div>
                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 hover:text-green-100 underline text-sm"
                >
                  View on Etherscan
                </a>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(''); // Clear error when user types
                }}
                placeholder="0.0"
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg px-4 py-3 text-white text-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                disabled={!isConnected || isLoading}
              />
              {isConnected && (
                <p className="text-gray-400 text-sm mt-2">
                  Available: {parseFloat(balance).toFixed(4)} ETH
                </p>
              )}
            </div>

            <div className="bg-blue-900 bg-opacity-30 border border-blue-400 border-opacity-30 rounded-lg p-4">
              <p className="text-sm text-blue-200">
                <strong>Note:</strong> Make sure you have sufficient ETH in your MetaMask wallet and are connected to the Sepolia testnet.
              </p>
            </div>

            <button
              onClick={handleDeposit}
              disabled={!isConnected || isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-600 text-white py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Processing...' : 'Deposit ETH'}
            </button>

            <div className="text-center text-sm text-gray-400">
              Transaction will require MetaMask confirmation
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <InfoCard 
            title="Safe & Secure" 
            description="Your funds are protected by audited smart contract code" 
          />
          <InfoCard 
            title="Instant Updates" 
            description="Your balance updates in real-time after confirmation" 
          />
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
