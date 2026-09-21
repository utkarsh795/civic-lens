import React, { useState } from 'react';
import { ALL_DEPARTMENTS } from '../services/departmentMapper';
import { CIVICLENS_SEVERITIES } from '../types/issue';
import { submitResolutionProof } from '../services/db';
import ActivityTimeline from './ActivityTimeline';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  UserCheck, 
  Upload, 
  Send,
  Camera,
  AlertTriangle
} from 'lucide-react';

export default function AdminTriageModal({ report, onClose, onSave }) {
  if (!report) return null;

  const [status, setStatus] = useState(report.status || 'Submitted');
  const [department, setDepartment] = useState(report.department || report.suggestedDepartment || 'Public Works');
  const [assignedOfficer, setAssignedOfficer] = useState(report.assignedOfficer || '');
  const [severity, setSeverity] = useState(report.severity || 'Medium');
  const [internalNotes, setInternalNotes] = useState(report.internalNotes || '');
  const [rejectionReason, setRejectionReason] = useState(report.rejectedReason || '');
  const [afterImage, setAfterImage] = useState(report.afterImage || '');
  const [resolutionDescription, setResolutionDescription] = useState(report.resolutionDescription || '');
  const [showRejectBox, setShowRejectBox] = useState(false);

  const handleVerify = () => {
    setStatus('Verified');
    onSave(report.id, {
      status: 'Verified',
      department,
      severity,
      verifiedAt: new Date().toISOString()
    });
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please enter a rejection reason before rejecting the report.');
      return;
    }

    setStatus('Rejected');
    onSave(report.id, {
      status: 'Rejected',
      rejectedReason: rejectionReason,
      rejectedAt: new Date().toISOString()
    });
    onClose();
  };

  const handleAfterImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAfterImage(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Authority Resolution Evidence (Marks status as Resolution Submitted)
  const handleResolutionSubmit = () => {
    if (!resolutionDescription.trim()) {
      alert('Please provide a resolution description (e.g. "Pothole repaired and road surface restored.")');
      return;
    }

    const updated = submitResolutionProof(report.id, {
      afterImage: afterImage || (report.images && report.images.length > 0 ? report.images[0] : ''),
      resolutionDescription,
      authorityOfficer: assignedOfficer || 'Municipal Engineer'
    });

    onSave(report.id, {
      status: 'Resolution Submitted',
      afterImage: afterImage || (report.images && report.images.length > 0 ? report.images[0] : ''),
      resolutionDescription
    });

    alert('Resolution proof submitted successfully! Status changed to Resolution Submitted pending citizen verification sign-off.');
    onClose();
  };

  const handleSubmitChanges = (e) => {
    e.preventDefault();
    
    // Prevent authorities from directly setting Resolved without evidence
    if (status === 'Resolved' && !report.citizenConfirmation && !report.afterImage) {
      alert('Authority Safety Policy: You cannot directly mark a complaint as permanently Resolved without resolution evidence. Please submit an After Image and Resolution Description first.');
      return;
    }

    onSave(report.id, {
      status,
      department,
      assignedOfficer: assignedOfficer || 'Unassigned',
      severity,
      internalNotes,
      afterImage,
      resolutionDescription
    });
    onClose();
  };

  const getSevObj = (sevId) => CIVICLENS_SEVERITIES.find(s => s.id === sevId) || CIVICLENS_SEVERITIES[1];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>
                {report.id}
              </span>
              <span className="badge" style={{ background: 'rgba(37, 99, 235, 0.12)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
                {status}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Reported on {new Date(report.createdAt).toLocaleString()} • {report.upvotes || 1} Citizen Upvotes
            </div>
          </div>

          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Quick Triage Actions Bar (Verify / Reject) */}
        <div style={{ background: 'var(--bg-subtle)', padding: '12px 16px', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Quick Actions:</span>
          
          <button 
            type="button" 
            className="btn-primary" 
            onClick={handleVerify}
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', fontSize: '0.85rem', padding: '6px 14px' }}
          >
            <CheckCircle2 size={16} /> Mark Verified
          </button>

          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setShowRejectBox(prev => !prev)}
            style={{ color: '#ef4444', borderColor: '#ef4444', fontSize: '0.85rem', padding: '6px 14px' }}
          >
            <XCircle size={16} /> Reject Report
          </button>
        </div>

        {/* Rejection reason box */}
        {showRejectBox && (
          <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid #ef4444', padding: '14px', borderRadius: '10px', marginBottom: '20px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444', display: 'block', marginBottom: '6px' }}>
              Reason for Rejection:
            </label>
            <textarea 
              className="form-textarea"
              rows={2}
              placeholder="e.g., Duplicate report, private property issue, insufficient photographic evidence..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              style={{ minHeight: '60px' }}
            />
            <button type="button" className="btn-primary" onClick={handleReject} style={{ marginTop: '8px', background: '#ef4444', fontSize: '0.85rem', padding: '6px 12px' }}>
              Confirm Rejection
            </button>
          </div>
        )}

        {/* Report Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          
          {/* Left Column: Complaint evidence, Activity Timeline */}
          <div>
            {report.images && report.images.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>BEFORE (Original Photo)</div>
                <img 
                  src={report.images[0]} 
                  alt="Evidence" 
                  style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--border-color)' }}
                />
              </div>
            )}

            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category</div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{report.category}</div>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Location Address</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>📍 {report.location.address}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Citizen Description</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', background: 'var(--bg-subtle)', padding: '10px', borderRadius: '8px', marginTop: '2px' }}>
                {report.description}
              </p>
            </div>

            {/* Activity Timeline Audit */}
            <ActivityTimeline timeline={report.activityTimeline} />
          </div>

          {/* Right Column: Resolution Evidence & Admin Management Form */}
          <form onSubmit={handleSubmitChanges} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Mandatory Resolution Proof Section */}
            <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Camera size={16} /> Submit Resolution Evidence Proof
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Resolution Description (Required)</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder='e.g., "Pothole repaired and road surface restored."'
                  value={resolutionDescription}
                  onChange={(e) => setResolutionDescription(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>AFTER Image (Upload Repair Photo)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAfterImageUpload}
                  style={{ fontSize: '0.8rem' }}
                />
                {afterImage && (
                  <div style={{ marginTop: '8px' }}>
                    <img src={afterImage} alt="After Proof" style={{ width: '70px', height: '70px', borderRadius: '6px', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleResolutionSubmit}
                style={{ width: '100%', fontSize: '0.85rem', padding: '8px', justifyContent: 'center' }}
              >
                <Camera size={16} /> Submit Proof ➔ Change Status to Resolution Submitted
              </button>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>
                <Building2 size={14} style={{ display: 'inline', marginRight: '4px' }} /> Assign Department
              </label>
              <select 
                className="form-input"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{ padding: '8px 12px' }}
              >
                {ALL_DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>
                <UserCheck size={14} style={{ display: 'inline', marginRight: '4px' }} /> Assign Officer / Badge #
              </label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g., Eng. Rajesh Kumar (Badge #409)"
                value={assignedOfficer}
                onChange={(e) => setAssignedOfficer(e.target.value)}
                style={{ padding: '8px 12px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Priority / Severity</label>
                <select 
                  className="form-input" 
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  style={{ padding: '8px 12px' }}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Workflow Status</label>
                <select 
                  className="form-input" 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ padding: '8px 12px' }}
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Verified">Verified</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolution Submitted">Resolution Submitted</option>
                  <option value="Citizen Verification">Citizen Verification</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Internal Municipal Team Notes</label>
              <textarea 
                className="form-textarea" 
                rows={2} 
                placeholder="Add private internal notes, work order references..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                style={{ minHeight: '50px', padding: '8px 12px' }}
              />
            </div>

            <button type="submit" className="btn-secondary" style={{ justifyContent: 'center' }}>
              <Send size={16} /> Save Workflow Details
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
