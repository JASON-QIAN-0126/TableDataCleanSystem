import React, { useState } from "react";
import "./SignUp.css";
import { BorderBeam } from "../components/magicui/border-beam";
import { cn } from "../lib/utils";
import { InteractiveHoverButton } from "../components/magicui/interactive-hover-button";
import { API_BASE_URL } from "../lib/config";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
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
        <BorderBeam
          duration={10}
          size={400}
          borderWidth={light ? 2.5 : 2.2}
          className={cn(
            "from-transparent to-transparent",
            light ? "via-rose-300" : "via-indigo-400",
          )}
        />
        <BorderBeam
          duration={10}
          delay={3}
          size={400}
          borderWidth={light ? 2.5 : 2.2}
          className={cn(
            "from-transparent to-transparent",
            light ? "via-sky-300" : "via-fuchsia-400",
          )}
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
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`form-input ${light ? "light" : ""}`}
              placeholder="Enter your username"
              required
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label className={`form-label ${light ? "light" : ""}`}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-input ${light ? "light" : ""}`}
              placeholder="Enter your email"
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
              minLength={6}
            />
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