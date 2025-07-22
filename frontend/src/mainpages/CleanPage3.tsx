import React, { useState, useEffect } from "react";
import "./CleanPage3.css";
import { BorderBeam } from "../components/magicui/border-beam";
import { cn } from "../lib/utils";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// chart js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface CleanPage3Props {
  light?: boolean;
  taskId?: string;
}

interface ReportData {
  summary: {
    total_records: number;
    valid_email_count: number;
    invalid_email_count: number;
    valid_email_rate: string;
    cleaning_effectiveness: string;
    cleaned_records: number;
    dedup_removed: number;
  };
  charts: {
    email_domains?: {
      type: string;
      title: string;
      data: {
        labels: string[];
        values: number[];
      };
      description: string;
    };
    data_completeness?: {
      type: string;
      title: string;
      data: Array<{
        field: string;
        completeness: number;
        count: number;
        missing: number;
      }>;
      description: string;
    };
    email_validation?: {
      type: string;
      title: string;
      data: {
        labels: string[];
        values: number[];
      };
      description: string;
    };
    quality_metrics?: {
      overall_score: number;
      completeness_score: number;
      validity_score: number;
      total_processed: number;
      description: string;
    };
  };
  pdf_download_url: string;
}

const CleanPage3: React.FC<CleanPage3Props> = ({ light, taskId }) => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const getThemeColors = () => {
    if (light) {
      return {
        primary: '#0c0c0c',
        secondary: '#4b4b4b',
        accent: '#6c757d',
        background: 'rgba(255, 255, 255, 0.8)',
        text: '#333',
        success: '#4b4b4b',
        error: '#7a8693',
        warning: '#ffc107',
        info: '#17a2b8',
        chartColors: ['#0c0c0c', '#4b4b4b', '#6c757d', '#495057', '#343a40', '#212529', '#6f42c1', '#e83e8c'],
      };
    } else {
      return {
        primary: '#4868f7',
        secondary: '#3d3bff',
        accent: '#692cf3',
        background: 'rgba(255, 255, 255, 0.04)',
        text: '#e0e0e0',
        success: '#3d3bff',
        error: '#692cf3',
        warning: '#ffc107',
        info: '#17a2b8',
        chartColors: ['#4868f7', '#3d3bff', '#692cf3', '#7C3AED', '#3B82F6', '#8B5CF6', '#A855F7', '#C084FC'],
      };
    }
  };

  const themeColors = getThemeColors();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Demo report
        const demoData: ReportData = {
          summary: {
            total_records: 1500,
            valid_email_count: 1342,
            invalid_email_count: 158,
            valid_email_rate: "89.5%",
            cleaning_effectiveness: "94.2%",
            cleaned_records: 1413,
            dedup_removed: 87
          },
          charts: {
            data_completeness: {
              type: "bar",
              title: "Data Completeness by Field",
              data: [
                { field: "Email", completeness: 98.5, count: 1478, missing: 22 },
                { field: "Name", completeness: 92.3, count: 1385, missing: 115 },
                { field: "Organization", completeness: 87.6, count: 1314, missing: 186 },
                { field: "Role", completeness: 73.2, count: 1098, missing: 402 },
                { field: "Phone", completeness: 45.8, count: 687, missing: 813 }
              ],
              description: "Completeness percentage for each data field"
            },
            email_validation: {
              type: "pie",
              title: "Email Validation Results",
              data: {
                labels: ["Valid Emails", "Invalid Emails"],
                values: [1342, 158]
              },
              description: "Distribution of valid vs invalid email addresses"
            }
          },
          pdf_download_url: "/api/report/demo.pdf"
        };
        
        setReportData(demoData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error generating demo report:", err);
        setError("Failed to generate report");
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [taskId]);

  const handleDownloadPDF = async () => {
    try {
      const demoContent = `Data Cleaning Report
      
Total Records: ${reportData?.summary.total_records}
Valid Emails: ${reportData?.summary.valid_email_count}
Cleaning Effectiveness: ${reportData?.summary.cleaning_effectiveness}
      
This is a demo report generated for testing purposes.`;
      
      const blob = new Blob([demoContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `data_cleaning_report_${taskId || 'demo'}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      setError("Failed to download report");
    }
  };

  const handleRetry = () => {
    setError("");
    setIsLoading(true);
    setReportData(null);
    setTimeout(() => {
      setIsLoading(false);
      const demoData: ReportData = {
        summary: {
          total_records: 1500,
          valid_email_count: 1342,
          invalid_email_count: 158,
          valid_email_rate: "89.5%",
          cleaning_effectiveness: "94.2%",
          cleaned_records: 1413,
          dedup_removed: 87
        },
        charts: {
          data_completeness: {
            type: "bar",
            title: "Data Completeness by Field",
            data: [
              { field: "Email", completeness: 98.5, count: 1478, missing: 22 },
              { field: "Name", completeness: 92.3, count: 1385, missing: 115 },
              { field: "Organization", completeness: 87.6, count: 1314, missing: 186 },
              { field: "Role", completeness: 73.2, count: 1098, missing: 402 },
              { field: "Phone", completeness: 45.8, count: 687, missing: 813 }
            ],
            description: "Completeness percentage for each data field"
          },
          email_validation: {
            type: "pie",
            title: "Email Validation Results",
            data: {
              labels: ["Valid Emails", "Invalid Emails"],
              values: [1342, 158]
            },
            description: "Distribution of valid vs invalid email addresses"
          }
        },
        pdf_download_url: "/api/report/demo.pdf"
      };
      setReportData(demoData);
    }, 1000);
  };

  const getCompletenessChartData = () => {
    if (!reportData?.charts?.data_completeness) return null;

    const data = reportData.charts.data_completeness.data;
    
    return {
      labels: data.map(item => item.field),
      datasets: [
        {
          label: 'Completeness %',
          data: data.map(item => item.completeness),
          backgroundColor: themeColors.chartColors.slice(0, data.length),
          borderColor: themeColors.chartColors.slice(0, data.length),
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };
  };

  const getEmailValidationChartData = () => {
    if (!reportData?.charts?.email_validation) return null;

    const chartData = reportData.charts.email_validation.data;
    
    return {
      labels: chartData.labels,
      datasets: [
        {
          data: chartData.values,
          backgroundColor: [themeColors.success, themeColors.error],
          borderColor: [themeColors.success, themeColors.error],
          borderWidth: 2,
        },
      ],
    };
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Data Completeness by Field',
        color: themeColors.text,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        backgroundColor: light ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.8)',
        titleColor: themeColors.text,
        bodyColor: themeColors.text,
        borderColor: themeColors.primary,
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: themeColors.text,
          callback: function(value: any) {
            return value + '%';
          },
        },
        grid: {
          color: light ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: themeColors.text,
        },
        grid: {
          color: light ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: themeColors.text,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: 'Email Validation Results',
        color: themeColors.text,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        backgroundColor: light ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.8)',
        titleColor: themeColors.text,
        bodyColor: themeColors.text,
        borderColor: themeColors.primary,
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div
      className={`clean-page3-container ${light ? "light" : ""}`}
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
      <h2 className={`clean-page3-title ${light ? "light" : ""}`}>
        Data Cleaning Report
      </h2>
      
      {isLoading ? (
        <div className={`loader-container-p ${light ? "light" : ""}`}>
          <div className={`loader-p ${light ? "light" : ""}`}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : error ? (
        <div className={`error-container ${light ? "light" : ""}`}>
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button 
            className={`retry-btn ${light ? "light" : ""}`}
            onClick={handleRetry}
          >
            Retry
          </button>
        </div>
      ) : reportData ? (
        <div className="report-content">
          <div className={`summary-section ${light ? "light" : ""}`}>
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-number">{reportData.summary.total_records}</div>
                <div className="summary-label">Total Records</div>
              </div>
              <div className="summary-card">
                <div className="summary-number">{reportData.summary.valid_email_count}</div>
                <div className="summary-label">Valid Emails</div>
              </div>
              <div className="summary-card">
                <div className="summary-number">{reportData.summary.cleaning_effectiveness}</div>
                <div className="summary-label">Cleaning Effectiveness</div>
              </div>
              <div className="summary-card">
                <div className="summary-number">{reportData.summary.dedup_removed}</div>
                <div className="summary-label">Duplicates Removed</div>
              </div>
            </div>
          </div>

          <div className={`charts-section ${light ? "light" : ""}`}>
            <div className="charts-grid">
              {getCompletenessChartData() && (
                <div className="chart-container">
                  <div className="chart-wrapper">
                    <Bar data={getCompletenessChartData()!} options={barChartOptions} />
                  </div>
                  <p className="chart-description">
                    {reportData.charts.data_completeness?.description}
                  </p>
                </div>
              )}

              {getEmailValidationChartData() && (
                <div className="chart-container">
                  <div className="chart-wrapper">
                    <Pie data={getEmailValidationChartData()!} options={pieChartOptions} />
                  </div>
                  <p className="chart-description">
                    {reportData.charts.email_validation?.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="download-section">
            <div className={`download-buttonpdf ${light ? "light" : ""}`} onClick={handleDownloadPDF}>
              <div className="download-buttonpdf-wrapper">
                <div className="download-buttonpdf-text">Download PDF Report</div>
                  <span className="download-buttonpdf-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="10em" height="2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path></svg>
                  </span>
                </div>
              </div>
          </div>
        </div>
      ) : (
        <div className={`no-report ${light ? "light" : ""}`}>
          <p>No report data available</p>
        </div>
      )}
    </div>
  );
};

export default CleanPage3;
