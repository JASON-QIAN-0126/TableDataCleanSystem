import React, { useState } from 'react';
import './Support.css';

const Support: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="form-page-container">
      <div className="fade-in">
        {submitted ? (
          <div className="thank-you-message">
            <h2>Thank you for your message. Our team will get back to you shortly.</h2>
          </div>
        ) : (
          <div className="form-card">
            <h2>Need Help With Cleaning?</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="content">Content:</label>
                <textarea id="content" placeholder="Please describe the issue you're facing..." required></textarea>
              </div>
              <button type="submit" className="submit-btn">Submit</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support; 