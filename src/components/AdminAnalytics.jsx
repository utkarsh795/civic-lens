import React from 'react';
import { 
  getIssuesByCategory,
  getIssuesBySeverity,
  getIssuesByArea,
  getMonthlyReportsTrend,
  getResolvedVsPending,
  getAverageResolutionTimeByCategory,
  getDepartmentPerformanceMetrics,
  getSLAComplianceBreakdown,
  calculateAreaHealthScores 
} from '../services/analyticsService';
import { calculateSLAMetrics } from '../services/slaService';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  PieChart, 
  ShieldAlert, 
  Calendar, 
  Layers, 
  HeartPulse,
  Flame,
  Award
} from 'lucide-react';

export default function AdminAnalytics({ reports = [] }) {
  const total = reports.length || 1;
  const slaMetrics = calculateSLAMetrics(reports);

  // 1. Category Breakdown
  const categoryCounts = getIssuesByCategory(reports);
  // 2. Severity Breakdown
  const severityCounts = getIssuesBySeverity(reports);
  // 3. Area Breakdown
  const areaCounts = getIssuesByArea(reports);
  // 4. Monthly Trend
  const monthlyTrend = getMonthlyReportsTrend(reports);
  // 5. Resolved vs Pending
  const statusStats = getResolvedVsPending(reports);
  // 6. Avg Resolution Time by Category
  const avgTimes = getAverageResolutionTimeByCategory(reports);
  // 7. Department Performance
  const deptPerformance = getDepartmentPerformanceMetrics(reports);
  // 8. SLA Compliance Breakdown
  const slaBreakdown = getSLAComplianceBreakdown(reports);
  // Area Civic Health Scores
  const healthScores = calculateAreaHealthScores(reports);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} color="#f59e0b" /> Average Resolution Time
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            {slaMetrics.avgResolutionDays} Days
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>Municipal Target: 2.5 Days</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={16} color="var(--primary)" /> SLA Compliance %
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
            {slaMetrics.compliancePct}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target met SLA response rate</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={16} color="#ef4444" /> SLA Breaches
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444', marginTop: '2px' }}>
            {slaMetrics.breachCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>Requires priority action</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="#10b981" /> Resolved Within Target
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
            {slaMetrics.resolvedWithinTargetCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fixed within target deadline</div>
        </div>

      </div>

      {/* Civic Health Scores Section */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HeartPulse size={20} color="#10b981" /> Municipal Civic Health Score Index (0–100)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {healthScores.map((h) => (
            <div 
              key={h.areaName} 
              style={{ 
                background: 'var(--bg-subtle)', 
                border: '1px solid var(--border-color)', 
                padding: '14px', 
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>{h.areaName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {h.totalReports} reports ({h.unresolvedCount} active)
                </div>
              </div>

              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: h.statusColor }}>
                  {h.score}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/100</span>
                </div>
                <span 
                  style={{ 
                    background: h.statusBg, 
                    color: h.statusColor, 
                    fontSize: '0.75rem', 
                    fontWeight: 800, 
                    padding: '3px 8px', 
                    borderRadius: '6px' 
                  }}
                >
                  {h.statusLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of 8 Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        
        {/* Chart 1: Issues by Category */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="var(--primary)" /> 1. Issues by Category
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                    <span>{cat}</span>
                    <span>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Issues by Severity */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#ef4444" /> 2. Issues by Severity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(severityCounts).map(([sev, count]) => {
              const pct = Math.round((count / total) * 100);
              let barColor = '#10b981';
              if (sev === 'Critical') barColor = '#ef4444';
              else if (sev === 'High') barColor = '#f97316';
              else if (sev === 'Medium') barColor = '#f59e0b';

              return (
                <div key={sev}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                    <span>{sev} Priority</span>
                    <span>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Issues by Area / Ward */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={18} color="#06b6d4" /> 3. Issues by Area / Ward
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(areaCounts).map(([ward, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={ward}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                    <span>{ward}</span>
                    <span>{count} reports</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #3b82f6)', borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: Monthly Reports Trend */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="#8b5cf6" /> 4. Monthly Reports Trend
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '120px', gap: '12px', paddingTop: '10px' }}>
            {Object.entries(monthlyTrend).map(([month, count]) => {
              const maxVal = Math.max(...Object.values(monthlyTrend), 5);
              const heightPct = Math.max(15, Math.round((count / maxVal) * 100));
              return (
                <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>{count}</span>
                  <div style={{ width: '100%', height: `${heightPct}%`, background: 'var(--primary)', borderRadius: '4px 4px 0 0' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 5: Resolved vs Pending */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="#10b981" /> 5. Resolved vs Pending Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>✅ Resolved Cases</span>
                <span style={{ color: '#10b981' }}>{statusStats.resolved} ({Math.round((statusStats.resolved/total)*100)}%)</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px' }}>
                <div style={{ width: `${Math.round((statusStats.resolved/total)*100)}%`, height: '100%', background: '#10b981', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>📸 Resolution Submitted (Verification Pending)</span>
                <span style={{ color: '#06b6d4' }}>{statusStats.resolutionSubmitted}</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px' }}>
                <div style={{ width: `${Math.round((statusStats.resolutionSubmitted/total)*100)}%`, height: '100%', background: '#06b6d4', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
                <span>⚙️ Active / Pending Cases</span>
                <span style={{ color: '#f59e0b' }}>{statusStats.totalPending - statusStats.resolutionSubmitted}</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px' }}>
                <div style={{ width: `${Math.round(((statusStats.totalPending - statusStats.resolutionSubmitted)/total)*100)}%`, height: '100%', background: '#f59e0b', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Chart 6: Average Resolution Time by Category */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="#f97316" /> 6. Average Resolution Time by Category
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(avgTimes).map(([cat, data]) => (
              <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{cat}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {data.avgHours} Hours ({data.avgDays} Days)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 7: Department Performance */}
        <div className="glass-card" style={{ padding: '20px', gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} color="#8b5cf6" /> 7. Department Performance Index & Case Volume
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {Object.entries(deptPerformance).map(([dept, data]) => (
              <div key={dept} style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>{dept}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '4px', color: 'var(--primary)' }}>
                  {data.total} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cases</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '6px', fontWeight: 700 }}>
                  <span style={{ color: '#10b981' }}>Resolved: {data.resolved}</span>
                  <span style={{ color: '#ef4444' }}>Breached: {data.breached}</span>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: data.complianceRate >= 80 ? '#10b981' : '#ef4444', marginTop: '4px' }}>
                  Compliance: {data.complianceRate}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 8: SLA Compliance Breakdown */}
        <div className="glass-card" style={{ padding: '20px', gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="#10b981" /> 8. SLA Compliance Breakdown by Severity Tier
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {Object.entries(slaBreakdown).map(([sev, data]) => {
              const compPct = data.total > 0 ? Math.round((data.compliant / data.total) * 100) : 100;
              return (
                <div key={sev} style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{sev} SLA ({data.targetHrs}h Target)</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: compPct >= 80 ? '#10b981' : '#ef4444', marginTop: '4px' }}>
                    {compPct}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Compliant: {data.compliant} | Breached: {data.breached}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
