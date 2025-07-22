import React from "react";
import type { ReactNode } from "react";

interface CustomTooltipProps {
  tooltipText: string;
  children: ReactNode;
  light?: boolean;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  tooltipText,
  children,
  light = false,
}) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const tooltip = document.createElement("div");
    tooltip.className = "custom-tooltip";
    tooltip.textContent = tooltipText;

    const rect = e.currentTarget.getBoundingClientRect();
    tooltip.style.position = "absolute";
    tooltip.style.top = `${rect.top - 40}px`;
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.zIndex = "9999";
    tooltip.style.backgroundColor = light
      ? "rgba(255, 255, 255, 0.9)"
      : "rgba(108, 100, 255, 0.15)";
    tooltip.style.backdropFilter = "blur(8px)";
    tooltip.style.border = light
      ? "1px solid rgba(0, 0, 0, 0.1)"
      : "1px solid rgba(108, 100, 255, 0.4)";
    tooltip.style.color = light ? "#000000" : "#dbeafe";
    tooltip.style.padding = "8px 12px";
    tooltip.style.borderRadius = "6px";
    tooltip.style.fontSize = "12px";
    tooltip.style.whiteSpace = "nowrap";
    tooltip.style.pointerEvents = "none";
    tooltip.style.transition = "opacity 0.2s ease-in-out";

    document.body.appendChild(tooltip);
    (e.currentTarget as any)._tooltipElement = tooltip;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const tooltip = (e.currentTarget as any)._tooltipElement;
    if (tooltip) {
      document.body.removeChild(tooltip);
      delete (e.currentTarget as any)._tooltipElement;
    }
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-block" }}
    >
      {children}
    </span>
  );
};