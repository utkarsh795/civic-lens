import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, Calendar, Clock, MapPin, ArrowRight, RefreshCw, FileText } from 'lucide-react';

export default function Step7Submitted({ submittedReport, onReportAnother, onViewDashboard }) {
  const [copied, setCopied] = useState(false);

  if (!submittedReport) {
    return (
      <div className="submitted-card">
        <p>No report submitted.</p>
        <button className="btn-primary" onClick={onReportAnother}>Start New Report</button>
      </div>
    );
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(submittedReport.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="submitted-card">
      <div className="success-icon-badge">
        <CheckCircle2 size={44} />
      </div>

      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
        Your issue has been successfully reported.
      </h2>

      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto 20px auto' }}>
        Thank you for helping improve your community! Your report has been dispatched to the civic authority response team.
      </p>

      {/* Complaint ID display */}
      <div className="complaint-id-box">
        <span className="complaint-id-text">{submittedReport.id}</span>
        <button 
          type="button" 
          onClick={handleCopyId}
          className={`btn-copy-id ${copied ? 'copied' : ''}`}
          title="Copy Complaint ID"
        >
          {copied ? <Check size={16} className="copy-icon" /> : <Copy size={16} className="copy-icon" />}
          <span>{copied ? 'Copied!' : 'Copy ID'}</span>
        </button>
      </div>

      {/* Report Info Summary */}
      <div style={{
        maxWidth: '560px',
        margin: '0 auto 28px auto',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        textAlign: 'left',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} color="var(--primary)" /> Current Status
            </div>
            <div style={{ marginTop: '4px' }}>
              <span className="badge" style={{ background: 'rgba(79, 70, 229, 0.12)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
                {submittedReport.status}
              </span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} color="#10b981" /> Expected Resolution Date
            </div>
            <div style={{ marginTop: '4px', fontWeight: 700, fontSize: '0.95rem', color: '#10b981' }}>
              {submittedReport.expectedResolution}
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <MapPin size={14} /> <strong>Location:</strong> {submittedReport.location.address}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button type="button" className="btn-secondary" onClick={onReportAnother}>
          <RefreshCw size={18} /> Report Another Issue
        </button>

        <button type="button" className="btn-primary" onClick={onViewDashboard}>
          <FileText size={18} /> View My Complaints <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
