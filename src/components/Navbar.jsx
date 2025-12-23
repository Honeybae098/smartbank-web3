
// src/components/Navbar.jsx
import React from 'react';
import { Shield } from 'lucide-react';
import WalletConnect from './WalletConnect';

const Navbar = ({ currentPage, onNavigate, brandColor = "blue-600" }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Shield className={`w-8 h-8 text-${brandColor}`} />
            <span className="text-2xl font-bold text-gray-900">SmartBank</span>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="flex space-x-4">
              <button 
                onClick={() => onNavigate('home')} 
                className={`${currentPage === 'home' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'} transition px-3 py-2 rounded-md text-sm font-medium`}
              >
                Home
              </button>
              <button 
                onClick={() => onNavigate('deposit')} 
                className={`${currentPage === 'deposit' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'} transition px-3 py-2 rounded-md text-sm font-medium`}
              >
                Deposit
              </button>
              <button 
                onClick={() => onNavigate('withdraw')} 
                className={`${currentPage === 'withdraw' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'} transition px-3 py-2 rounded-md text-sm font-medium`}
              >
                Withdraw
              </button>
              <button 
                onClick={() => onNavigate('dashboard')} 
                className={`${currentPage === 'dashboard' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'} transition px-3 py-2 rounded-md text-sm font-medium`}
              >
                Dashboard
              </button>
            </div>

            {/* Wallet Connection */}
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
