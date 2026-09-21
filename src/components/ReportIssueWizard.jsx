import React, { useState } from 'react';
import Step1UploadEvidence from './steps/Step1UploadEvidence';
import Step2Location from './steps/Step2Location';
import Step3AIDetection from './steps/Step3AIDetection';
import Step4Description from './steps/Step4Description';
import Step5Severity from './steps/Step5Severity';
import Step3Category from './steps/Step3Category';
import Step7Submitted from './steps/Step7Submitted';

import { INITIAL_CIVICLENS_FORM } from '../types/issue';
import { saveReport } from '../services/db';
import { Camera, MapPin, Bot, FileText, Send, ArrowLeft, ArrowRight, Check, AlertTriangle } from 'lucide-react';

const STEPPER_ITEMS = [
  { num: 1, label: 'Photo', icon: Camera },
  { num: 2, label: 'Location', icon: MapPin },
  { num: 3, label: 'AI Verification', icon: Bot },
  { num: 4, label: 'Details', icon: FileText },
  { num: 5, label: 'Submit', icon: Send },
];

export default function ReportIssueWizard({ onReportSubmitted, onViewDashboard }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_CIVICLENS_FORM);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [validationError, setValidationError] = useState('');

  // Validation function per step
  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.images && formData.images.length > 0;
      case 2:
        return (
          formData.location &&
          formData.location.latitude !== null &&
          formData.location.longitude !== null &&
          formData.location.address &&
          formData.location.address.trim() !== ''
        );
      case 3:
        return true; // AI Detection step auto-completes
      case 4:
        return (
          formData.category && formData.category.trim() !== '' &&
          formData.description && formData.description.trim().length >= 3 &&
          formData.severity && formData.severity.trim() !== ''
        );
      default:
        return true;
    }
  };

  const getStepError = (step) => {
    switch (step) {
      case 1:
        return 'Please upload or take at least 1 evidence image.';
      case 2:
        return 'Please pin a location on the map or use current GPS position.';
      case 4:
        return 'Please select category, severity, and enter a description.';
      default:
        return 'Please complete the required information.';
    }
  };

  const handleNext = () => {
    if (!isStepValid(currentStep)) {
      setValidationError(getStepError(currentStep));
      return;
    }

    setValidationError('');
    if (currentStep === 4) {
      // Submit step
      const saved = saveReport(formData);
      setSubmittedReport(saved);
      if (onReportSubmitted) onReportSubmitted(saved);
      setCurrentStep(5);
    } else {
      setCurrentStep(prev => Math.min(5, prev + 1));
    }
  };

  const handleBack = () => {
    setValidationError('');
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleRestart = () => {
    setFormData(INITIAL_CIVICLENS_FORM);
    setSubmittedReport(null);
    setValidationError('');
    setCurrentStep(1);
  };

  return (
    <div className="glass-card">
      {/* 5-Step Stepper Header */}
      {currentStep < 5 && (
        <div className="stepper-header">
          {STEPPER_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentStep === item.num;
            const isDone = currentStep > item.num;

            return (
              <div 
                key={item.num} 
                className={`stepper-node ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
              >
                <div className="stepper-badge">
                  {isDone ? <Check size={14} /> : <Icon size={14} />}
                </div>
                <span style={{ display: isActive ? 'inline' : 'none' }} className="desktop-only">
                  {item.num}. {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Error Alert Banner */}
      {validationError && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertTriangle size={18} />
          <span>{validationError}</span>
        </div>
      )}

      {/* Step Render */}
      {currentStep === 1 && (
        <Step1UploadEvidence 
          formData={formData} 
          updateFormData={setFormData} 
        />
      )}

      {currentStep === 2 && (
        <Step2Location 
          formData={formData} 
          updateFormData={setFormData} 
        />
      )}

      {currentStep === 3 && (
        <Step3AIDetection 
          formData={formData} 
          updateFormData={setFormData} 
          onNext={() => setCurrentStep(4)}
        />
      )}

      {currentStep === 4 && (
        <div className="step-content">
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
            Step 4 — Issue Category, Details & Severity
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.95rem' }}>
            Confirm category, rate severity, and add specific description details.
          </p>

          <Step3Category formData={formData} updateFormData={setFormData} />
          <div style={{ margin: '24px 0' }}>
            <Step5Severity formData={formData} updateFormData={setFormData} />
          </div>
          <Step4Description formData={formData} updateFormData={setFormData} />
        </div>
      )}

      {currentStep === 5 && (
        <Step7Submitted 
          submittedReport={submittedReport}
          onReportAnother={handleRestart}
          onViewDashboard={onViewDashboard}
        />
      )}

      {/* Navigation Controls Footer */}
      {currentStep < 5 && (
        <footer className="wizard-footer">
          {currentStep > 1 ? (
            <button type="button" className="btn-secondary" onClick={handleBack}>
              <ArrowLeft size={18} /> Back
            </button>
          ) : (
            <div />
          )}

          <button type="button" className="btn-primary" onClick={handleNext}>
            {currentStep === 4 ? (
              <>
                <Send size={18} /> Submit Issue Report
              </>
            ) : (
              <>
                Next Step <ArrowRight size={18} />
              </>
            )}
          </button>
        </footer>
      )}
    </div>
  );
}
