import React, { useState, useEffect } from "react";
import "./Processing.css";

interface ProcessingProps {
  className?: string;
  light?: boolean;
}

const Processing: React.FC<ProcessingProps> = ({
  className = "",
  light = true,
}) => {
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    "Processing Email ...",
    "Processing Name ...",
    "Processing Organization ...",
    "Processing Role ...",
    "Extracting User Specified Data ...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % stages.length);
    }, 2000); // change every 2 seconds

    return () => clearInterval(interval);
  }, [stages.length]);

  return (
    <div className={`loader__balls ${className}`}>
      <div className="loader__balls__group">
        <div className="loader__balls__column">
          <div className="ball item1"></div>
        </div>
        <div className="loader__balls__column">
          <div className="ball item2"></div>
        </div>
        <div className="loader__balls__column">
          <div className="ball item3"></div>
        </div>
      </div>
      <div className={`processing-text ${light ? "light" : ""}`}>
        <span key={currentStage} className="processing-stage">
          {stages[currentStage]}
        </span>
      </div>
    </div>
  );
};

export default Processing;
