import React from 'react';
import { Link } from 'react-router-dom';
import Title from '../components/Title';
import Feature from '../components/Feature';
import GlareHover from '../components/GlareHover';
import iconf1 from '../assets/f1.png';
import iconf2 from '../assets/f2.png';
import iconf3 from '../assets/f3.png';
import './Homepage.css';

const Homepage: React.FC = () => {
  return (
    <div className="homepage-container">
      <main className="homepage-main">
        <div className="left-panel">
          <Title />
          <GlareHover background="#3D3BFF" borderRadius="16px" borderColor="#fff">
            <Link to="/clean" className="start-clean-btn">
              Start Clean
            </Link>
          </GlareHover>
        </div>
        <div className="right-panel fade-inh">
          <Feature icon={iconf1} title="Extract" subtitle="Name & Email" />
          <Feature icon={iconf2} title="Summary" subtitle="Org. & Role" />
          <Feature icon={iconf3} title="Search and Get" subtitle="Specified Data" />
        </div>
      </main>
    </div>
  );
};

export default Homepage; 