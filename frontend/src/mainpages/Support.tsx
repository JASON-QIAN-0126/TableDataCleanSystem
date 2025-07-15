import React, { useState } from "react";
import "./Support.css";
import { ShineBorder } from "../components/magicui/shine-border";
import { ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";

const Support: React.FC<{ light?: boolean }> = ({ light }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="form-page-container"
      style={
        light
          ? {
              backgroundImage: "url('/src/assets/background_l2.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "100vh",
            }
          : {}
      }
    >
      <div className="fade-in">
        {submitted ? (
          <div className={`thank-you-message ${light ? "light" : ""}`}>
            <h2>
              Thank you for your message. Our team will get back to you shortly.
            </h2>
          </div>
        ) : (
          <div className={`form-card ${light ? "light" : ""}`}>
            <ShineBorder
              borderWidth={light ? 2 : 1.5}
              shineColor={
                light
                  ? ["#FFD6E8", "#FFC86B", "#A0E7E5"]
                  : ["#FF6FD8", "#3813C2", "#45F3FF"]
              }
            />
            <h2>Need Help With Cleaning?</h2>
            <form onSubmit={handleSubmit}>
              <div className={`form-group ${light ? "light" : ""}`}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" required />
              </div>
              <div className={`form-group ${light ? "light" : ""}`}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" required />
              </div>
              <div className={`form-group ${light ? "light" : ""}`}>
                <label htmlFor="content">Content:</label>
                <textarea
                  id="content"
                  placeholder="Please describe the issue you're facing..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className={cn("submit-btn group", light ? "light" : "")}
              >
                <span className="flex items-center justify-center gap-1">
                  Submit
                  <ArrowRight className="ml-1 h-5 w-5 opacity-0 translate-x-[-4px] transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
