import React from "react";

const shinyKeyframes = `
@keyframes shine {
  0% { background-position: 100%; }
  100% { background-position: -100%; }
}`;

const shinyStyle: React.CSSProperties = {
  color: '#fff',
  background: 'linear-gradient(120deg, #fff 40%,rgb(216, 191, 216) 50%, #fff 60%)',
  backgroundSize: '200% 100%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  display: 'inline-block',
  animation: 'shine 2.5s linear infinite',
  fontWeight: 700,
};

interface FeatureProps {
  icon: string;
  title: string;
  subtitle: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, subtitle }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        background: 'rgba(40,40,60,0.28)',
        borderRadius: 25,
        padding: '20px 30px',
        marginBottom: 26,
        boxShadow: '0 6px 30px 0 rgba(80,120,255,0.16), 0 1.4px 0 0 rgba(255,255,255,0.12) inset',
        minWidth: 265,
        minHeight: 75,
        gap: 23,
        border: '1px solid rgba(120,180,255,0.22)',
        width: 265,
        backdropFilter: 'blur(6.5px)',
        WebkitBackdropFilter: 'blur(6.5px)',
        transition: 'box-shadow 0.25s, border-color 0.25s, background 0.25s',
        position: 'relative',
      }}
    >
      <style>{shinyKeyframes}</style>
      <img
        src={icon}
        alt="feature icon"
        style={{
          width: 55,
          height: 55,
          objectFit: 'contain',
          flexShrink: 0,
          filter: 'brightness(10) grayscale(1)',
          marginRight: 23,
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          fontFamily: 'Times New Roman, Times, serif',
          fontSize: 22.5,
          lineHeight: 1.1,
          marginBottom: 2,
          ...shinyStyle,
        }}>{title}</div>
        <div style={{
          fontFamily: 'Times New Roman, Times, serif',
          fontSize: 16,
          lineHeight: 1.1,
          ...shinyStyle,
          fontWeight: 400,
        }}>{subtitle}</div>
      </div>
    </div>
  );
};

export default Feature; 