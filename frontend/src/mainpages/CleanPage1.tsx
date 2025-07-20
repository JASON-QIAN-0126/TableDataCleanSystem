import React, { useState, useRef } from "react";
import "./CleanPage1.css";
import PreviewModal from "../components/PreviewModal";
import CleanPage2 from "./CleanPage2";
import { BorderBeam } from "../components/magicui/border-beam";
import { cn } from "../lib/utils";
import { InteractiveHoverButton } from "../components/magicui/interactive-hover-button";

interface FileWithId {
  id: string;
  file: File;
}

const CleanPage1: React.FC<{ light?: boolean }> = ({ light }) => {
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [progress, setProgress] = useState(0);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [extractWords, setExtractWords] = useState<string>("");
  const [isFinished, setIsFinished] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string>("");
  const [duplicateFiles, setDuplicateFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [taskId, setTaskId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFinishClick = async () => {
    if (files.length === 0) {
      setUploadError("Please select at least one file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    console.log(files);
    console.log(extractWords);

    // Demo mode: simulate processing and jump to CleanPage2
    setTimeout(() => {
      setTaskId("demo-task-id");
      setIsFinished(true);
      setIsUploading(false);
    }, 1000);

    // In real mode, you would send the request with authentication
    // const token = localStorage.getItem("token");
    // if (token) {
    //   const response = await fetch("http://localhost:8000/api/upload", {
    //     method: "POST",
    //     headers: {
    //       "Authorization": `Bearer ${token}`
    //     },
    //     body: formData,
    //   });
    // }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const fileArray = Array.from(selectedFiles as FileList);
      const newFiles: FileWithId[] = [];
      const duplicateFileNames: string[] = [];
      const duplicateFileObjects: File[] = [];

      fileArray.forEach((file: File) => {
        const isDuplicate = files.some((existingFile: FileWithId) => {
          if (existingFile.file.name !== file.name) {
            return false;
          }

          return (
            existingFile.file.size === file.size &&
            existingFile.file.lastModified === file.lastModified
          );
        });

        if (isDuplicate) {
          duplicateFileNames.push(file.name);
          duplicateFileObjects.push(file);
        } else {
          newFiles.push({
            id: `${file.name}-${file.lastModified}-${Math.random()}`,
            file: file,
          });
        }
      });

      // duplicate file warning
      if (duplicateFileNames.length > 0) {
        setDuplicateWarning(
          `Found ${duplicateFileNames.length} duplicate file${duplicateFileNames.length === 1 ? "" : "s"}.`,
        );
        setDuplicateFiles(duplicateFileObjects);
      } else {
        setDuplicateWarning("");
        setDuplicateFiles([]);
      }

      if (newFiles.length > 0) {
        setFiles((prevFiles: FileWithId[]) => [...prevFiles, ...newFiles]);

        // Simulate upload progress
        setProgress(0);
        const timer = setInterval(() => {
          setProgress((oldProgress: number) => {
            if (oldProgress >= 100) {
              clearInterval(timer);
              return 100;
            }
            const diff = Math.random() * 30;
            return Math.min(oldProgress + diff, 100);
          });
        }, 100);
      }

      event.target.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date: number) => {
    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  const handleDelete = (fileId: string) => {
    setFiles(files.filter((f: FileWithId) => f.id !== fileId));
  };

  const clearWarning = () => {
    setDuplicateWarning("");
    setDuplicateFiles([]);
  };

  const replaceDuplicateFiles = () => {
    if (duplicateFiles.length === 0) return;

    const updatedFiles = files.filter((existingFile: FileWithId) => {
      return !duplicateFiles.some(
        (duplicateFile: File) =>
          existingFile.file.name === duplicateFile.name &&
          existingFile.file.size === duplicateFile.size &&
          existingFile.file.lastModified === duplicateFile.lastModified,
      );
    });

    const newFileObjects: FileWithId[] = duplicateFiles.map((file: File) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file: file,
    }));

    setFiles([...updatedFiles, ...newFileObjects]);
    clearWarning();
  };

  // console.log(files);
  // console.log(extractWords);

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
      {isFinished ? (
        <CleanPage2 taskId={taskId} light={light} />
      ) : (
        <>
          {previewFile && (
            <PreviewModal
              file={previewFile}
              onClose={() => setPreviewFile(null)}
              light={light}
            />
          )}
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept=".csv, .tsv, .xlsx" // only accept csv, tsv, xlsx
          />
          <div
            className={`clean-card fade-in ${light ? "light" : ""}`}
            style={{ position: "relative", overflow: "visible" }}
          >
            <BorderBeam
              duration={10}
              size={400}
              borderWidth={light ? 2.5 : 2.2}
              className={cn(
                "from-transparent to-transparent",
                light ? "via-rose-300" : "via-indigo-400",
              )}
            />
            <BorderBeam
              duration={10}
              delay={3}
              size={400}
              borderWidth={light ? 2.5 : 2.2}
              className={cn(
                "from-transparent to-transparent",
                light ? "via-sky-300" : "via-fuchsia-400",
              )}
            />
            <div className="card-header">
              <button
                className={`select-file-btn ${light ? "light" : ""}`}
                onClick={handleFileSelectClick}
              >
                Select file
              </button>
              <span className={`supported-files ${light ? "light" : ""}`}>
                xlsv,csv,tsv file supported
              </span>
              <div className={`progress-bar-container ${light ? "light" : ""}`}>
                <div
                  className={`progress-bar ${light ? "light" : ""}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className={`progress-percent ${light ? "light" : ""}`}>
                {Math.round(progress)}%
              </span>
            </div>

            <div className="file-list-container">
              {duplicateWarning && (
                <div className="warning-message">
                  <div className="warning-content">
                    <span className="warning-icon">⚠️</span>
                    <span className="warning-text">{duplicateWarning}</span>
                    <div className="warning-actions">
                      <button
                        className="warning-replace"
                        onClick={replaceDuplicateFiles}
                      >
                        Replace
                      </button>
                      <button className="warning-close" onClick={clearWarning}>
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {uploadError && (
                <div className="error-message">
                  <div className="error-content">
                    <span className="error-icon">❌</span>
                    <span className="error-text">{uploadError}</span>
                    <button
                      className="error-close"
                      onClick={() => setUploadError("")}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
              <div className={`file-list-header ${light ? "light" : ""}`}>
                <span>Document Name</span>
                <span>Size</span>
                <span>Last modified</span>
                <span>Actions</span>
              </div>
              <ul className="file-list">
                {files.map(({ id, file }) => (
                  <li key={id} className={`file-item ${light ? "light" : ""}`}>
                    <div className="file-info">
                      <svg
                        className={`file-icon ${light ? "light" : ""}`}
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="currentColor"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                      </svg>
                      <span>{file.name}</span>
                    </div>
                    <span>{formatFileSize(file.size)}</span>
                    <span>{formatDate(file.lastModified)}</span>
                    <div className="file-actions">
                      <button
                        onClick={() => handleDelete(id)}
                        className={`action-btn delete-btn ${light ? "light" : ""}`}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setPreviewFile(file)}
                        className={`action-btn preview-btn ${light ? "light" : ""}`}
                      >
                        Preview
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`card-footer ${light ? "light" : ""}`}>
              <div className="extract-section">
                <input
                  type="text"
                  placeholder="Enter Keywords to extract..."
                  className={`keywords-input ${light ? "light" : ""}`}
                  value={extractWords}
                  onChange={(e) => setExtractWords(e.target.value)}
                />
                <InteractiveHoverButton
                  className={cn("finish-btn group", light ? "light" : "")}
                  onClick={handleFinishClick}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Finish"}
                </InteractiveHoverButton>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CleanPage1;
