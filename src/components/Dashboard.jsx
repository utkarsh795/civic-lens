import React, { useState, useEffect } from 'react';
import { getReports } from '../services/db';
import { SEVERITIES } from '../types/issue';
import { Search, MapPin, Calendar, X, Image as ImageIcon, ChevronRight } from 'lucide-react';

export default function Dashboard({ onNewReport }) {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    setReports(getReports());
  }, []);

  const filteredReports = reports.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getSeverityObj = (sevId) => SEVERITIES.find(s => s.id === sevId) || SEVERITIES[1];

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>My Reported Complaints</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Track resolution status and official response timelines for your reported civic issues.
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={onNewReport} style={{ fontSize: '0.85rem' }}>
          + Report New Issue
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search by ID (e.g. CL-2026), location, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['All', 'Submitted', 'Under Review', 'In Progress', 'Resolved'].map((status) => (
            <button
              key={status}
              type="button"
              className={`nav-tab ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* List of Reports */}
      {filteredReports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1rem', fontWeight: 600 }}>No complaint reports found matching filters.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredReports.map((report) => {
            const sev = getSeverityObj(report.severity);
            return (
              <div 
                key={report.id}
                onClick={() => setSelectedReport(report)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  gap: '16px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
                  {/* Thumbnail */}
                  {report.images && report.images.length > 0 ? (
                    <img 
                      src={report.images[0]} 
                      alt="Thumb" 
                      style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{ width: '60px', height: '60px', borderRadius: '10px', background: 'var(--bg-card-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ImageIcon size={20} color="var(--text-muted)" />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>
                        {report.id}
                      </span>
                      <span className="badge" style={{ background: sev.bgColor, color: sev.color, border: `1px solid ${sev.color}` }}>
                        {report.severity}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>
                      {report.category}
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      {report.location.address}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</div>
                    <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981' }}>
                      {report.status}
                    </span>
                  </div>
                  <ChevronRight size={20} color="var(--text-muted)" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
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
                  <span className="badge" style={{ background: getSeverityObj(selectedReport.severity).bgColor, color: getSeverityObj(selectedReport.severity).color }}>
                    {selectedReport.severity} Priority
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Target Resolution Date</div>
                <div style={{ fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <Calendar size={16} /> {selectedReport.expectedResolution}
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

              {selectedReport.images && selectedReport.images.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>Attached Photos</div>
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                    {selectedReport.images.map((img, idx) => (
                      <img 
                        key={idx} 
                        src={img} 
                        alt="Proof" 
                        style={{ width: '90px', height: '90px', borderRadius: '8px', objectFit: 'cover' }} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
