import React from "react";
import { Sun, Moon } from "lucide-react";
import "./Switch.css";

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  light?: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  light = true,
}) => {
  return (
    <div
      onClick={onChange}
      className={`neon-switch ${checked ? "checked" : ""} ${light ? "light" : ""}`}
    >
      <div className="switch-track">
        <div className="switch-thumb">
          <div className="switch-inner-glow">
            {light ? (
              <Sun className="switch-icon sun-icon" size={14} />
            ) : (
              <Moon className="switch-icon moon-icon" size={14} />
            )}
          </div>
        </div>
      </div>
      <div className="switch-glow"></div>
    </div>
  );
};

export default Switch;
