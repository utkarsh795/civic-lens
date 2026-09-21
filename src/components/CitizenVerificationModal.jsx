import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Star, Camera, ArrowRight, MessageSquare, AlertTriangle } from 'lucide-react';

export default function CitizenVerificationModal({ report, onClose, onConfirm, onReopen }) {
  if (!report) return null;

  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [reopenReason, setReopenReason] = useState('');
  const [showReopenInput, setShowReopenInput] = useState(false);

  const beforeImg = report.beforeImage || (report.images && report.images.length > 0 ? report.images[0] : '');
  const afterImg = report.afterImage || beforeImg;

  const handleYesResolved = () => {
    onConfirm(report.id, {
      confirmed: true,
      feedback: {
        rating: feedbackRating,
        comment: feedbackComment || 'Issue resolved satisfactorily.'
      }
    });
    onClose();
  };

  const handleNoStillExists = () => {
    if (!reopenReason.trim()) {
      alert('Please enter a brief note explaining why the issue is still not fixed.');
      return;
    }

    onReopen(report.id, {
      confirmed: false,
      reopenReason
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 800 }}>
              CITIZEN RESOLUTION SIGN-OFF
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '2px' }}>
              Was this issue actually resolved?
            </h2>
          </div>

          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Complaint ID & Category Info */}
        <div style={{ marginBottom: '16px', fontSize: '0.9rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--primary)' }}>
            {report.id}
          </span> • <strong>{report.category}</strong> — {report.location?.address}
        </div>

        {/* Before vs After Side-by-Side Images Comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          
          {/* Before Image */}
          <div style={{ background: 'var(--bg-subtle)', borderRadius: '12px', padding: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ef4444', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Camera size={14} /> BEFORE (Original Incident Photo)
            </div>
            {beforeImg ? (
              <img src={beforeImg} alt="Before" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
            ) : (
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No before photo</div>
            )}
          </div>

          {/* After Image */}
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', borderRadius: '12px', padding: '12px', border: '1px solid #10b981' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} /> AFTER (Authority Repair Proof)
            </div>
            {afterImg ? (
              <img src={afterImg} alt="After" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
            ) : (
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No after photo</div>
            )}
          </div>

        </div>

        {/* Authority Resolution Notes */}
        {report.resolutionDescription && (
          <div style={{ background: 'var(--bg-subtle)', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem' }}>
            <strong>Authority Repair Note:</strong> “{report.resolutionDescription}”
          </div>
        )}

        {/* Reopen input box if citizen clicks NO */}
        {showReopenInput ? (
          <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid #ef4444', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
            <div style={{ fontWeight: 800, color: '#ef4444', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={18} /> Reopen Incident & Notify Authority
            </div>
            <textarea 
              className="form-textarea"
              rows={2}
              placeholder="Describe what is still broken on site (e.g. pothole only half filled, light still flickering)..."
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              style={{ minHeight: '60px' }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowReopenInput(false)}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={handleNoStillExists} style={{ background: '#ef4444' }}>
                Confirm Reopen to In Progress
              </button>
            </div>
          </div>
        ) : (
          /* Star Rating & Feedback Form */
          <div style={{ marginBottom: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Optional Citizen Resolution Feedback:
            </label>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedbackRating(star)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                >
                  <Star 
                    size={22} 
                    color={star <= feedbackRating ? '#f59e0b' : 'var(--border-color)'} 
                    fill={star <= feedbackRating ? '#f59e0b' : 'none'} 
                  />
                </button>
              ))}
            </div>

            <input 
              type="text" 
              className="form-input" 
              placeholder="Add optional feedback or appreciation for the repair team..."
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            />
          </div>
        )}

        {/* Action Buttons: YES vs NO */}
        {!showReopenInput && (
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => setShowReopenInput(true)}
              style={{ color: '#ef4444', borderColor: '#ef4444' }}
            >
              ❌ No, Issue Still Exists
            </button>

            <button 
              type="button" 
              className="btn-primary" 
              onClick={handleYesResolved}
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              ✅ Yes, Issue Resolved
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
