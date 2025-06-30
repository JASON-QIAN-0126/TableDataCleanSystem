import React from 'react';
import { Link } from 'react-router-dom';
import './Topbar.css';

const Topbar: React.FC = () => {
  return (
    <div className="topbar-container">
      <nav className="topbar-nav">
        <Link to="/home" className="nav-link topbar-link">Home</Link>
        <Link to="/clean" className="nav-link topbar-link">Clean</Link>
        <Link to="/support" className="nav-link topbar-link">Support</Link>
        <Link to="/feedback" className="nav-link topbar-link">Feedback</Link>
      </nav>
    </div>
  );
};

export default Topbar;