import React, { useState } from 'react';
import './Feedback.css';

const Feedback: React.FC = () => {
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
            <h2>Thanks! We truly appreciate your feedback and will take it into consideration.</h2>
          </div>
        ) : (
          <div className="form-card">
            <h2>Got Thoughts? We're Listening!</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group feel-group">
                <label>Feel:</label>
                <div className="feel-options">
                  <input type="radio" id="like" name="feel" value="like" defaultChecked/>
                  <label htmlFor="like" className="feel-label">👍</label>
                  <input type="radio" id="dislike" name="feel" value="dislike" />
                  <label htmlFor="dislike" className="feel-label">👎</label>
                </div>
              </div>
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
                <textarea id="content" placeholder="Anything you want to say.." required></textarea>
              </div>
              <button type="submit" className="submit-btn">Submit</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback; 