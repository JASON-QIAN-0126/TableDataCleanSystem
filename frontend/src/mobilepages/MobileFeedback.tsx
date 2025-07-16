import React, { useState } from "react";
import "./MobileFeedback.css";

const MobileFeedback: React.FC<{ light?: boolean }> = ({ light }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    feel: "like",
    name: "",
    email: "",
    content: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.content) {
      return;
    }
    setSubmitted(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeelChange = (feel: string) => {
    setFormData(prev => ({
      ...prev,
      feel
    }));
  };

  if (submitted) {
    return (
      <div 
        className={`mobile-feedback-container ${light ? "light" : ""}`}
        style={{
          backgroundImage: light
            ? "url('/background_l2.png')"
            : "url('/Background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        {light && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              pointerEvents: "none",
              mixBlendMode: "multiply",
            }}
          />
        )}
        
        <div className={`mobile-feedback-card ${light ? "light" : ""}`} style={{ position: "relative", zIndex: 3 }}>
          <div className="success-icon">
            <div className={`checkmark ${light ? "light" : ""}`}>✓</div>
          </div>
          
          <h1 className={`mobile-feedback-title ${light ? "light" : ""}`}>
            Thank You!
          </h1>
          
          <div className={`thank-you-text ${light ? "light" : ""}`}>
            Thanks! We truly appreciate your feedback and will take it into consideration.
          </div>
          
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`mobile-feedback-container ${light ? "light" : ""}`}
      style={{
        backgroundImage: light
          ? "url('/background_l2.png')"
          : "url('/Background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {light && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
            mixBlendMode: "multiply",
          }}
        />
      )}
      
      <div className={`mobile-feedback-card ${light ? "light" : ""}`} style={{ position: "relative", zIndex: 3 }}>
        <h1 className={`mobile-feedback-title ${light ? "light" : ""}`}>
          Got Thoughts?
        </h1>
        
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-section">
            <label className={`form-label ${light ? "light" : ""}`}>Feel</label>
            <div className="feel-options">
              <button
                type="button"
                className={`feel-button ${formData.feel === "like" ? "active" : ""} ${light ? "light" : ""}`}
                onClick={() => handleFeelChange("like")}
              >
                👍 Like
              </button>
              <button
                type="button"
                className={`feel-button ${formData.feel === "dislike" ? "active" : ""} ${light ? "light" : ""}`}
                onClick={() => handleFeelChange("dislike")}
              >
                👎 Dislike
              </button>
            </div>
          </div>

          <div className="form-section">
            <label className={`form-label ${light ? "light" : ""}`}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-input ${light ? "light" : ""}`}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-section">
            <label className={`form-label ${light ? "light" : ""}`}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${light ? "light" : ""}`}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-section">
            <label className={`form-label ${light ? "light" : ""}`}>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className={`form-textarea ${light ? "light" : ""}`}
              placeholder="Share your thoughts about our service..."
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            className={`submit-button ${light ? "light" : ""}`}
            disabled={!formData.name || !formData.email || !formData.content}
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default MobileFeedback; 