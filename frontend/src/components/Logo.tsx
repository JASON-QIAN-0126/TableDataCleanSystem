import React from "react";
import "./Logo.css";
import logoSrc from "../assets/logo1.png";
import logoSrcL from "../assets/logo_l.png";

const Logo: React.FC<{ light?: boolean }> = ({ light }) => {
  const logo = light ? logoSrcL : logoSrc;

  return (
    <div className="logo-container">
      <img src={logo} alt="Data Clean System Logo" className="logo-image" />
    </div>
  );
};

export default Logo;
