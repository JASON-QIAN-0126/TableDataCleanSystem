import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Topbar.css";

const NAVS = [
  { path: "/home", label: "Home" },
  { path: "/clean", label: "Clean" },
  { path: "/support", label: "Support" },
  { path: "/feedback", label: "Feedback" },
];

const Topbar: React.FC<{ light?: boolean }> = ({ light }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  if (light) {
    return (
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
      </div>
    );
  }

  return (
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
    </div>
  );
};

export default Topbar;
