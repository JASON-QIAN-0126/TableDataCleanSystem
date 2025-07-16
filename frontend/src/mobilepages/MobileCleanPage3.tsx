import React from "react";
import "./MobileCleanPage3.css";

const MobileCleanPage3: React.FC<{ light?: boolean }> = ({ light }) => {
  const reportData = {
    totalRecords: 1547,
    cleanedRecords: 1523,
    duplicatesRemoved: 18,
    invalidDataFixed: 6,
    processingTime: "2.3 seconds",
    accuracy: "98.4%"
  };

  return (
    <div 
      className={`mobile-clean3-container ${light ? "light" : ""}`}
      style={{
        backgroundImage: light
          ? "url('/background_l.png')"
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
      
      <div className={`mobile-clean3-card ${light ? "light" : ""}`} style={{ position: "relative", zIndex: 3 }}>
        <div className="success-icon">
          <div className={`checkmark ${light ? "light" : ""}`}>✓</div>
        </div>
        
        <h1 className={`mobile-clean3-title ${light ? "light" : ""}`}>
          Cleaning Complete!
        </h1>
        
        <div className="mobile-clean3-section">
          <h3 className={`section-title ${light ? "light" : ""}`}>System Report</h3>
          
          <div className="report-grid">
            <div className={`report-item ${light ? "light" : ""}`}>
              <span className={`report-label ${light ? "light" : ""}`}>Total Records</span>
              <span className={`report-value ${light ? "light" : ""}`}>{reportData.totalRecords}</span>
            </div>
            
            <div className={`report-item ${light ? "light" : ""}`}>
              <span className={`report-label ${light ? "light" : ""}`}>Cleaned Records</span>
              <span className={`report-value success ${light ? "light" : ""}`}>{reportData.cleanedRecords}</span>
            </div>
            
            <div className={`report-item ${light ? "light" : ""}`}>
              <span className={`report-label ${light ? "light" : ""}`}>Duplicates Removed</span>
              <span className={`report-value warning ${light ? "light" : ""}`}>{reportData.duplicatesRemoved}</span>
            </div>
            
            <div className={`report-item ${light ? "light" : ""}`}>
              <span className={`report-label ${light ? "light" : ""}`}>Invalid Data Fixed</span>
              <span className={`report-value warning ${light ? "light" : ""}`}>{reportData.invalidDataFixed}</span>
            </div>
            
            <div className={`report-item ${light ? "light" : ""}`}>
              <span className={`report-label ${light ? "light" : ""}`}>Processing Time</span>
              <span className={`report-value ${light ? "light" : ""}`}>{reportData.processingTime}</span>
            </div>
            
            <div className={`report-item ${light ? "light" : ""}`}>
              <span className={`report-label ${light ? "light" : ""}`}>Accuracy</span>
              <span className={`report-value success ${light ? "light" : ""}`}>{reportData.accuracy}</span>
            </div>
          </div>
        </div>

        <div className="mobile-clean3-section">
          <h3 className={`section-title ${light ? "light" : ""}`}>Summary</h3>
          <div className={`summary-text ${light ? "light" : ""}`}>
            Your data has been successfully cleaned and processed. 
            {reportData.duplicatesRemoved > 0 && ` ${reportData.duplicatesRemoved} duplicate records were removed.`}
            {reportData.invalidDataFixed > 0 && ` ${reportData.invalidDataFixed} invalid entries were corrected.`}
            The cleaning process completed with {reportData.accuracy} accuracy.
          </div>
        </div>

      </div>
    </div>
  );
};

export default MobileCleanPage3; 