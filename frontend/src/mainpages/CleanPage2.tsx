import React, { useState, useEffect } from "react";
import "./CleanPage2.css";
import CleanPage3 from "./CleanPage3";
import { BorderBeam } from "../components/magicui/border-beam";
import { cn } from "../lib/utils";
import Processing from "../components/Processing";

type RowData = {
  [key: string]: string | number;
};

interface CleanPage2Props {
  taskId: string;
  light?: boolean;
}

const CleanPage2: React.FC<CleanPage2Props> = ({ taskId, light }) => {
  const [data, setData] = useState<RowData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<RowData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPage3, setShowPage3] = useState(false);
  const [hideInvalidEmails, setHideInvalidEmails] = useState(false);

  useEffect(() => {
    if (!taskId) return;
    console.log("CleanPage2 received taskId:", taskId);

    const worker = new Worker(
      new URL("../workers/xlsxWorker.ts", import.meta.url),
      { type: "module" },
    );

    // Demo mode: 确保Processing能完全展示 (8步骤 * 3秒 = 24秒)
    const minDisplayTime = 24000; // 24秒
    const startTime = Date.now();

    const timer = setTimeout(async () => {
      try {
        console.log("Loading demo file...");
        const response = await fetch("/example_file/Cleaned_data.xlsx");
        if (response.ok) {
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          
          // 确保至少显示了足够的时间
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
          
          setTimeout(() => {
            worker.postMessage(arrayBuffer);
          }, remainingTime);
        } else {
          console.error("Failed to load demo file");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading demo file:", error);
        setIsLoading(false);
      }
    }, 2000); // 2秒后开始加载

    worker.onmessage = (e) => {
      const { status, data, error } = e.data;
      if (status === "success") {
        if (data.length > 0) {
          setHeaders(Object.keys(data[0]));
        }
        setData(data);
        setFilteredData(data);
      } else {
        console.error("Error processing xlsx file in worker:", error);
      }
      setIsLoading(false);
      worker.terminate();
    };

    worker.onerror = (e) => {
      console.error("Worker error:", e.message);
      setIsLoading(false);
      worker.terminate();
    };

    return () => {
      clearTimeout(timer);
      worker.terminate();
    };
  }, [taskId]);

  useEffect(() => {
    handleSearch();
  }, [hideInvalidEmails]);

  const handleSearch = () => {
    let filtered = data;
    
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(lowercasedSearchTerm),
        ),
      );
    }
    
    if (hideInvalidEmails) {
      filtered = filtered.filter((row) => {
        const emailValidation = row['filter_email_validation'];
        return emailValidation === 'Legal' || emailValidation === 0;
      });
    }
    
    setFilteredData(filtered);
  };

  const getHighlightedText = (text: string | number, highlight: string) => {
    const parts = String(text).split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i}>{part}</mark>
          ) : (
            part
          ),
        )}
      </span>
    );
  };

  const handleDownload = async () => {
    try {
      const response = await fetch("/example_file/Cleaned_data.xlsx");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Cleaned_data.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setShowPage3(true);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  if (showPage3) {
    return <CleanPage3 light={light} taskId={taskId} />;
  }

  return (
    <div
      className={`clean-page2-card ${light ? "light" : ""}`}
      style={{ position: "relative", overflow: "visible" }}
    >
      <BorderBeam
        duration={10}
        size={400}
        borderWidth={2.2}
        className={cn(
          "from-transparent to-transparent",
          light ? "via-gray-400" : "via-blue-500",
        )}
      />
      <BorderBeam
        duration={10}
        delay={3}
        size={400}
        borderWidth={2.2}
        className={cn(
          "from-transparent to-transparent",
          light ? "via-amber-400" : "via-violet-700",
        )}
      />

      {isLoading ? (
        <Processing light={light} taskId={taskId} />
      ) : (
        <>
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Type what you want to search here.."
              className={`search-input ${light ? "light" : ""}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className={`search-button ${light ? "light" : ""}`}
            >
              Search
            </button>
          </div>
          <div className={`table-container ${light ? "light" : ""}`}>
            <table>
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th key={header} className={light ? "light" : ""}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, rowIndex) => (
                  <tr key={rowIndex} className={light ? "light" : ""}>
                    {headers.map((header) => (
                      <td key={header}>
                        {searchTerm
                          ? getHighlightedText(row[header], searchTerm)
                          : row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="download-button-container">
            <div className={`checkbox-container ${light ? "light" : ""}`}>
              <label className={`checkbox-label ${light ? "light" : ""}`}>
                <input
                  type="checkbox"
                  checked={hideInvalidEmails}
                  onChange={(e) => setHideInvalidEmails(e.target.checked)}
                  className="checkbox-input"
                />
                <span className={`checkbox-text ${light ? "light" : ""}`}>
                  Hide invalid email
                </span>
              </label>
            </div>
            <button
              className={`download-button-1 ${light ? "light" : ""}`}
              onClick={handleDownload}
            >
              Download
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CleanPage2;
