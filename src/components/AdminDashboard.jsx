import React, { useState, useEffect } from 'react';
import { getReports, updateAdminReportDetails, deleteReport } from '../services/db';
import { CIVICLENS_SEVERITIES } from '../types/issue';
import { getSmartPriorityQueue } from '../services/priorityQueue';
import { getSLAStatus, calculateSLAMetrics } from '../services/slaService';
import AdminTriageModal from './AdminTriageModal';
import AdminAnalytics from './AdminAnalytics';
import SLABadge from './SLABadge';
import { 
  ShieldAlert, 
  Search, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  BarChart3, 
  Layers, 
  RefreshCw,
  Eye,
  Trash2,
  Flame,
  UserCheck,
  Building2,
  Calendar,
  Image as ImageIcon,
  AlertOctagon,
  TrendingUp
} from 'lucide-react';

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('table'); // 'table' | 'overdue' | 'priority' | 'analytics'
  const [selectedReport, setSelectedReport] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchLatest = () => {
    setReports(getReports());
  };

  useEffect(() => {
    fetchLatest();
  }, []);

  const handleAdminUpdate = (reportId, payload) => {
    const updated = updateAdminReportDetails(reportId, payload);
    setReports(updated);
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport({ ...selectedReport, ...payload });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 250));
      const updatedReports = deleteReport(deleteTarget.id);
      setReports(updatedReports);
      setToastMessage(`Complaint ${deleteTarget.id} deleted successfully.`);
      setTimeout(() => setToastMessage(null), 4000);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete complaint:', err);
      setErrorMessage('Unable to delete complaint. Please try again.');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered reports
  const filtered = reports.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.assignedOfficer && r.assignedOfficer.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesSeverity = severityFilter === 'All' || r.severity === severityFilter;
    const matchesDept = departmentFilter === 'All' || (r.department || r.suggestedDepartment) === departmentFilter;

    return matchesSearch && matchesStatus && matchesSeverity && matchesDept;
  });

  // SLA Overdue reports (Breached SLA)
  const overdueReports = reports
    .filter(r => getSLAStatus(r).isBreached)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // Aggregate Metrics
  const slaMetrics = calculateSLAMetrics(reports);
  const countTotal = reports.length;
  const countNew = reports.filter(r => r.status === 'Submitted' || r.status === 'New').length;
  const countVerified = reports.filter(r => r.status === 'Verified').length;
  const countAssigned = reports.filter(r => r.status === 'Assigned' || (r.assignedOfficer && r.assignedOfficer !== 'Unassigned')).length;
  const countInProgress = reports.filter(r => r.status === 'In Progress').length;
  const countResolved = reports.filter(r => r.status === 'Resolved').length;

  const priorityQueueList = getSmartPriorityQueue(reports);
  const getSevObj = (sevId) => CIVICLENS_SEVERITIES.find(s => s.id === sevId) || CIVICLENS_SEVERITIES[1];

  return (
    <div className="glass-card">
      {/* Command Center Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)', fontWeight: 800, fontSize: '0.85rem' }}>
            <ShieldAlert size={18} /> MUNICIPAL COMMAND CENTER
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px' }}>CivicLens Authority Control Room</h1>
        </div>

        <button 
          type="button" 
          className="btn-secondary" 
          onClick={fetchLatest}
          style={{ fontSize: '0.85rem' }}
        >
          <RefreshCw size={16} /> Sync Live Feed
        </button>
      </div>

      {/* SLA Dashboard Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Reports</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>{countTotal}</div>
        </div>

        <div style={{ background: 'rgba(37, 99, 235, 0.08)', padding: '12px', borderRadius: '10px', border: '1px solid var(--primary)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>New Reports</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>{countNew}</div>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '12px', borderRadius: '10px', border: '1px solid #10b981' }}>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>Verified</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>{countVerified}</div>
        </div>

        <div style={{ background: 'rgba(139, 92, 246, 0.08)', padding: '12px', borderRadius: '10px', border: '1px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 700 }}>Assigned</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#8b5cf6', marginTop: '2px' }}>{countAssigned}</div>
        </div>

        <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '12px', borderRadius: '10px', border: '1px solid #f59e0b' }}>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>In Progress</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>{countInProgress}</div>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '12px', borderRadius: '10px', border: '1px solid #059669' }}>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>Resolved</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>{countResolved}</div>
        </div>

        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '10px', border: '1px solid #ef4444' }}>
          <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>SLA Breaches</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444', marginTop: '2px' }}>{slaMetrics.breachCount}</div>
        </div>

        <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '12px', borderRadius: '10px', border: '1px solid #06b6d4' }}>
          <div style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 700 }}>SLA Compliance %</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4', marginTop: '2px' }}>{slaMetrics.compliancePct}%</div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button 
          type="button" 
          className={`nav-tab ${activeTab === 'table' ? 'active' : ''}`}
          onClick={() => setActiveTab('table')}
        >
          <Layers size={16} /> Complaint Table
        </button>

        <button 
          type="button" 
          className={`nav-tab nav-tab-overdue ${activeTab === 'overdue' ? 'active' : ''}`}
          onClick={() => setActiveTab('overdue')}
        >
          <AlertOctagon size={16} /> Overdue Issues ({overdueReports.length})
        </button>

        <button 
          type="button" 
          className={`nav-tab nav-tab-priority ${activeTab === 'priority' ? 'active' : ''}`}
          onClick={() => setActiveTab('priority')}
        >
          <Flame size={16} /> Smart Priority Queue ({priorityQueueList.length})
        </button>

        <button 
          type="button" 
          className={`nav-tab nav-tab-analytics ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={16} /> Analytics & SLA
        </button>
      </div>

      {/* TAB 1: Complaint Table */}
      {activeTab === 'table' && (
        <div>
          {/* Filters Bar */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search by ID, location, category, or officer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '36px', padding: '6px 12px 6px 36px', fontSize: '0.85rem' }}
              />
            </div>

            <select 
              className="form-input"
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '6px 10px', fontSize: '0.85rem' }}
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Verified">Verified</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolution Submitted">Resolution Submitted</option>
              <option value="Citizen Verification">Citizen Verification</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select 
              className="form-input"
              value={severityFilter} 
              onChange={(e) => setSeverityFilter(e.target.value)}
              style={{ padding: '6px 10px', fontSize: '0.85rem' }}
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select 
              className="form-input"
              value={departmentFilter} 
              onChange={(e) => setDepartmentFilter(e.target.value)}
              style={{ padding: '6px 10px', fontSize: '0.85rem' }}
            >
              <option value="All">All Departments</option>
              <option value="Public Works">Public Works</option>
              <option value="Electrical">Electrical</option>
              <option value="Municipal Engineering">Municipal Engineering</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Traffic Department">Traffic Department</option>
              <option value="Water Department">Water Department</option>
            </select>
          </div>

          {/* 11-Column Complaint Data Table */}
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Photo</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Department</th>
                  <th>Assigned Officer</th>
                  <th>Created</th>
                  <th>SLA Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No matching complaint reports found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => {
                    const sev = getSevObj(r.severity);
                    const dept = r.department || r.suggestedDepartment || 'Public Works';
                    return (
                      <tr key={r.id}>
                        <td>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--primary)' }}>
                            {r.id}
                          </span>
                        </td>
                        <td>
                          {r.images && r.images.length > 0 ? (
                            <img src={r.images[0]} alt="Thumb" style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }} />
                          ) : (
                            <ImageIcon size={20} color="var(--text-muted)" />
                          )}
                        </td>
                        <td><strong>{r.category}</strong></td>
                        <td style={{ maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {r.location.address}
                        </td>
                        <td>
                          <span className="badge" style={{ background: sev.bgColor, color: sev.color, border: `1px solid ${sev.color}` }}>
                            {r.severity}
                          </span>
                        </td>
                        <td>
                          <span className="badge" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)' }}>
                            {r.status}
                          </span>
                        </td>
                        <td>{dept}</td>
                        <td style={{ fontWeight: 600 }}>{r.assignedOfficer || 'Unassigned'}</td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <SLABadge report={r} />
                        </td>
                        <td>
                          <button 
                            type="button" 
                            className="btn-delete-action"
                            onClick={() => setDeleteTarget(r)}
                            title="Delete Complaint"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Dedicated Overdue Issues Section */}
      {activeTab === 'overdue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '14px', borderRadius: '10px', color: '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>
            🔴 OVERDUE INCIDENTS ALERT: These complaints have exceeded their official resolution SLA target and require emergency dispatch.
          </div>

          {overdueReports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#10b981', fontWeight: 700 }}>
              🎉 Zero SLA Breaches! All complaints are within policy deadlines.
            </div>
          ) : (
            overdueReports.map((r) => {
              const sev = getSevObj(r.severity);
              return (
                <div 
                  key={r.id} 
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid #ef4444',
                    borderLeft: '6px solid #ef4444',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <SLABadge report={r} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--primary)' }}>
                        {r.id}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{r.category}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 6px 0' }}>{r.description}</p>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                      <span>📍 {r.location.address}</span>
                      <span>🏢 Dept: <strong>{r.department || r.suggestedDepartment}</strong></span>
                      <span>👤 Officer: <strong>{r.assignedOfficer || 'Unassigned'}</strong></span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                    <button 
                      type="button" 
                      className="btn-primary" 
                      onClick={() => setSelectedReport(r)}
                      style={{ background: '#ef4444', fontSize: '0.8rem', padding: '6px 14px' }}
                    >
                      Emergency Triage
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: Smart Priority Queue */}
      {activeTab === 'priority' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Incidents ordered by AI risk rating, severity, citizen upvotes, and public safety proximity (school/hospital/transit).
          </p>

          {priorityQueueList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              No active pending priority incidents. All clear!
            </div>
          ) : (
            priorityQueueList.map(({ report: r, priorityDetails: p }) => {
              const sev = getSevObj(r.severity);
              return (
                <div 
                  key={r.id} 
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderLeft: `5px solid ${sev.color}`,
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span className="badge" style={{ background: sev.bgColor, color: sev.color, border: `1px solid ${sev.color}` }}>
                        🔴 {r.severity.toUpperCase()} PRIORITY ({p.score} pts)
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--primary)' }}>
                        {r.id}
                      </span>
                      {p.isPublicSafety && (
                        <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                          ⚠️ Public Safety Zone
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{r.category}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 6px 0' }}>{r.description}</p>
                    
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                      <span>📍 {r.location.address}</span>
                      <span>👍 <strong>{p.citizenCount}</strong> citizens reported</span>
                      <span>⏱️ <strong>{p.hoursOld}h</strong> age</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                    <SLABadge report={r} />
                    <button 
                      type="button" 
                      className="btn-primary" 
                      onClick={() => setSelectedReport(r)}
                      style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                    >
                      Inspect & Dispatch
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 4: Analytics */}
      {activeTab === 'analytics' && (
        <AdminAnalytics reports={reports} />
      )}

      {/* Admin Triage Drawer Modal */}
      {selectedReport && (
        <AdminTriageModal 
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onSave={handleAdminUpdate}
        />
      )}

      {/* Confirmation Modal for Delete */}
      {deleteTarget && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '440px', padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#dc2626', marginBottom: '12px' }}>
              <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '50%', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={22} color="#dc2626" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Delete this complaint?
              </h3>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '16px', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete complaint <strong style={{ color: 'var(--text-main)' }}>{deleteTarget.id}</strong> ({deleteTarget.category})? This action cannot be undone and will remove the record from the database.
            </p>

            {errorMessage && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                {errorMessage}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                style={{ fontSize: '0.88rem', padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-delete-action"
                onClick={confirmDelete}
                disabled={isDeleting}
                style={{ 
                  background: '#dc2626', 
                  color: '#ffffff', 
                  borderColor: '#b91c1c', 
                  padding: '8px 18px', 
                  fontSize: '0.88rem',
                  opacity: isDeleting ? 0.7 : 1,
                  cursor: isDeleting ? 'not-allowed' : 'pointer'
                }}
              >
                {isDeleting ? (
                  <>
                    <RefreshCw size={14} className="spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#059669',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          fontWeight: 700,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1200
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
