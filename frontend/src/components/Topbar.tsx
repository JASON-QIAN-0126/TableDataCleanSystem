import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Topbar.css";
import SignIn from "../mainpages/SignIn";
import SignUp from "../mainpages/SignUp";
import Switch from "./Switch";

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

interface TopbarProps {
  light?: boolean;
  setLight?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Topbar: React.FC<TopbarProps> = ({ light, setLight }) => {
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

  const handleSignInSuccess = (userData: User, _token: string) => {
    setUser(userData);
    setShowSignIn(false);
  };

  const handleSignUpSuccess = (userData: User, _token: string) => {
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

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowUserMenu((v) => !v);
  };

  React.useEffect(() => {
    if (!showUserMenu) return;
    const handleClick = () => setShowUserMenu(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [showUserMenu]);

  const renderAuthButtons = () => {
    return (
      <div className="auth-buttons">
        {typeof setLight === 'function' && (
          <Switch
            checked={!!light}
            onChange={() => setLight((v: boolean) => !v)}
            light={!!light}
          />
        )}
        {user ? (
          <>
            <span className={`username ${light ? "light" : ""}`}>{user.username}</span>
            <div className="user-avatar-container" style={{ position: 'relative' }}>
              <div
                className={`user-avatar ${light ? "light" : ""}`}
                onClick={handleAvatarClick}
                tabIndex={0}
                style={{ cursor: 'pointer' }}
              >
                {user.avatar === 'default-avatar.png' ? '👤' : user.avatar}
              </div>
              {showUserMenu && (
                <div
                  className={`user-menu ${light ? "light" : ""}`}
                  onClick={(e) => e.stopPropagation()}
                  tabIndex={0}
                >
                  <button className="logout-button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              className={`signup-button ${light ? "light" : ""}`}
              onClick={() => setShowSignUp(true)}
              style={{ marginRight: 0 }}
            >
              Sign up
            </button>
            <button
              className={`signin-button ${light ? "light" : ""}`}
              onClick={() => setShowSignIn(true)}
            >
              Sign in
            </button>
          </>
        )}
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
