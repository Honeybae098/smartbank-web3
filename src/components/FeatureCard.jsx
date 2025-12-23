// src/components/FeatureCard.jsx
import React from 'react';

const FeatureCard = ({ icon: Icon, title, description, iconColor }) => {
  return (
    <div className="card card-hover">
      <Icon className={`w-12 h-12 ${iconColor} mb-4`} />
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
