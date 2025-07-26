import React, { useState, useRef } from "react";
import "./CleanPage1.css";
import PreviewModal from "../components/PreviewModal";
import CleanPage2 from "./CleanPage2";
import { BorderBeam } from "../components/magicui/border-beam";
import { cn } from "../lib/utils";
import { InteractiveHoverButton } from "../components/magicui/interactive-hover-button";
import backgroundImage from "../assets/background_l2.png";
import { CustomTooltip } from "../components/Tooltip";
import { KeywordDropdown } from "../components/KeywordDropdown";

interface FileWithId {
  id: string;
  file: File;
}

interface KeywordItem {
  id: string;
  keyword: string;
  description: string;
}

const CleanPage1: React.FC<{ light?: boolean }> = ({ light }) => {
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [progress, setProgress] = useState(0);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [keywordInput, setKeywordInput] = useState<string>("");
  const [descriptionInput, setDescriptionInput] = useState<string>("");
  const [keywordItems, setKeywordItems] = useState<KeywordItem[]>([]);
  const [enhanceClean, setEnhanceClean] = useState<boolean>(false);
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

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      const newKeywordItem: KeywordItem = {
        id: `keyword-${Date.now()}-${Math.random()}`,
        keyword: keywordInput.trim(),
        description: descriptionInput.trim(),
      };
      setKeywordItems((prev) => [...prev, newKeywordItem]);
      setKeywordInput("");
      setDescriptionInput("");
    }
  };

  const handleKeywordSelect = (keyword: string, description: string) => {
    setKeywordInput(keyword);
    setDescriptionInput(description);
  };

  const handleKeywordInputChange = (value: string) => {
    setKeywordInput(value);
  };

  const handleDeleteKeyword = (id: string) => {
    setKeywordItems((prev) => prev.filter((item) => item.id !== id));
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

  const handleFinishClick = async () => {
    if (files.length === 0) {
      setUploadError("Please select at least one file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    console.log(files);
    console.log(keywordItems);
    console.log("Enhance Clean:", enhanceClean);

    const formData = new FormData();

    files.forEach(({ file }: FileWithId) => {
      formData.append("files", file);
    });

    // handle keywords data
    if (keywordItems.length > 0) {
      const extraArray = keywordItems.map((item) => ({
        name: item.keyword,
        description: item.description || null,
      }));
      formData.append("extra", JSON.stringify(extraArray));
    } else {
      formData.append("extra", "[]");
    }

    formData.append("enhancement", enhanceClean.toString());

    // backend may not ready need to retry
    const tryUpload = async (retries = 4): Promise<void> => {
      try {
        const simulateFetch = (): Promise<any> => {
          return new Promise((resolve) => {
            setTimeout(() => {
              const success = true;
              if (success) {
                resolve({ ok: true, json: async () => ({ task_id: "demo-task-id" }) });
              } else {
                resolve({ ok: false, status: 500, statusText: "Internal Server Error" });
              }
            }, 300);
          });
        };
    
        const response = await simulateFetch();
    
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }
    
        const result = await response.json();
        setTaskId(result.task_id);
        setIsFinished(true);
      } catch (err) {
        if (retries > 0) {
          await new Promise(res => setTimeout(res, 500));
          await tryUpload(retries - 1);
        } else {
          console.error("Upload failed", err);
          setUploadError(err instanceof Error ? err.message : "Upload failed");
        }
      }
    };

    await tryUpload();

    setIsUploading(false);
  };

  // console.log(files);
  // console.log(keywordItems);

  return (
    <div
      className="form-page-container"
      style={
        light
          ? {
              backgroundImage: `url(${backgroundImage})`,
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

            {/* keywords input area */}
            <div className={`keywords-section ${light ? "light" : ""}`}>
              {/* keywords table */}
              {keywordItems.length > 0 && (
                <div
                  className={`keywords-table-container ${light ? "light" : ""}`}
                >
                  <div
                    className={`keywords-table-header ${light ? "light" : ""}`}
                  >
                    <span>Keyword</span>
                    <span>Description (optional)</span>
                    <span>Action</span>
                  </div>
                  <div
                    className={`keywords-table-body ${light ? "light" : ""}`}
                  >
                    {keywordItems.map((item) => (
                      <div
                        key={item.id}
                        className={`keyword-row ${light ? "light" : ""}`}
                      >
                        <span className="keyword-cell">{item.keyword}</span>
                        <span className="description-cell">
                          {item.description || "-"}
                        </span>
                        <div className="action-cell">
                          <button
                            className={`action-btn-1 delete-btn-1 ${light ? "light" : ""}`}
                            onClick={() => handleDeleteKeyword(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="keywords-input-area">
                <div className="input-row">
                  <CustomTooltip
                    tooltipText="You don't need to enter 'name', 'email', 'organization' or 'role' — they are extracted by default."
                    light={light}
                  >
                    <KeywordDropdown
                      value={keywordInput}
                      onSelect={handleKeywordSelect}
                      onChange={handleKeywordInputChange}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddKeyword()
                      }
                      placeholder="Add custom keywords"
                      className=""
                      light={light}
                    />
                  </CustomTooltip>
                  <input
                    type="text"
                    placeholder="Description(optional)"
                    className={`description-input ${light ? "light" : ""}`}
                    value={descriptionInput}
                    onChange={(e) => setDescriptionInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddKeyword()}
                  />
                  <button
                    className={`add-keyword-btn ${light ? "light" : ""}`}
                    onClick={handleAddKeyword}
                    disabled={!keywordInput.trim()}
                  >
                    ✓
                  </button>
                </div>
              </div>
            </div>

            {/* Enhance clean section */}
            <div className={`card-footer ${light ? "light" : ""}`}>
              <div className="footer-controls">
                <div className="enhance-section">
                  <div className="checkbox-container-enhance">
                    <label
                      className={`checkbox-label-enhance ${light ? "light" : ""}`}
                    >
                      <CustomTooltip
                        tooltipText="If checked, cleaning will take longer time."
                        light={light}
                      >
                        <input
                          type="checkbox"
                          checked={enhanceClean}
                          onChange={(e) => setEnhanceClean(e.target.checked)}
                          className={`checkbox-input-enhance ${light ? "light" : ""}`}
                        />
                      </CustomTooltip>
                      <CustomTooltip
                        tooltipText="If checked, cleaning will take longer time."
                        light={light}
                      >
                        <span
                          className={`checkbox-text-enhance ${light ? "light" : ""}`}
                        >
                          Enable enhanced cleaning model
                        </span>
                      </CustomTooltip>
                    </label>
                  </div>
                </div>
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
