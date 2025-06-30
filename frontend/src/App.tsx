import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Topbar from './components/Topbar';
import Homepage from './mainpages/Homepage';
import CleanPage1 from './mainpages/CleanPage1';
import Support from './mainpages/Support';
import Feedback from './mainpages/Feedback';
import Writter from './components/Writter';
import Logo from './components/Logo';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Topbar />
        <Logo />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/clean" element={<CleanPage1 />} />
          <Route path="/support" element={<Support />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
        <Writter />
      </div>
    </BrowserRouter>
  );
}

export default App;
