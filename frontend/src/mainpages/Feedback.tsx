import React, { useState } from "react";
import "./Feedback.css";
import { ShineBorder } from "../components/magicui/shine-border";
import { ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";

const Feedback: React.FC<{ light?: boolean }> = ({ light }) => {
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
              Thanks! We truly appreciate your feedback and will take it into
              consideration.
            </h2>
          </div>
        ) : (
          <div className={`form-card ${light ? "light" : ""}`}>
            <ShineBorder
              borderWidth={light ? 2 : 1}
              shineColor={
                light
                  ? ["#FFD6E8", "#FFC86B", "#A0E7E5"]
                  : ["#FF6FD8", "#3813C2", "#45F3FF"]
              }
            />
            <h2>Got Thoughts? We're Listening!</h2>
            <form onSubmit={handleSubmit}>
              <div className={`form-group feel-group ${light ? "light" : ""}`}>
                <label>Feel:</label>
                <div className={`feel-options ${light ? "light" : ""}`}>
                  <input
                    type="radio"
                    id="like"
                    name="feel"
                    value="like"
                    defaultChecked
                  />
                  <label
                    htmlFor="like"
                    className={`feel-label ${light ? "light" : ""}`}
                  >
                    👍
                  </label>
                  <input
                    type="radio"
                    id="dislike"
                    name="feel"
                    value="dislike"
                  />
                  <label
                    htmlFor="dislike"
                    className={`feel-label ${light ? "light" : ""}`}
                  >
                    👎
                  </label>
                </div>
              </div>
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
                  placeholder="Anything you want to say.."
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

export default Feedback;
