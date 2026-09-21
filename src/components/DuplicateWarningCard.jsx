import React from 'react';
import { AlertTriangle, ThumbsUp, ArrowRight, MapPin, Calendar, Building2, CheckCircle2 } from 'lucide-react';

export default function DuplicateWarningCard({ 
  duplicateData, 
  onSupportExisting, 
  onContinueNewReport 
}) {
  if (!duplicateData || !duplicateData.duplicateReport) return null;

  const { duplicateReport, similarityScore, distanceMeters } = duplicateData;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(249, 115, 22, 0.08))',
      border: '2px dashed #f59e0b',
      borderRadius: 'var(--radius-md)',
      padding: '20px',
      marginTop: '20px'
    }}>
      {/* Alert Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={22} /> ⚠️ A similar issue has already been reported nearby.
        </div>
        
        <span className="badge" style={{ background: '#f59e0b', color: 'white', fontSize: '0.8rem', padding: '4px 10px' }}>
          Possible duplicate — {similarityScore}% similarity ({distanceMeters}m away)
        </span>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
        We found an active report near your selected location. Supporting existing reports helps municipal teams prioritize urgent hazards faster!
      </p>

      {/* Existing Complaint Summary Box */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        marginBottom: '16px',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {duplicateReport.images && duplicateReport.images.length > 0 && (
          <img 
            src={duplicateReport.images[0]} 
            alt="Existing Issue" 
            style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }}
          />
        )}

        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--primary)' }}>
              {duplicateReport.id}
            </span>
            <span className="badge" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)' }}>
              {duplicateReport.status}
            </span>
          </div>

          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{duplicateReport.category}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {duplicateReport.location.address}</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '2px', fontWeight: 600 }}>
            👍 {duplicateReport.upvotes || 1} citizens have supported this issue
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button 
          type="button" 
          className="btn-primary" 
          onClick={() => onSupportExisting(duplicateReport.id)}
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)', fontSize: '0.9rem', padding: '10px 18px' }}
        >
          <ThumbsUp size={18} /> Support Existing Report (+1 Upvote)
        </button>

        <button 
          type="button" 
          className="btn-secondary" 
          onClick={onContinueNewReport}
          style={{ fontSize: '0.9rem', padding: '10px 18px' }}
        >
          Report New Issue Anyway <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
