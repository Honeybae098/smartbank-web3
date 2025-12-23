import React from 'react';
import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';

const WalletConnect = ({ className = '' }) => {
  const { 
    isConnected, 
    isConnecting, 
    account, 
    balance, 
    connectWallet, 
    disconnectWallet,
    switchToSepolia 
  } = useWeb3();

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = async () => {
    if (isConnecting) return;
    
    try {
      await connectWallet();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchToSepolia();
    } catch (error) {
      console.error('Network switch failed:', error);
    }
  };

  if (isConnected) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        {/* Network Status */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Sepolia</span>
          <button
            onClick={handleSwitchNetwork}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Switch
          </button>
        </div>

        {/* Balance */}
        <div className="bg-gray-100 px-3 py-2 rounded-lg">
          <span className="text-sm font-medium text-gray-900">
            {parseFloat(balance).toFixed(4)} ETH
          </span>
        </div>

        {/* Account */}
        <div className="flex items-center space-x-2">
          <Wallet className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-900 font-medium">
            {formatAddress(account)}
          </span>
        </div>

        {/* Disconnect Button */}
        <button
          onClick={handleDisconnect}
          className="flex items-center space-x-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Not Connected Status */}
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-sm text-gray-600">Not Connected</span>
      </div>

      {/* Connect Button */}
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors font-medium"
      >
        {isConnecting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Wallet className="w-4 h-4" />
        )}
        <span>
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </span>
      </button>
    </div>
  );
};

export default WalletConnect;
