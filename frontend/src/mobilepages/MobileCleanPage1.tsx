import React, { useState, useRef } from "react";
import "./MobileCleanPage1.css";
import MobileCleanPage2 from "./MobileCleanPage2";

interface FileWithId extends File {
  id: string;
}

const MobileCleanPage1: React.FC<{ light?: boolean }> = ({ light }) => {
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [extractWords, setExtractWords] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [taskId, setTaskId] = useState<string>("");
  const [isFinished, setIsFinished] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const filesWithId = selectedFiles.map((file) => ({
      ...file,
      id: Math.random().toString(36).substr(2, 9),
    }));
    setFiles((prev) => [...prev, ...filesWithId]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleFinishClick = async () => {
    if (files.length === 0) {
      setUploadError("Please select at least one file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    // Demo mode: simulate processing and jump to CleanPage2
    setTimeout(() => {
      setTaskId("demo-task-id");
      setIsFinished(true);
      setIsUploading(false);
    }, 2000);
  };

  if (isFinished && taskId) {
    return <MobileCleanPage2 taskId={taskId} light={light} />;
  }

  return (
    <div 
      className={`mobile-clean-container ${light ? "light" : ""}`}
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
      <div className={`mobile-clean-card ${light ? "light" : ""}`} style={{ position: "relative", zIndex: 3 }}>
        <h1 className={`mobile-clean-title ${light ? "light" : ""}`}>
          Data Cleaning
        </h1>
        
        <div className="mobile-clean-section">
          <h3 className={`section-title ${light ? "light" : ""}`}>Upload Files</h3>
          <div className={`file-upload-area ${light ? "light" : ""}`}>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".csv,.xlsx,.xls,.tsv"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <button
              className={`upload-button ${light ? "light" : ""}`}
              onClick={handleFileSelectClick}
            >
              Select Files
            </button>
            <p className={`upload-hint ${light ? "light" : ""}`}>
              CSV, Excel, TSV files supported
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mobile-clean-section">
            <h3 className={`section-title ${light ? "light" : ""}`}>Selected Files</h3>
            <div className="file-list">
              {files.map((file) => (
                <div key={file.id} className={`file-item ${light ? "light" : ""}`}>
                  <span className="file-name">{file.name}</span>
                  <button
                    className="remove-button"
                    onClick={() => removeFile(file.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mobile-clean-section">
          <h3 className={`section-title ${light ? "light" : ""}`}>Extract Keywords</h3>
          <textarea
            className={`extract-textarea ${light ? "light" : ""}`}
            value={extractWords}
            onChange={(e) => setExtractWords(e.target.value)}
            placeholder="Enter keywords to extract (optional)"
            rows={3}
          />
        </div>

        {uploadError && (
          <div className="error-message">
            {uploadError}
          </div>
        )}

        <button
          className={`finish-button ${light ? "light" : ""} ${isUploading ? "loading" : ""}`}
          onClick={handleFinishClick}
          disabled={isUploading || files.length === 0}
        >
          {isUploading ? "Processing..." : "Start Cleaning"}
        </button>
      </div>
    </div>
  );
};

export default MobileCleanPage1;