import React from "react";

interface GlareHoverProps {
  width?: string;
  height?: string;
  background?: string;
  borderRadius?: string;
  borderColor?: string;
  children?: React.ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const GlareHover: React.FC<GlareHoverProps> = ({
  width = "180px",
  height = "50px",
  background = "#3D3BFF",
  borderRadius = "16px",
  borderColor = "#fff",
  children,
  glareColor = "#ffffff",
  glareOpacity = 0.18,
  glareAngle = -45,
  glareSize = 180,
  transitionDuration = 650,
  playOnce = false,
  className = "",
  style = {},
}) => {
  const hex = glareColor.replace("#", "");
  let rgba = glareColor;
  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  } else if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  }

  const vars: React.CSSProperties & { [k: string]: string } = {
    "--gh-width": width,
    "--gh-height": height,
    "--gh-bg": background,
    "--gh-br": borderRadius,
    "--gh-angle": `${glareAngle}deg`,
    "--gh-duration": `${transitionDuration}ms`,
    "--gh-size": `${glareSize}%`,
    "--gh-rgba": rgba,
    "--gh-border": borderColor,
  };

  return (
    <div
      className={`glare-hover ${playOnce ? "glare-hover--play-once" : ""} ${className}`}
      style={{ ...vars, ...style } as React.CSSProperties}
    >
      {children}
      <style>{`
        .glare-hover {
          width: var(--gh-width);
          height: var(--gh-height);
          background: var(--gh-bg);
          border-radius: var(--gh-br);
          border: 1px solid var(--gh-border);
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 12px rgba(0,0,0,0.10);
        }
        .glare-hover::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(var(--gh-angle),
              hsla(0, 0%, 0%, 0) 60%,
              var(--gh-rgba) 70%,
              hsla(0, 0%, 0%, 0),
              hsla(0, 0%, 0%, 0) 100%);
          transition: var(--gh-duration) ease;
          background-size: var(--gh-size) var(--gh-size), 100% 100%;
          background-repeat: no-repeat;
          background-position: -100% -100%, 0 0;
          pointer-events: none;
        }
        .glare-hover:hover {
          cursor: pointer;
        }
        .glare-hover:hover::before {
          background-position: 100% 100%, 0 0;
        }
        .glare-hover--play-once::before {
          transition: none;
        }
        .glare-hover--play-once:hover::before {
          transition: var(--gh-duration) ease;
          background-position: 100% 100%, 0 0;
        }
      `}</style>
    </div>
  );
};

export default GlareHover;
