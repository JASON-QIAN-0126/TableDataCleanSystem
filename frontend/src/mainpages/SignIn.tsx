import React, { useState } from "react";
import "./SignIn.css";
import { cn } from "../lib/utils";
import { InteractiveHoverButton } from "../components/magicui/interactive-hover-button";
import { API_BASE_URL } from "../lib/config";
import { ShineBorder } from "../components/magicui/shine-border";

interface SignInProps {
  light?: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
  onSignInSuccess: (user: any, token: string) => void;
}

const SignIn: React.FC<SignInProps> = ({ light, onClose, onSwitchToSignUp, onSignInSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onSignInSuccess(data.user, data.token);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`signin-modal ${light ? "light" : ""}`} onClick={(e) => e.stopPropagation()}>
      <ShineBorder
              borderWidth={light ? 2 : 1.5}
              shineColor={
                light
                  ? ["#FFD6E8", "#FFC86B", "#A0E7E5"]
                  : ["#FF6FD8", "#3813C2", "#45F3FF"]
              }
            />
        
        <div className="modal-header">
          <h2 className={`modal-title ${light ? "light" : ""}`}>Sign In</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="signin-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">❌</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className={`form-label ${light ? "light" : ""}`}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-input ${light ? "light" : ""}`}
              placeholder="Enter your registered email"
              required
            />
          </div>

          <div className="form-group">
            <label className={`form-label ${light ? "light" : ""}`}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`form-input ${light ? "light" : ""}`}
              placeholder="Enter your password"
              required
            />
          </div>

          <InteractiveHoverButton
            type="submit"
            className={cn("submit-button", light ? "light" : "")}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </InteractiveHoverButton>
        </form>

        <div className="modal-footer">
          <span className={`footer-text ${light ? "light" : ""}`}>
            Don't have an account?{" "}
            <button
              className={`switch-button ${light ? "light" : ""}`}
              onClick={onSwitchToSignUp}
            >
              Sign Up
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 