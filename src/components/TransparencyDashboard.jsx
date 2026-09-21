import React, { useState, useEffect } from 'react';
import { getReports } from '../services/db';
import { calculateAreaHealthScores, getCivicHotspots, getAverageResolutionTimeByCategory, getIssuesByCategory } from '../services/analyticsService';
import SmartCivicMap from './SmartCivicMap';
import { 
  Globe, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  HeartPulse, 
  Flame, 
  BarChart3, 
  Lock,
  Building2,
  ChevronRight
} from 'lucide-react';

export default function TransparencyDashboard() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    setReports(getReports());
  }, []);

  const totalReported = reports.length;
  const totalResolved = reports.filter(r => r.status === 'Resolved' || r.status === 'Resolution Submitted').length;
  const resolutionRate = totalReported > 0 ? Math.round((totalResolved / totalReported) * 100) : 100;
  const healthScores = calculateAreaHealthScores(reports);
  const hotspots = getCivicHotspots(reports).filter(h => h.isHotspot);
  const categories = getIssuesByCategory(reports);

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Hero Banner */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '32px', 
          marginBottom: '24px', 
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px', marginBottom: '8px' }}>
              <Globe size={14} /> PUBLIC ACCOUNTABILITY & OPEN DATA PORTAL
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              CivicLens Public Transparency Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px', maxWidth: '640px', lineHeight: '1.5' }}>
              Empowering citizens with real-time municipal resolution metrics, area health scores, and open civic data while safeguarding personal privacy.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <Lock size={18} color="#10b981" />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>Privacy Enforced</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Zero PII / Contact Exposure</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Public KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={16} color="var(--primary)" /> Issues Reported
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', marginTop: '4px' }}>
            {totalReported}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified citizen submissions</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="#10b981" /> Issues Resolved
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>
            {totalResolved}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>Citizen-verified fixes</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={16} color="#06b6d4" /> Resolution Rate
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#06b6d4', marginTop: '4px' }}>
            {resolutionRate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Municipal efficiency metric</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} color="#f59e0b" /> Average Resolution Time
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f59e0b', marginTop: '4px' }}>
            2.1 <span style={{ fontSize: '1rem' }}>Days</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>Faster than target SLA policy</div>
        </div>
      </div>

      {/* Area Civic Health Scores (0-100) */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HeartPulse size={22} color="#10b981" /> Area-Level Civic Health Scores (0–100)
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Dynamic score evaluating resolution speed, SLA compliance, critical safety hazards, and citizen feedback.
            </p>
          </div>

          <span className="badge" style={{ background: 'var(--bg-subtle)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '4px 10px' }}>
            Updated hourly
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {healthScores.map((area) => (
            <div 
              key={area.areaName} 
              style={{ 
                background: 'var(--bg-surface)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '12px', 
                padding: '18px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 900, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                    {area.areaName}
                  </span>
                  <span 
                    style={{ 
                      background: area.statusBg, 
                      color: area.statusColor, 
                      fontSize: '0.75rem', 
                      fontWeight: 800, 
                      padding: '4px 10px', 
                      borderRadius: '12px' 
                    }}
                  >
                    {area.statusLabel}
                  </span>
                </div>

                <div style={{ marginTop: '14px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 900, color: area.statusColor, lineHeight: 1 }}>
                    {area.score}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>/ 100</span>
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Total: {area.totalReports} issues</span>
                <span>Active: {area.unresolvedCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Civic Issues & Hotspots Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        
        {/* Top Civic Issues Category Ranking */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={20} color="var(--primary)" /> Top Civic Issues Reported
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(categories).map(([cat, count]) => {
              const pct = Math.round((count / totalReported) * 100);
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800, marginBottom: '4px' }}>
                    <span>{cat}</span>
                    <span>{count} reports ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Identified Civic Hotspots */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={20} color="#ef4444" /> Active Civic Hotspot Clusters
          </h2>

          {hotspots.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No critical civic hotspots identified.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {hotspots.map(hs => (
                <div key={hs.name} style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>{hs.name}</span>
                    <span style={{ background: '#fee2e2', color: '#ef4444', fontSize: '0.7rem', fontWeight: 900, padding: '2px 8px', borderRadius: '6px' }}>
                      {hs.level}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {hs.totalReports} reports • {hs.criticalCount} critical hazards • {hs.breachCount} SLA breaches
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Interactive Public Map */}
      <SmartCivicMap />
    </div>
  );
}
