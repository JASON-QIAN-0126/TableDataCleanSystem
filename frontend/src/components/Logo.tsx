import React from 'react';
import './Logo.css';
import logoSrc from '../assets/logo1.png';

const Logo: React.FC = () => {
  return (
    <div className="logo-container">
      <img src={logoSrc} alt="Data Clean System Logo" className="logo-image" />
    </div>
  );
};

export default Logo; 