import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SignIn from "../mainpages/SignIn";
import SignUp from "../mainpages/SignUp";
import Switch from "../components/Switch";
import "./MobileTopbar.css";

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

interface MobileTopbarProps {
  light?: boolean;
  setLight?: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileTopbar: React.FC<MobileTopbarProps> = ({ light, setLight }) => {
  const location = useLocation();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
  };

  const handleSignUpSuccess = (userData: User, _token: string) => {
    setUser(userData);
    setShowSignUp(false);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowUserMenu(false);
    setMenuOpen(false);
  };

  const switchToSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  const switchToSignIn = () => {
    setShowSignUp(false);
    setShowSignIn(true);
  };

  const handleMenuItemClick = () => {
    setMenuOpen(false);
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

  return (
    <>
      <div className={`mobile-topbar ${light ? "light" : ""}`}>
        <button
          className={`hamburger-button ${light ? "light" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className={`hamburger-line ${light ? "light" : ""}`}></div>
          <div className={`hamburger-line ${light ? "light" : ""}`}></div>
          <div className={`hamburger-line ${light ? "light" : ""}`}></div>
        </button>

        {menuOpen && (
          <div className={`mobile-menu ${light ? "light" : ""}`}>
            <nav className="mobile-nav">
              {NAVS.map((nav) => (
                <Link
                  key={nav.path}
                  to={nav.path}
                  className={`mobile-nav-link ${isActive(nav.path) ? "active" : ""} ${light ? "light" : ""}`}
                  onClick={handleMenuItemClick}
                >
                  {nav.label}
                </Link>
              ))}
            </nav>
            
            <div className="mobile-auth-section">
              {typeof setLight === 'function' && (
                <div className="mobile-switch-container">
                  <span className={`switch-label ${light ? "light" : ""}`}>Dark Mode</span>
                  <Switch
                    checked={!!light}
                    onChange={() => setLight((v: boolean) => !v)}
                    light={!!light}
                  />
                </div>
              )}
              
              {user ? (
                <div className="mobile-user-section">
                  <div className="mobile-user-info">
                    <span className={`mobile-username ${light ? "light" : ""}`}>{user.username}</span>
                    <div className="mobile-user-avatar-container">
                      <div
                        className={`mobile-user-avatar ${light ? "light" : ""}`}
                        onClick={handleAvatarClick}
                      >
                        {user.avatar === 'default-avatar.png' ? '👤' : user.avatar}
                      </div>
                      {showUserMenu && (
                        <div className={`mobile-user-menu ${light ? "light" : ""}`}>
                          <button className="mobile-logout-button" onClick={handleLogout}>
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mobile-auth-buttons">
                  <button
                    className={`mobile-signup-button ${light ? "light" : ""}`}
                    onClick={() => {
                      setShowSignUp(true);
                      setMenuOpen(false);
                    }}
                  >
                    Sign up
                  </button>
                  <button
                    className={`mobile-signin-button ${light ? "light" : ""}`}
                    onClick={() => {
                      setShowSignIn(true);
                      setMenuOpen(false);
                    }}
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
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

export default MobileTopbar; 