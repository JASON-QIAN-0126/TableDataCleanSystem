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

// 自定义hook来检测是否为移动端
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 450);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 450);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

function AppContent() {
  const [light, setLight] = useState(true); // 初始设置为light模式
  const location = useLocation();
  const isMobile = useIsMobile();

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
