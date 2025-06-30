import React, { useState, useEffect } from 'react';
import './CleanPage2.css';
import CleanPage3 from './CleanPage3';

type RowData = {
    [key: string]: string | number;
};

interface CleanPage2Props {
    taskId: string;
}

const CleanPage2: React.FC<CleanPage2Props> = ({ taskId }) => {
    const [data, setData] = useState<RowData[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState<RowData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showPage3, setShowPage3] = useState(false);

    useEffect(() => {
        if (!taskId) return;
        console.log("CleanPage2 received taskId:", taskId);
        
        const worker = new Worker(new URL('../workers/xlsxWorker.ts', import.meta.url), { type: 'module' });

        const checkProcessingStatus = async () => {
            try {
                console.log("Checking status for taskId:", taskId);
                const response = await fetch(`http://localhost:8000/results/${taskId}`);
                console.log("Response status:", response.status);
                
                if (response.status === 202) {
                    // Still processing
                    console.log("Still processing...");
                    setTimeout(checkProcessingStatus, 2000);
                    return;
                } else if (response.status === 200) {
                    console.log("Processing complete, getting file...");
                    const blob = await response.blob();
                    const arrayBuffer = await blob.arrayBuffer();
                    worker.postMessage(arrayBuffer);
                } else {
                    console.error("Unexpected response status:", response.status);
                    const errorText = await response.text();
                    console.error("Error response:", errorText);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error checking processing status:", error);
                setIsLoading(false);
            }
        };

        worker.onmessage = (e) => {
            const { status, data, error } = e.data;
            if (status === 'success') {
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
            console.error('Worker error:', e.message);
            setIsLoading(false);
            worker.terminate();
        };

        // Start checking processing status
        checkProcessingStatus();

        return () => {
            worker.terminate();
        };
    }, [taskId]);

    const handleSearch = () => {
        if (!searchTerm) {
            setFilteredData(data);
            return;
        }

        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = data.filter(row =>
            Object.values(row).some(value =>
                String(value).toLowerCase().includes(lowercasedSearchTerm)
            )
        );
        setFilteredData(filtered);
    };

    const getHighlightedText = (text: string | number, highlight: string) => {
        const parts = String(text).split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <mark key={i}>{part}</mark>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(`http://localhost:8000/results/${taskId}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `processed_data_${taskId}.xlsx`);
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
        return <CleanPage3 />;
    }

    return (
        <div className="clean-page2-card">
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Type what you want to search here.."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch} className="search-button">Search</button>
            </div>

            {isLoading ? (
                <div className="loading-indicator"></div>
            ) : (
                <>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    {headers.map(header => (
                                        <th key={header}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {headers.map(header => (
                                            <td key={header}>
                                                {searchTerm ? getHighlightedText(row[header], searchTerm) : row[header]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="download-button-container">
                        <button className="download-button" onClick={handleDownload}>Download</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CleanPage2;
