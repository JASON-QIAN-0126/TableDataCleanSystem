import React, { useState } from "react";
import "./SignUp.css";
import { cn } from "../lib/utils";
import { InteractiveHoverButton } from "../components/magicui/interactive-hover-button";
import { API_BASE_URL } from "../lib/config";
import { ShineBorder } from "../components/magicui/shine-border";
import { CustomTooltip } from "../components/Tooltip";

interface SignUpProps {
  light?: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
  onSignUpSuccess: (user: any, token: string) => void;
}

const SignUp: React.FC<SignUpProps> = ({ light, onClose, onSwitchToSignIn, onSignUpSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = (password: string) => {
    return password.length >= 6 && /[a-zA-Z]/.test(password) && /\d/.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters and contain both letters and numbers");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onSignUpSuccess(data.user, data.token);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`signup-modal ${light ? "light" : ""}`} onClick={(e) => e.stopPropagation()}>
        <ShineBorder
              borderWidth={light ? 2 : 1.5}
              shineColor={
                light
                  ? ["#FFD6E8", "#FFC86B", "#A0E7E5"]
                  : ["#FF6FD8", "#3813C2", "#45F3FF"]
              }
        />
        <div className="modal-header">
          <h2 className={`modal-title ${light ? "light" : ""}`}>Sign Up</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">❌</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className={`form-label ${light ? "light" : ""}`}>Username</label>
            <CustomTooltip 
                    tooltipText="Should be 3-20 letters or numbers"
                    light={light}
            >
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`form-input ${light ? "light" : ""}`}
                placeholder="Enter your username"
                required
                minLength={3}
              />
            </CustomTooltip>
          </div>

          <div className="form-group">
            <label className={`form-label ${light ? "light" : ""}`}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-input ${light ? "light" : ""}`}
              placeholder="Enter a valid email address"
              required
            />
          </div>

          <div className="form-group">
            <label className={`form-label ${light ? "light" : ""}`}>Password</label>
            <CustomTooltip 
                    tooltipText="Must contain 6 characters and numbers"
                    light={light}
            >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`form-input ${light ? "light" : ""}`}
              placeholder="Enter your password"
              required
            />
            </CustomTooltip>
          </div>

          <div className="form-group">
            <label className={`form-label ${light ? "light" : ""}`}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`form-input ${light ? "light" : ""}`}
              placeholder="Confirm your password"
              required
            />
          </div>

          <InteractiveHoverButton
            type="submit"
            className={cn("submit-button", light ? "light" : "")}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </InteractiveHoverButton>
        </form>

        <div className="modal-footer">
          <span className={`footer-text ${light ? "light" : ""}`}>
            Already have an account?{" "}
            <button
              className={`switch-button ${light ? "light" : ""}`}
              onClick={onSwitchToSignIn}
            >
              Sign In
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 