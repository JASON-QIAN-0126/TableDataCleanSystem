import React, { useState, useEffect } from "react";
import "./PreviewModal.css";
import Papa from "papaparse";

interface PreviewModalProps {
  file: File;
  onClose: () => void;
  light?: boolean;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  file,
  onClose,
  light,
}) => {
  const [data, setData] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Handle XLSX files with a worker
    if (file.name.endsWith(".xlsx")) {
      setIsLoading(true);
      const worker = new Worker(
        new URL("../workers/xlsxWorker.ts", import.meta.url),
        { type: "module" },
      );

      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        worker.postMessage(arrayBuffer);
      };

      worker.onmessage = (e) => {
        const { status, data, error } = e.data;
        if (status === "success") {
          // The worker returns objects, convert them to arrays for the table
          const header = data.length > 0 ? Object.keys(data[0]) : [];
          const arrayOfArrays = data.map((row: any) =>
            header.map((key) => row[key]),
          );
          setData([header, ...arrayOfArrays]);
        } else {
          console.error("Error processing xlsx file in worker:", error);
          setData([["Error loading preview"]]);
        }
        setIsLoading(false);
        worker.terminate();
      };

      worker.onerror = (e) => {
        console.error("Worker error:", e.message);
        setData([["Error loading preview"]]);
        setIsLoading(false);
        worker.terminate();
      };

      reader.readAsArrayBuffer(file);

      return () => {
        worker.terminate();
      };
    }
    // Handle CSV/TSV files directly
    else if (file.name.endsWith(".csv") || file.name.endsWith(".tsv")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        Papa.parse(content as string, {
          complete: (result) => {
            setData(result.data as string[][]);
          },
        });
      };
      reader.readAsText(file);
    }
  }, [file]);

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div
        className={`preview-modal${light ? " light" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`preview-modal-header${light ? " light" : ""}`}>
          <h3 className={light ? "light" : ""}>{file.name}</h3>
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>
        <div className={`preview-modal-content${light ? " light" : ""}`}>
          {isLoading ? (
            <div className="loader-container">
              <div className={`loader ${light ? "light" : ""}`}>
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i}></div>
                ))}
              </div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  {data[0]?.map((header, index) => (
                    <th key={index} className={light ? "light" : ""}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className={light ? "light" : ""}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
