import React, { useState, useEffect } from "react";
import "./Profile.css";
import { ShineBorder } from "../components/magicui/shine-border";
import { API_BASE_URL } from "../lib/config";

interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
}

interface CleanHistory {
  id: string;
  date: string;
  fileName: string;
  recordsCount: number;
  status: 'completed' | 'failed';
}

const Profile: React.FC<{ light?: boolean }> = ({ light }) => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cleanHistory, setCleanHistory] = useState<CleanHistory[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setUsername(parsedUser.username);

        const historyKey = `cleanHistory_${parsedUser.id}`;
        const history = localStorage.getItem(historyKey);
        if (history) {
          try {
            setCleanHistory(JSON.parse(history));
          } catch (error) {
            console.error("Error parsing clean history:", error);
          }
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || username.trim() === user.username) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update username");
      }

      const updatedUser = { ...user, username: username.trim() };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      setSuccess("Username updated successfully");

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update username");
      setUsername(user.username);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
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
          <div className={`form-card ${light ? "light" : ""}`}>
            <h2>Please sign in first</h2>
          </div>
        </div>
      </div>
    );
  }

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
        <div className={`profile-card ${light ? "light" : ""}`}>
          <ShineBorder
            borderWidth={light ? 2 : 1.5}
            shineColor={
              light
                ? ["#FFD6E8", "#FFC86B", "#A0E7E5"]
                : ["#FF6FD8", "#3813C2", "#45F3FF"]
            }
          />
          
          <h2 className={`profile-title ${light ? "light" : ""}`}>User Profile</h2>
          
          <div className="profile-section">
            <h3 className={`section-title ${light ? "light" : ""}`}>Basic Information</h3>
            
            {error && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                <span className="error-text">{error}</span>
              </div>
            )}
            
            {success && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                <span className="success-text">{success}</span>
              </div>
            )}

            <div className="user-info">
              <div className="info-row">
                <label className={`info-label ${light ? "light" : ""}`}>Email:</label>
                <span className={`info-value ${light ? "light" : ""}`}>{user.email}</span>
              </div>
              
              <div className="info-row">
                <label className={`info-label ${light ? "light" : ""}`}>Username:</label>
                {isEditing ? (
                  <form onSubmit={handleUpdateUsername} className="username-edit-form">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`username-input ${light ? "light" : ""}`}
                      minLength={3}
                      maxLength={20}
                      required
                    />
                    <div className="edit-buttons">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`save-btn ${light ? "light" : ""}`}
                      >
                        {isLoading ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setUsername(user.username);
                          setError("");
                          setSuccess("");
                        }}
                        className={`cancel-btn ${light ? "light" : ""}`}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="username-display">
                    <span className={`info-value ${light ? "light" : ""}`}>{user.username}</span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`edit-btn ${light ? "light" : ""}`}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3 className={`section-title ${light ? "light" : ""}`}>
              Clean History
              {cleanHistory.length > 3 && (
                <span className={`scroll-hint ${light ? "light" : ""}`}>
                  ({cleanHistory.length} records - scroll to view all)
                </span>
              )}
            </h3>
            
            {cleanHistory.length === 0 ? (
              <div className={`no-history ${light ? "light" : ""}`}>
                No clean history
              </div>
            ) : (
              <div className="history-list">
                {cleanHistory.map((record) => (
                  <div key={record.id} className={`history-item ${light ? "light" : ""}`}>
                    <div className="history-info">
                      <div className="history-file">
                        <span className="file-icon">📄</span>
                        <span className={`file-name ${light ? "light" : ""}`}>{record.fileName}</span>
                      </div>
                      <div className="history-details">
                        <span className={`records-count ${light ? "light" : ""}`}>
                          Cleaned records: {record.recordsCount}
                        </span>
                        <span className={`clean-date ${light ? "light" : ""}`}>
                          {formatDate(record.date)}
                        </span>
                      </div>
                    </div>
                    <div className={`status-badge ${record.status} ${light ? "light" : ""}`}>
                      {record.status === 'completed' ? 'Completed' : 'Failed'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 