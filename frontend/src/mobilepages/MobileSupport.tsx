import React, { useState } from "react";
import "./MobileSupport.css";

const MobileSupport: React.FC<{ light?: boolean }> = ({ light }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
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

  if (submitted) {
    return (
      <div 
        className={`mobile-support-container ${light ? "light" : ""}`}
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
        
        <div className={`mobile-support-card ${light ? "light" : ""}`} style={{ position: "relative", zIndex: 3 }}>
          <div className="success-icon">
            <div className={`checkmark ${light ? "light" : ""}`}>✓</div>
          </div>
          
          <h1 className={`mobile-support-title ${light ? "light" : ""}`}>
            Message Sent!
          </h1>
          
          <div className={`thank-you-text ${light ? "light" : ""}`}>
            Thank you for your message. Our team will get back to you shortly.
          </div>
          
          <button
            className={`back-button ${light ? "light" : ""}`}
            onClick={() => setSubmitted(false)}
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`mobile-support-container ${light ? "light" : ""}`}
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
      
      <div className={`mobile-support-card ${light ? "light" : ""}`} style={{ position: "relative", zIndex: 3 }}>
        <h1 className={`mobile-support-title ${light ? "light" : ""}`}>
          Need Help With Cleaning?
        </h1>
        
        <form onSubmit={handleSubmit} className="support-form">
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
              placeholder="Please describe the issue you're facing..."
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            className={`submit-button ${light ? "light" : ""}`}
            disabled={!formData.name || !formData.email || !formData.content}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default MobileSupport; 