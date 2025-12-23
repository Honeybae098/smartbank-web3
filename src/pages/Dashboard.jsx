import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, ExternalLink, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { useWeb3 } from '../contexts/Web3Context';

const DashboardPage = ({ onNavigate }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { 
    isConnected,
    connectWallet,
    getTransactionHistory,
    getContractStats,
    balance,
    smartBankBalance
  } = useWeb3();

  useEffect(() => {
    if (isConnected) {
      loadDashboardData();
    }
  }, [isConnected]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Load transaction history
      const txHistory = await getTransactionHistory();
      setTransactions(txHistory);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
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

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <Navbar currentPage="dashboard" onNavigate={onNavigate} brandColor="purple-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>

        {/* Wallet Connection Status */}
        {!isConnected && (
          <div className="bg-red-900 bg-opacity-30 border border-red-400 border-opacity-30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-200 text-sm">
                  Please connect your MetaMask wallet to view your dashboard
                </p>
              </div>
              <button
                onClick={handleConnectWallet}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            label="Wallet Balance" 
            value={`${parseFloat(balance).toFixed(4)} ETH`} 
            subtext="≈ $0.00 USD" 
            icon={Wallet} 
            iconColor="blue-400" 
          />
          <StatCard 
            label="SmartBank Balance" 
            value={`${parseFloat(smartBankBalance).toFixed(4)} ETH`} 
            subtext={`${transactions.filter(tx => tx.type === 'Deposit').length} deposits`} 
            icon={ArrowDownCircle} 
            iconColor="green-400" 
          />
          <StatCard 
            label="Total Withdrawn" 
            value={`${transactions.filter(tx => tx.type === 'Withdraw').reduce((sum, tx) => sum + parseFloat(tx.amount), 0).toFixed(4)} ETH`} 
            subtext={`${transactions.filter(tx => tx.type === 'Withdraw').length} withdrawals`} 
            icon={ArrowUpCircle} 
            iconColor="orange-400" 
          />
        </div>

        {/* Transaction History */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 overflow-hidden">
          <div className="p-6 border-b border-white border-opacity-10">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Transaction History</h2>
                <p className="text-gray-400 text-sm mt-1">View all your deposits and withdrawals</p>
              </div>
              {isConnected && (
                <button
                  onClick={loadDashboardData}
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {isLoading ? 'Loading...' : 'Refresh'}
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {!isConnected ? (
              <div className="bg-blue-900 bg-opacity-20 border border-blue-400 border-opacity-30 rounded-lg p-4">
                <p className="text-sm text-blue-200 text-center">
                  Connect your wallet to view transaction history
                </p>
              </div>
            ) : error ? (
              <div className="bg-red-900 bg-opacity-20 border border-red-400 border-opacity-30 rounded-lg p-4">
                <p className="text-sm text-red-200 text-center">
                  {error}
                </p>
              </div>
            ) : isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                <p className="text-gray-400 text-sm mt-2">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="bg-gray-900 bg-opacity-20 border border-gray-400 border-opacity-30 rounded-lg p-4">
                <p className="text-sm text-gray-200 text-center">
                  No transactions found. Make your first deposit to get started!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white border-opacity-10">
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Transaction Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5 transition">
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            tx.type === 'Deposit' 
                              ? 'bg-green-500 bg-opacity-20 text-green-300' 
                              : 'bg-orange-500 bg-opacity-20 text-orange-300'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-white font-semibold">{parseFloat(tx.amount).toFixed(4)} ETH</td>
                        <td className="py-4 px-4 text-gray-400">{formatTimestamp(tx.timestamp)}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-400 font-mono text-sm">{tx.hash}</span>
                            <a 
                              href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 transition"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button 
            onClick={() => onNavigate('deposit')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Make a Deposit
          </button>
          <button 
            onClick={() => onNavigate('withdraw')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Withdraw Funds
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
