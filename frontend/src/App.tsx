import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Topbar from "./components/Topbar";
import Homepage from "./mainpages/Homepage";
import CleanPage1 from "./mainpages/CleanPage1";
import Support from "./mainpages/Support";
import Feedback from "./mainpages/Feedback";
import Writter from "./components/Writter";
import Logo from "./components/Logo";
import MobileTopbar from "./mobilepages/MobileTopbar";
import MobileHomepage from "./mobilepages/MobileHomepage";
import MobileCleanPage1 from "./mobilepages/MobileCleanPage1";
import MobileSupport from "./mobilepages/MobileSupport";
import MobileFeedback from "./mobilepages/MobileFeedback";
import "./App.css";
import Warning from "./mobilepages/warning";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

function useIsNarrowScreen(threshold = 1050) {
  const [isNarrow, setIsNarrow] = useState(window.innerWidth < threshold);

  useEffect(() => {
    const handleResize = () => {
      setIsNarrow(window.innerWidth < threshold);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [threshold]);

  return isNarrow;
}

function AppContent() {
  const [light, setLight] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const isNarrow = useIsNarrowScreen(1050);

  if (isMobile) {
    return (
      <div className="app-container mobile">
        <MobileTopbar light={light} setLight={setLight} />
        <Logo light={light} />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<MobileHomepage light={light} />} />
          <Route path="/clean" element={<MobileCleanPage1 light={light} />} />
          <Route path="/support" element={<MobileSupport light={light} />} />
          <Route path="/feedback" element={<MobileFeedback light={light} />} />
        </Routes>
        {location.pathname == "/home" && <Writter />}
        {isNarrow && <Warning />}
      </div>
    );
  }

  return (
    <div className="app-container desktop">
      <Topbar light={light} setLight={setLight} />
      <Logo light={light} />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Homepage light={light} />} />
        <Route path="/clean" element={<CleanPage1 light={light} />} />
        <Route path="/support" element={<Support light={light} />} />
        <Route path="/feedback" element={<Feedback light={light} />} />
      </Routes>
      {location.pathname == "/home" && <Writter />}
      {isNarrow && <Warning />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
