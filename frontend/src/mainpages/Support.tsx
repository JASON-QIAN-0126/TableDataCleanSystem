import React, { useState } from "react";
import "./Support.css";
import { ShineBorder } from "../components/magicui/shine-border";

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
              backgroundImage: "url('/background_l2.webp')",
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
              <div className="submit-btn-container">  
                <button type="submit" className={`submit-btn-fly ${light ? "light" : ""}`}>
                  <div className="svg-wrapper-1">
                    <div className="svg-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path
                          fill="currentColor"
                          d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <span>Submit</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
