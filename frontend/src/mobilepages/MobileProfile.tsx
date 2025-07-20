import React, { useState, useEffect } from "react";
import "./MobileProfile.css";
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

const MobileProfile: React.FC<{ light?: boolean }> = ({ light }) => {
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
      setError(err instanceof Error ? err.message : "Username update failed");
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
        className="mobile-form-page-container"
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
          <div className={`mobile-form-card ${light ? "light" : ""}`}>
            <h2>请先登录</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mobile-form-page-container"
      style={
        light
          ? {
              backgroundImage: "url('/background_l2.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "100vh",
            }
          : {
            backgroundImage: "url('/Background2.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
          }
      }
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
      
      <div className={`mobile-profile-card ${light ? "light" : ""}`}>          
        <div className="mobile-profile-content">
            <div className="mobile-user-info-section">
              <div className="mobile-avatar-container">
                <div className={`mobile-avatar ${light ? "light" : ""}`}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="mobile-user-details">
                {isEditing ? (
                  <form onSubmit={handleUpdateUsername} className="mobile-edit-form">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`mobile-username-input ${light ? "light" : ""}`}
                      placeholder="Enter new username"
                      disabled={isLoading}
                      maxLength={20}
                    />
                    <div className="mobile-edit-buttons">
                      <button
                        type="submit"
                        disabled={isLoading || !username.trim()}
                        className={`mobile-save-btn ${light ? "light" : ""}`}
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
                        className={`mobile-cancel-btn ${light ? "light" : ""}`}
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mobile-user-info">
                    <h2 className={`mobile-username ${light ? "light" : ""}`}>
                      {user.username}
                    </h2>
                    <p className={`mobile-email ${light ? "light" : ""}`}>
                      {user.email}
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`mobile-edit-btn ${light ? "light" : ""}`}
                    >
                      Edit username
                    </button>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mobile-error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="mobile-success-message">
                {success}
              </div>
            )}

            <div className="mobile-section">
              <h3 className={`mobile-section-title ${light ? "light" : ""}`}>
                Clean history
              </h3>
              <div className="mobile-history-container">
                {cleanHistory.length === 0 ? (
                  <div className={`mobile-no-history ${light ? "light" : ""}`}>
                    No clean history
                  </div>
                ) : (
                  <div className="mobile-history-list">
                    {cleanHistory.slice(0, 5).map((record) => (
                      <div
                        key={record.id}
                        className={`mobile-history-item ${light ? "light" : ""}`}
                      >
                        <div className="mobile-history-main">
                          <div className="mobile-file-info">
                            <span className={`mobile-file-name ${light ? "light" : ""}`}>
                              {record.fileName}
                            </span>
                            <span className={`mobile-record-count ${light ? "light" : ""}`}>
                              {record.recordsCount} records
                            </span>
                          </div>
                          <div className={`mobile-history-date ${light ? "light" : ""}`}>
                            {formatDate(record.date)}
                          </div>
                        </div>
                        <div className={`mobile-status ${record.status} ${light ? "light" : ""}`}>
                          {record.status === 'completed' ? '✓ Completed' : '✗ Failed'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default MobileProfile; 