import React from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import Feature from "../components/Feature";
import { Button } from "../components/ui/startbutton";
import { BorderBeam } from "../components/magicui/border-beam";
import iconf1 from "../assets/f1.png";
import iconf2 from "../assets/f2.png";
import iconf3 from "../assets/f3.png";
import "./Homepage.css";
import { cn } from "../lib/utils";
import { AnimatedGradientText } from "../components/magicui/animated-gradient-text";
import TitleLight from "../components/Title_light";

const Homepage: React.FC<{ light?: boolean }> = ({ light = true }) => {
  const navigate = useNavigate();

  const handleStartClean = () => {
    navigate("/clean");
  };

  return (
    <div
      className="homepage-container"
      style={{
        backgroundImage: light
          ? "url('/background_l.png')"
          : "url('/Background.png')",
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
      <main
        className="homepage-main"
        style={{ position: "relative", zIndex: 3 }}
      >
        <div className="left-panel">
          {light ? <TitleLight /> : <Title light={light} />}

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
        <div className="right-panel fade-inh">
          <Feature icon={iconf1} title="Extract" subtitle="Name & Email" />
          <Feature icon={iconf2} title="Summary" subtitle="Org. & Role" />
          <Feature
            icon={iconf3}
            title="Search and Get"
            subtitle="Specified Data"
          />
        </div>
      </main>
    </div>
  );
};

export default Homepage;
