import React, { useState, useEffect } from "react";
import "./Processing.css";
import { AnimatedCircularProgressBar } from "./magicui/animated-circular-progress-bar";
import { CheckCheck } from "lucide-react";

interface ProcessingProps {
  className?: string;
  light?: boolean;
  taskId?: string;
}

interface StepInfo {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'finished';
}

const processingSteps = [
  { id: "PREPROCESSING", label: "Preprocessing.." },
  { id: "EMAIL", label: "Email processing.." },
  { id: "NAME", label: "Name extraction.." },
  { id: "ORGANIZATION", label: "Organization extraction.." },
  { id: "ROLE", label: "Role extraction.." },
  { id: "EXTRA", label: "Extra data extraction.." },
  { id: "DEDUPLICATION", label: "Deduplication.." },
  { id: "RECORD", label: "Record processing" },
];

const Processing: React.FC<ProcessingProps> = ({
  className = "",
  light = false,
  taskId: _taskId,
}) => {
  const [steps, setSteps] = useState<StepInfo[]>(
    processingSteps.map((step, index) => ({
      ...step,
      status: index === 0 ? 'active' as const : 'pending' as const,
    }))
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isCompleted) return;
    
    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => {
        const nextIndex = prev + 1;
        
        if (nextIndex >= processingSteps.length) {
          setSteps(current => 
            current.map(step => ({
              ...step,
              status: 'finished'
            }))
          );
          setCurrentProgress(100);
          setIsCompleted(true);
          return prev;
        }
        

        setSteps(current => 
          current.map((step, index) => {
            if (index < nextIndex) {
              return { ...step, status: 'finished' };
            } else if (index === nextIndex) {
              return { ...step, status: 'active' };
            } else {
              return { ...step, status: 'pending' };
            }
          })
        );

        setCurrentProgress(0);
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(stepInterval);
  }, [isCompleted]);

  useEffect(() => {
    if (isCompleted) return;
    
    const activeStep = steps.find(step => step.status === 'active');
    if (activeStep) {
      const progressInterval = setInterval(() => {
        setCurrentProgress(prev => {
          const newProgress = prev + 2;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 60);

      return () => clearInterval(progressInterval);
    }
  }, [currentStepIndex, isCompleted]);

  const currentStep = steps.find(step => step.status === 'active');
  const displayStatus = isCompleted ? "Processing completed!" : (currentStep ? `${currentStep.label}..` : "Processing..");

  return (
    <div className={`processing-container ${className}`}>
      <div className="left-section">
        <div className="main-progress">
          <div className="progress-wrapper">
            <AnimatedCircularProgressBar
              value={currentProgress}
              max={100}
              min={0}
              gaugePrimaryColor={light ? "#3C3F44" : "#4868f7"}
              gaugeSecondaryColor={light ? "rgba(107, 114, 128, 0.12)" : "rgba(59, 130, 246, 0.2)"}
              className="main-progress-bar hide-internal-text"
            />
            <div className={`progress-text ${light ? 'light' : ''}`}>
              {Math.round(currentProgress)}
            </div>
          </div>
        </div>
        <div className="current-status-wrapper">
          <div className={`current-status ${light ? 'light' : ''}`}>
            {displayStatus}
          </div>
        </div>
      </div>

      <div className="right-section">
        <div className="steps-list">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`step-text ${step.status} ${light ? 'light' : ''}`}
            >
              <span className="step-label">{step.label}</span>
              {step.status === 'finished' && (
                <CheckCheck 
                  size={16} 
                  className={`check-icon ${light ? 'light' : ''}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Processing;
