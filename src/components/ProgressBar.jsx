import React from 'react';
import { Check, Camera, MapPin, Grid, AlignLeft, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { step: 1, label: 'Photo', icon: Camera },
  { step: 2, label: 'Location', icon: MapPin },
  { step: 3, label: 'Category', icon: Grid },
  { step: 4, label: 'Description', icon: AlignLeft },
  { step: 5, label: 'Severity', icon: ShieldAlert },
  { step: 6, label: 'Review', icon: FileText },
  { step: 7, label: 'Submitted', icon: CheckCircle2 },
];

export default function ProgressBar({ currentStep, onStepClick, isStepValid }) {
  const progressPercent = Math.min(100, Math.max(0, ((currentStep - 1) / (STEPS.length - 1)) * 100));

  return (
    <div className="progress-container">
      <div className="progress-steps">
        <div className="progress-line-track">
          <div 
            className="progress-line-fill" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {STEPS.map((item) => {
          const Icon = item.icon;
          const isCompleted = item.step < currentStep;
          const isActive = item.step === currentStep;
          const isClickable = item.step < currentStep;

          return (
            <div 
              key={item.step} 
              className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => isClickable && onStepClick(item.step)}
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
            >
              <div className="step-bubble">
                {isCompleted ? <Check size={18} /> : <Icon size={18} />}
              </div>
              <span className="step-label">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
