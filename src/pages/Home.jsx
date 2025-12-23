// src/pages/Home.jsx
import React from 'react';
import { Shield, Lock, Globe, TrendingUp } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';

const HomePage = ({ onNavigate }) => {
  const features = [
    {
      icon: Lock,
      iconColor: "text-blue-600",
      title: "Secure Storage",
      description: "Your ETH is protected by smart contract security. Only you can access and withdraw your funds."
    },
    {
      icon: Globe,
      iconColor: "text-purple-600",
      title: "Borderless Access",
      description: "Access your funds from anywhere in the world, anytime. No intermediaries, no restrictions."
    },
    {
      icon: TrendingUp,
      iconColor: "text-green-600",
      title: "Full Transparency",
      description: "Track every transaction on the blockchain. Immutable history and real-time balance updates."
    }
  ];

  const benefits = [
    "Enforced savings system with structured deposits",
    "Complete transaction history tracking",
    "Input validation and safety checks",
    "Protection against common user mistakes"
  ];


  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <Shield className="w-10 h-10 text-blue-600" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">SmartBank</h1>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6">
            Your Decentralized Banking Solution
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Store, manage, and track your ETH securely with blockchain technology. 
            Transparent, borderless, and always in your control.
          </p>
          <button 
            onClick={() => onNavigate('deposit')}
            className="btn-primary text-lg px-8 py-3 transform hover:scale-105"
          >
            Get Started
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        <div className="mt-20 card">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Why SmartBank?</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-600">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to get started?</h3>
          <p className="text-gray-600 mb-6">Experience the future of decentralized banking today.</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => onNavigate('deposit')}
              className="btn-primary"
            >
              Start Depositing
            </button>
            <button 
              onClick={() => onNavigate('dashboard')}
              className="btn-secondary"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
