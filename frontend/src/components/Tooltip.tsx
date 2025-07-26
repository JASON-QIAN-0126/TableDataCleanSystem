import React, { useEffect, useRef } from "react";
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
  const elementRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const cleanupTooltip = () => {
    if (tooltipRef.current) {
      try {
        if (document.body.contains(tooltipRef.current)) {
          document.body.removeChild(tooltipRef.current);
        }
      } catch (e) {
        console.warn("Failed to remove tooltip:", e);
      }
      tooltipRef.current = null;
    }

    if (elementRef.current) {
      delete (
        elementRef.current as HTMLSpanElement & {
          _tooltipElement?: HTMLDivElement;
        }
      )._tooltipElement;
    }
  };

  const cleanupAllTooltips = () => {
    const existingTooltips = document.querySelectorAll(".custom-tooltip");
    existingTooltips.forEach((tooltip) => {
      try {
        if (document.body.contains(tooltip)) {
          document.body.removeChild(tooltip);
        }
      } catch (e) {
        console.warn("Failed to cleanup tooltip:", e);
      }
    });
  };

  useEffect(() => {
    const handleGlobalInteraction = (e: MouseEvent) => {
      const target = e.target as Element;
      if (elementRef.current && !elementRef.current.contains(target)) {
        cleanupTooltip();
      }
    };

    const handleScroll = () => {
      cleanupTooltip();
    };

    document.addEventListener("mousemove", handleGlobalInteraction);
    document.addEventListener("click", handleGlobalInteraction);
    document.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousemove", handleGlobalInteraction);
      document.removeEventListener("click", handleGlobalInteraction);
      document.removeEventListener("scroll", handleScroll, true);
      cleanupTooltip();
    };
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    cleanupTooltip();
    cleanupAllTooltips();

    const tooltip = document.createElement("div");
    tooltip.className = "custom-tooltip";
    tooltip.textContent = tooltipText;

    const rect = e.currentTarget.getBoundingClientRect();
    tooltip.style.position = "absolute";
    tooltip.style.top = `${rect.top - 40}px`;
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.zIndex = "99999";
    tooltip.style.backgroundColor = light
      ? "rgba(255, 255, 255, 0.95)"
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
    tooltipRef.current = tooltip;
    (
      e.currentTarget as HTMLElement & { _tooltipElement?: HTMLDivElement }
    )._tooltipElement = tooltip;
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      cleanupTooltip();
    }, 100);
  };

  return (
    <span
      ref={elementRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-block" }}
    >
      {children}
    </span>
  );
};
