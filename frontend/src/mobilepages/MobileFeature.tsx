import React from "react";
import "./MobileFeature.css";

const shinyKeyframes = `
@keyframes mobile-shine {
  0% { background-position: 100%; }
  100% { background-position: -100%; }
}`;

const shinyStyle: React.CSSProperties = {
  color: "#fff",
  background:
    "linear-gradient(120deg, #fff 40%,rgb(216, 191, 216) 50%, #fff 60%)",
  backgroundSize: "200% 100%",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  display: "inline-block",
  animation: "mobile-shine 2.5s linear infinite",
  fontWeight: 700,
};

interface MobileFeatureProps {
  icon: string;
  title: string;
  subtitle: string;
  light?: boolean;
}

const MobileFeature: React.FC<MobileFeatureProps> = ({ icon, title, subtitle, light }) => {
  return (
    <div className={`mobile-feature ${light ? "light" : ""}`}>
      <style>{shinyKeyframes}</style>
      <img
        src={icon}
        alt="feature icon"
        className="mobile-feature-icon"
      />
      <div className="mobile-feature-content">
        <div className="mobile-feature-title" style={shinyStyle}>
          {title}
        </div>
        <div className="mobile-feature-subtitle" style={{...shinyStyle, fontWeight: 400}}>
          {subtitle}
        </div>
      </div>
    </div>
  );
};

export default MobileFeature; 