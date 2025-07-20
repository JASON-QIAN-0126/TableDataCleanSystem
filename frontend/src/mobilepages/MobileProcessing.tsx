import React, { useState, useEffect } from "react";
import "./MobileProcessing.css";
import { AnimatedCircularProgressBar } from "../components/magicui/animated-circular-progress-bar";
import { CheckCheck } from "lucide-react";

interface MobileProcessingProps {
  className?: string;
  light?: boolean;
  taskId?: string;
  onComplete?: () => void;
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

const MobileProcessing: React.FC<MobileProcessingProps> = ({
  className = "",
  light = false,
  taskId: _taskId,
  onComplete,
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

  const getStepDuration = (stepIndex: number) => {
    if (stepIndex < 4) return 1000;
    if (stepIndex < 6) return 2000;
    return 1000;
  };

  useEffect(() => {
    if (isCompleted) return;
    
    const currentDuration = getStepDuration(currentStepIndex);
    
    const stepTimeout = setTimeout(() => {
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
          
          setTimeout(() => {
            onComplete && onComplete();
          }, 1000);
          
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
    }, currentDuration);

    return () => clearTimeout(stepTimeout);
  }, [currentStepIndex, isCompleted, onComplete]);

  useEffect(() => {
    if (isCompleted) return;
    
    const activeStep = steps.find(step => step.status === 'active');
    if (activeStep) {
      const currentDuration = getStepDuration(currentStepIndex);
      const updateInterval = currentDuration / 100;
      
      const progressInterval = setInterval(() => {
        setCurrentProgress(prev => {
          const newProgress = prev + 1;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, updateInterval);

      return () => clearInterval(progressInterval);
    }
  }, [currentStepIndex, isCompleted]);

  const currentStep = steps.find(step => step.status === 'active');
  const displayStatus = isCompleted ? "Processing completed!" : (currentStep ? `${currentStep.label}..` : "Processing..");

  return (
    <div className={`mobile-processing-container ${className} ${light ? 'light' : ''}`}>
      <div className="mobile-progress-section">
        <div className="mobile-progress-wrapper">
          <AnimatedCircularProgressBar
            value={currentProgress}
            max={100}
            min={0}
            gaugePrimaryColor={light ? "#3C3F44" : "#4868f7"}
            gaugeSecondaryColor={light ? "rgba(107, 114, 128, 0.12)" : "rgba(59, 130, 246, 0.2)"}
            className="mobile-progress-bar hide-internal-text"
          />
          <div className={`mobile-progress-text ${light ? 'light' : ''}`} style={{ transition: 'all 30ms ease-out' }}>
            {Math.round(currentProgress)}
          </div>
        </div>
        <div className="mobile-current-status-wrapper">
          <div className={`mobile-current-status ${light ? 'light' : ''}`}>
            {displayStatus}
          </div>
        </div>
      </div>

      <div className="mobile-steps-section">
        <div className="mobile-steps-grid">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`mobile-step-item ${step.status} ${light ? 'light' : ''}`}
            >
              <div className="mobile-step-content">
                <span className="mobile-step-label">{step.label}</span>
                {step.status === 'finished' && (
                  <CheckCheck 
                    size={14} 
                    className={`mobile-check-icon ${light ? 'light' : ''}`}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileProcessing; 