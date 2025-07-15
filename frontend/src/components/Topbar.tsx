import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Topbar.css";
import SignIn from "../mainpages/SignIn";
import SignUp from "../mainpages/SignUp";

const NAVS = [
  { path: "/home", label: "Home" },
  { path: "/clean", label: "Clean" },
  { path: "/support", label: "Support" },
  { path: "/feedback", label: "Feedback" },
];

interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
}

const Topbar: React.FC<{ light?: boolean }> = ({ light }) => {
  const location = useLocation();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleSignInSuccess = (userData: User, token: string) => {
    setUser(userData);
    setShowSignIn(false);
  };

  const handleSignUpSuccess = (userData: User, token: string) => {
    setUser(userData);
    setShowSignUp(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowUserMenu(false);
  };

  const switchToSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  const switchToSignIn = () => {
    setShowSignUp(false);
    setShowSignIn(true);
  };

  const renderAuthButtons = () => {
    if (user) {
      return (
        <div className="user-section">
          <span className={`username ${light ? "light" : ""}`}>{user.username}</span>
          <div 
            className="user-avatar-container"
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <div className={`user-avatar ${light ? "light" : ""}`}>
              {user.avatar === 'default-avatar.png' ? '👤' : user.avatar}
            </div>
            {showUserMenu && (
              <div className={`user-menu ${light ? "light" : ""}`}>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="auth-buttons">
        <button
          className={`signup-button ${light ? "light" : ""}`}
          onClick={() => setShowSignUp(true)}
        >
          Sign up
        </button>
        <button
          className={`signin-button ${light ? "light" : ""}`}
          onClick={() => setShowSignIn(true)}
        >
          Sign in
        </button>
      </div>
    );
  };

  if (light) {
    return (
      <>
        <div className="topbar-container topbar-light">
          <nav className="topbar-nav">
            {NAVS.map((nav) => (
              <Link
                key={nav.path}
                to={nav.path}
                className={`nav-link topbar-link ${isActive(nav.path) ? "active-light" : ""}`}
              >
                {nav.label}
              </Link>
            ))}
          </nav>
          {renderAuthButtons()}
        </div>
        {showSignIn && (
          <SignIn
            light={light}
            onClose={() => setShowSignIn(false)}
            onSwitchToSignUp={switchToSignUp}
            onSignInSuccess={handleSignInSuccess}
          />
        )}
        {showSignUp && (
          <SignUp
            light={light}
            onClose={() => setShowSignUp(false)}
            onSwitchToSignIn={switchToSignIn}
            onSignUpSuccess={handleSignUpSuccess}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="topbar-container topbar-dark">
        <nav className="topbar-nav">
          {NAVS.map((nav) => (
            <Link
              key={nav.path}
              to={nav.path}
              className={`nav-link topbar-link ${isActive(nav.path) ? "active-dark" : ""}`}
            >
              {nav.label}
            </Link>
          ))}
        </nav>
        {renderAuthButtons()}
      </div>
      {showSignIn && (
        <SignIn
          light={light}
          onClose={() => setShowSignIn(false)}
          onSwitchToSignUp={switchToSignUp}
          onSignInSuccess={handleSignInSuccess}
        />
      )}
      {showSignUp && (
        <SignUp
          light={light}
          onClose={() => setShowSignUp(false)}
          onSwitchToSignIn={switchToSignIn}
          onSignUpSuccess={handleSignUpSuccess}
        />
      )}
    </>
  );
};

export default Topbar;
