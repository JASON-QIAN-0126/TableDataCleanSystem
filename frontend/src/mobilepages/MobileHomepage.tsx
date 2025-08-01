import React from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import TitleLight from "../components/Title_light";
import MobileFeature from "./MobileFeature";
import { Button } from "../components/ui/startbutton";
import { BorderBeam } from "../components/magicui/border-beam";
import iconf1 from "../assets/f1.png";
import iconf2 from "../assets/f2.png";
import iconf3 from "../assets/f3.png";
import "./MobileHomepage.css";
import { cn } from "../lib/utils";
import { AnimatedGradientText } from "../components/magicui/animated-gradient-text";

const MobileHomepage: React.FC<{ light?: boolean }> = ({ light = true }) => {
  const navigate = useNavigate();

  const handleStartClean = () => {
    navigate("/clean");
  };

  return (
    <div
      className={`mobile-homepage-container ${light ? "light" : ""}`}
      style={{
        backgroundImage: light
          ? "url('/background_l.webp')"
          : "url('/Background.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {light && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
            mixBlendMode: "multiply",
          }}
        />
      )}
      
      <main className="mobile-homepage-main" style={{ position: "relative", zIndex: 3 }}>
        <div className="mobile-title-section">
          {light ? <TitleLight /> : <Title light={light} />}
        </div>

        <div className="mobile-button-section">
          <div className="relative inline-block p-0.5 rounded-[18px]">
            <BorderBeam
              size={60}
              duration={3}
              initialOffset={20}
              colorFrom={light ? "#9C40FF" : "#7C3AED"}
              colorTo={light ? "#FDEDE8" : "#3B82F6"}
              transition={{
                type: "spring",
                stiffness: 60,
                damping: 20,
              }}
            />
            <Button
              className={cn(
                "cursor-pointer hover:scale-105 transition-transform duration-200 px-6 py-3 text-base rounded-[18px]",
                light ? "bg-black text-white" : "bg-white text-black",
              )}
              size="lg"
              variant="default"
              onClick={handleStartClean}
            >
              <AnimatedGradientText
                speed={light ? 2.5 : 1}
                colorFrom={light ? "#FEC8FF" : "#3B82F6"}
                colorTo={light ? "#fffbff" : "#692cf3"}
              >
                Start Clean
              </AnimatedGradientText>
            </Button>
          </div>
        </div>

        <div className="mobile-features-section">
          <MobileFeature 
            icon={iconf1} 
            title="Extract" 
            subtitle="Name & Email" 
            light={light}
          />
          <MobileFeature 
            icon={iconf2} 
            title="Summary" 
            subtitle="Org. & Role" 
            light={light}
          />
          <MobileFeature
            icon={iconf3}
            title="Search and Get"
            subtitle="Specified Data"
            light={light}
          />
        </div>
      </main>
    </div>
  );
};

export default MobileHomepage; 