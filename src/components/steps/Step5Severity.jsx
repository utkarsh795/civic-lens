import React from 'react';
import { SEVERITIES } from '../../types/issue';
import { ShieldAlert, Clock, CheckCircle2 } from 'lucide-react';

export default function Step5Severity({ formData, updateFormData }) {
  const handleSelectSeverity = (severityId) => {
    updateFormData(prev => ({
      ...prev,
      severity: severityId
    }));
  };

  return (
    <div className="step-content">
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>
        Step 5 — Select Severity Level
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.95rem' }}>
        Rate the urgency of this civic issue. Resolution response times are prioritized by severity.
      </p>

      <div className="severity-grid">
        {SEVERITIES.map((sev) => {
          const isSelected = formData.severity === sev.id;

          return (
            <div 
              key={sev.id}
              className={`severity-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelectSeverity(sev.id)}
              style={{
                borderColor: isSelected ? sev.borderColor : 'var(--border-color)',
                background: isSelected ? sev.bgColor : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge" style={{ background: sev.bgColor, color: sev.color, border: `1px solid ${sev.color}` }}>
                  <ShieldAlert size={12} style={{ marginRight: '4px' }} /> {sev.label}
                </span>
                {isSelected && <CheckCircle2 size={20} color={sev.color} />}
              </div>

              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: sev.color, marginBottom: '6px' }}>
                {sev.label} Priority
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                {sev.desc}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: sev.color }}>
                <Clock size={14} /> Expected SLA: ~{sev.slaDays} {sev.slaDays === 1 ? 'day' : 'days'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
