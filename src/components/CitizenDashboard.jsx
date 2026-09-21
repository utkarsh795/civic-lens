import React, { useState, useEffect } from 'react';
import { getReports, verifyResolutionByCitizen } from '../services/db';
import { CIVICLENS_SEVERITIES } from '../types/issue';
import SLABadge from './SLABadge';
import CitizenVerificationModal from './CitizenVerificationModal';
import ActivityTimeline from './ActivityTimeline';
import { 
  PlusCircle, 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon,
  ChevronRight,
  X,
  CheckCheck
} from 'lucide-react';

export default function CitizenDashboard({ onNewReport }) {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);
  const [verifyingReport, setVerifyingReport] = useState(null);

  const fetchLatest = () => {
    setReports(getReports());
  };

  useEffect(() => {
    fetchLatest();
  }, []);

  const handleConfirmResolution = (reportId, payload) => {
    const updated = verifyResolutionByCitizen(reportId, payload);
    setReports(updated);
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport(null);
    }
  };

  const handleReopenResolution = (reportId, payload) => {
    const updated = verifyResolutionByCitizen(reportId, payload);
    setReports(updated);
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport(null);
    }
  };

  const filtered = reports.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pending citizen verification list
  const pendingVerificationList = reports.filter(r => r.status === 'Resolution Submitted' || r.status === 'Citizen Verification');

  const countTotal = reports.length;
  const countPending = reports.filter(r => r.status === 'Pending' || r.status === 'Submitted' || r.status === 'Verified').length;
  const countInProgress = reports.filter(r => r.status === 'In Progress' || r.status === 'Assigned').length;
  const countResolved = reports.filter(r => r.status === 'Resolved').length;

  const getSevObj = (sevId) => CIVICLENS_SEVERITIES.find(s => s.id === sevId) || CIVICLENS_SEVERITIES[1];

  return (
    <div className="glass-card">
      {/* Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Welcome to Citizen Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Track resolution progress, inspect before/after proofs, and confirm fixed issues.
          </p>
        </div>
        
        <button type="button" className="btn-primary" onClick={onNewReport}>
          <PlusCircle size={18} /> Report New Issue
        </button>
      </div>

      {/* Prominent Verification Alert if authority submitted resolution proof */}
      {pendingVerificationList.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.12))',
          border: '2px solid #10b981',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontWeight: 800, color: '#10b981', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCheck size={20} /> Action Needed: {pendingVerificationList.length} Issue(s) Fixed by Authority!
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Please review the Before vs After photos and sign off to confirm resolution.
            </p>
          </div>

          <button 
            type="button" 
            className="btn-primary" 
            onClick={() => setVerifyingReport(pendingVerificationList[0])}
            style={{ background: '#10b981', fontSize: '0.9rem', padding: '10px 18px' }}
          >
            Review & Sign-Off Now <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* KPI Stats Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Reports</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>{countTotal}</div>
        </div>

        <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>Pending Triage</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>{countPending}</div>
        </div>

        <div style={{ background: 'rgba(37, 99, 235, 0.08)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(37, 99, 235, 0.3)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>In Progress</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>{countInProgress}</div>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Resolved</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>{countResolved}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search by Complaint ID (CL-2026-XXXXX), address, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['All', 'Resolution Submitted', 'In Progress', 'Resolved'].map((st) => (
            <button
              key={st}
              type="button"
              className={`nav-tab ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Reports Card Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1rem', fontWeight: 600 }}>No complaint reports found matching your criteria.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filtered.map((report) => {
            const sev = getSevObj(report.severity);
            const needsVerification = report.status === 'Resolution Submitted' || report.status === 'Citizen Verification';
            return (
              <div 
                key={report.id}
                onClick={() => {
                  if (needsVerification) {
                    setVerifyingReport(report);
                  } else {
                    setSelectedReport(report);
                  }
                }}
                style={{
                  background: 'var(--bg-surface)',
                  border: needsVerification ? '2px solid #10b981' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Image thumbnail header */}
                <div style={{ position: 'relative', height: '140px', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-subtle)' }}>
                  {report.images && report.images.length > 0 ? (
                    <img src={report.images[0]} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ImageIcon size={24} color="var(--text-muted)" />
                    </div>
                  )}
                  <span 
                    className="badge" 
                    style={{ 
                      position: 'absolute', 
                      top: '8px', 
                      right: '8px', 
                      background: needsVerification ? '#10b981' : 'rgba(15,23,42,0.85)', 
                      color: 'white', 
                      backdropFilter: 'blur(4px)' 
                    }}
                  >
                    {report.status}
                  </span>
                </div>

                {/* ID & Category */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>
                      {report.id}
                    </span>
                    <span className="badge" style={{ background: sev.bgColor, color: sev.color, border: `1px solid ${sev.color}` }}>
                      {report.severity}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>{report.category}</h3>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} color="var(--primary)" />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{report.location.address}</span>
                </div>

                {/* SLA & Action button */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <SLABadge report={report} />
                  {needsVerification ? (
                    <button type="button" className="btn-primary" style={{ fontSize: '0.75rem', padding: '4px 10px', background: '#10b981' }}>
                      Verify Fix ➔
                    </button>
                  ) : (
                    <ChevronRight size={16} color="var(--primary)" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal with Transparency Timeline */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>
                  {selectedReport.id}
                </span>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Reported on {new Date(selectedReport.createdAt).toLocaleString()}
                </div>
              </div>
              <button type="button" onClick={() => setSelectedReport(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category & Severity</div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedReport.category}</span>
                  <span className="badge" style={{ background: getSevObj(selectedReport.severity).bgColor, color: getSevObj(selectedReport.severity).color }}>
                    {selectedReport.severity} Priority
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Resolution SLA Target</div>
                <div style={{ marginTop: '4px' }}>
                  <SLABadge report={selectedReport} style={{ fontSize: '0.85rem', padding: '6px 12px' }} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Location Address</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '2px' }}>
                  {selectedReport.location.address}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Description</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '2px' }}>
                  {selectedReport.description}
                </p>
              </div>

              {/* Activity Audit Timeline */}
              <ActivityTimeline timeline={selectedReport.activityTimeline} />
            </div>
          </div>
        </div>
      )}

      {/* Citizen Verification Modal Sign-Off */}
      {verifyingReport && (
        <CitizenVerificationModal 
          report={verifyingReport}
          onClose={() => setVerifyingReport(null)}
          onConfirm={handleConfirmResolution}
          onReopen={handleReopenResolution}
        />
      )}
    </div>
  );
}
