// src/App.jsx
import React, { useState } from 'react';
import { Web3Provider } from './contexts/Web3Context';
import HomePage from './pages/Home';
import DepositPage from './pages/Deposit';
import WithdrawPage from './pages/Withdraw';
import DashboardPage from './pages/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'deposit':
        return <DepositPage onNavigate={setCurrentPage} />;
      case 'withdraw':
        return <WithdrawPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Web3Provider>
      <div>{renderPage()}</div>
    </Web3Provider>
  );
}

export default App;
