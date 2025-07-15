import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import Topbar from "./components/Topbar";
import Homepage from "./mainpages/Homepage";
import CleanPage1 from "./mainpages/CleanPage1";
import Support from "./mainpages/Support";
import Feedback from "./mainpages/Feedback";
import Writter from "./components/Writter";
import Logo from "./components/Logo";
import "./App.css";

function AppContent() {
  const [light, setLight] = useState(false);
  const location = useLocation();

  return (
    <div className="app-container">
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
