import React from "react";
import "./CleanPage3.css";
import { BorderBeam } from "../components/magicui/border-beam";
import { cn } from "../lib/utils";

const CleanPage3: React.FC<{ light?: boolean }> = ({ light }) => {
  return (
    <div
      className={`clean-page3-container ${light ? "light" : ""}`}
      style={{ position: "relative", overflow: "visible" }}
    >
      <BorderBeam
        duration={10}
        size={400}
        borderWidth={2.2}
        className={cn(
          "from-transparent to-transparent",
          light ? "via-gray-400" : "via-blue-500",
        )}
      />
      <BorderBeam
        duration={10}
        delay={3}
        size={400}
        borderWidth={2.2}
        className={cn(
          "from-transparent to-transparent",
          light ? "via-amber-400" : "via-violet-700",
        )}
      />
      <h2 className={`clean-page3-title ${light ? "light" : ""}`}>
        System Report
      </h2>
      <div className={`clean-page3-report ${light ? "light" : ""}`}>
        {/* System Report */}
      </div>
    </div>
  );
};

export default CleanPage3;
