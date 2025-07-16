import React, { useState, useEffect } from "react";
import "./MobileCleanPage2.css";
import MobileCleanPage3 from "./MobileCleanPage3";

type RowData = {
  [key: string]: string | number;
};

interface MobileCleanPage2Props {
  taskId: string;
  light?: boolean;
}

const MobileCleanPage2: React.FC<MobileCleanPage2Props> = ({ taskId, light }) => {
  const [data, setData] = useState<RowData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<RowData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPage3, setShowPage3] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!taskId) return;
    console.log("MobileCleanPage2 received taskId:", taskId);

    // Demo mode: load example file after 3 seconds
    const timer = setTimeout(async () => {
      try {
        console.log("Loading demo file...");
        const response = await fetch("/example_file/Cleaned_data.xlsx");
        if (response.ok) {
          // Simulate data processing
          const mockData = [
            { "Name": "John Doe", "Email": "john@example.com", "Company": "Tech Corp", "Role": "Developer" },
            { "Name": "Jane Smith", "Email": "jane@example.com", "Company": "Data Inc", "Role": "Analyst" },
            { "Name": "Bob Johnson", "Email": "bob@example.com", "Company": "AI Labs", "Role": "Researcher" },
            { "Name": "Alice Brown", "Email": "alice@example.com", "Company": "Cloud Systems", "Role": "Engineer" },
            { "Name": "Charlie Wilson", "Email": "charlie@example.com", "Company": "Web Solutions", "Role": "Designer" },
          ];
          
          if (mockData.length > 0) {
            setHeaders(Object.keys(mockData[0]));
          }
          setData(mockData);
          setFilteredData(mockData);
        } else {
          console.error("Failed to load demo file");
        }
      } catch (error) {
        console.error("Error loading demo file:", error);
      } finally {
        setIsLoading(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [taskId]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
      setCurrentPage(1);
      return;
    }

    const filtered = data.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data]);

  const handleNextStep = () => {
    setShowPage3(true);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (showPage3) {
    return <MobileCleanPage3 light={light} />;
  }

  return (
    <div 
      className={`mobile-clean2-container ${light ? "light" : ""}`}
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
      
      <div className={`mobile-clean2-card ${light ? "light" : ""}`} style={{ position: "relative", zIndex: 3 }}>
        <h1 className={`mobile-clean2-title ${light ? "light" : ""}`}>
          Cleaned Data Preview
        </h1>
        
        {isLoading ? (
          <div className="loading-section">
            <div className={`loading-spinner ${light ? "light" : ""}`}></div>
            <p className={`loading-text ${light ? "light" : ""}`}>
              Processing your data...
            </p>
          </div>
        ) : (
          <>
            <div className="mobile-clean2-section">
              <h3 className={`section-title ${light ? "light" : ""}`}>Search Data</h3>
              <input
                type="text"
                className={`search-input ${light ? "light" : ""}`}
                placeholder="Search in data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="mobile-clean2-section">
              <h3 className={`section-title ${light ? "light" : ""}`}>
                Results ({filteredData.length} items)
              </h3>
              
              {currentData.length > 0 ? (
                <div className="data-table-container">
                  <div className={`data-table ${light ? "light" : ""}`}>
                    {currentData.map((row, index) => (
                      <div key={index} className={`data-row ${light ? "light" : ""}`}>
                        {headers.map((header) => (
                          <div key={header} className="data-field">
                            <span className={`field-label ${light ? "light" : ""}`}>
                              {header}:
                            </span>
                            <span className={`field-value ${light ? "light" : ""}`}>
                              {row[header]}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        className={`page-button ${light ? "light" : ""}`}
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      <span className={`page-info ${light ? "light" : ""}`}>
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        className={`page-button ${light ? "light" : ""}`}
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`no-data ${light ? "light" : ""}`}>
                  No data matches your search.
                </div>
              )}
            </div>

            <button
              className={`next-button ${light ? "light" : ""}`}
              onClick={handleNextStep}
            >
              Generate Report
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileCleanPage2; 