import React, { useState } from "react";
import "./SignIn.css";
import { BorderBeam } from "../components/magicui/border-beam";
import { cn } from "../lib/utils";
import { InteractiveHoverButton } from "../components/magicui/interactive-hover-button";

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
      const response = await fetch("http://localhost:8000/api/auth/login", {
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