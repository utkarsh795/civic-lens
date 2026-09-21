/**
 * Modular 2-3 Day Civic Issue Resolution SLA Service
 * 
 * SLA Target Policies:
 * - Critical ➔ 24 hours (1 day)
 * - High     ➔ 48 hours (2 days)
 * - Medium   ➔ 72 hours (3 days)
 * - Low      ➔ 120 hours (5 days)
 */

export const SLA_POLICY_HOURS = {
  Critical: 24,
  High: 48,
  Medium: 72,
  Low: 120
};

// Calculate target deadline date from creation/verification timestamp
export const calculateSLADeadline = (severity = 'Medium', creationTimestamp = new Date().toISOString()) => {
  const hours = SLA_POLICY_HOURS[severity] || 72;
  const createdDate = new Date(creationTimestamp);
  const deadlineDate = new Date(createdDate.getTime() + hours * 3600000);
  
  return {
    rawISO: deadlineDate.toISOString(),
    hours,
    formatted: deadlineDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
};

/**
 * Calculates current SLA status for a report relative to server/database timestamp
 */
export const getSLAStatus = (report, nowISO = new Date().toISOString()) => {
  const severity = report.severity || 'Medium';
  const creationTime = new Date(report.createdAt || nowISO).getTime();
  const nowTime = new Date(nowISO).getTime();
  
  const targetHours = SLA_POLICY_HOURS[severity] || 72;
  const deadlineTime = creationTime + targetHours * 3600000;
  
  const diffMs = deadlineTime - nowTime;
  const diffHours = Math.round(diffMs / 3600000);

  const isResolved = report.status === 'Resolved';
  const isRejected = report.status === 'Rejected';

  if (isResolved) {
    const resolvedTime = report.resolvedAt ? new Date(report.resolvedAt).getTime() : nowTime;
    const metTarget = resolvedTime <= deadlineTime;
    return {
      isResolved: true,
      isBreached: !metTarget,
      isApproaching: false,
      hoursRemaining: 0,
      badgeText: metTarget ? '✅ Resolved Within Target' : '⚠️ Resolved Post-SLA',
      badgeColor: metTarget ? '#10b981' : '#f59e0b',
      badgeBg: metTarget ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'
    };
  }

  if (isRejected) {
    return {
      isResolved: false,
      isBreached: false,
      isApproaching: false,
      hoursRemaining: 0,
      badgeText: 'Rejected',
      badgeColor: '#64748b',
      badgeBg: 'rgba(100, 116, 139, 0.15)'
    };
  }

  if (diffMs < 0) {
    const overdueHours = Math.abs(diffHours);
    return {
      isResolved: false,
      isBreached: true,
      isApproaching: false,
      hoursRemaining: diffHours,
      badgeText: `🔴 SLA Breached (Overdue by ${overdueHours}h)`,
      badgeColor: '#ef4444',
      badgeBg: 'rgba(239, 68, 68, 0.15)'
    };
  }

  if (diffHours <= 6) {
    return {
      isResolved: false,
      isBreached: false,
      isApproaching: true,
      hoursRemaining: diffHours,
      badgeText: `⚠️ Deadline approaching (${diffHours}h left)`,
      badgeColor: '#f59e0b',
      badgeBg: 'rgba(245, 158, 11, 0.15)'
    };
  }

  return {
    isResolved: false,
    isBreached: false,
    isApproaching: false,
    hoursRemaining: diffHours,
    badgeText: `⏱️ ${diffHours} hours remaining`,
    badgeColor: '#2563eb',
    badgeBg: 'rgba(37, 99, 235, 0.1)'
  };
};

/**
 * Calculates dashboard aggregate SLA metrics across all reports
 */
export const calculateSLAMetrics = (reports = [], nowISO = new Date().toISOString()) => {
  const total = reports.length;
  if (total === 0) {
    return {
      avgResolutionDays: '0.0',
      compliancePct: 100,
      breachCount: 0,
      resolvedWithinTargetCount: 0
    };
  }

  let breachCount = 0;
  let resolvedWithinTargetCount = 0;
  let totalResolutionHours = 0;
  let resolvedCount = 0;

  reports.forEach(r => {
    const sla = getSLAStatus(r, nowISO);

    if (sla.isBreached) {
      breachCount++;
    }

    if (r.status === 'Resolved') {
      resolvedCount++;
      if (!sla.isBreached) {
        resolvedWithinTargetCount++;
      }

      const created = new Date(r.createdAt).getTime();
      const resolved = r.resolvedAt ? new Date(r.resolvedAt).getTime() : Date.now();
      const hrs = Math.max(1, (resolved - created) / 3600000);
      totalResolutionHours += hrs;
    }
  });

  const avgHours = resolvedCount > 0 ? totalResolutionHours / resolvedCount : 44;
  const avgResolutionDays = (avgHours / 24).toFixed(1);

  const totalNonRejected = reports.filter(r => r.status !== 'Rejected').length || 1;
  const compliancePct = Math.round(((totalNonRejected - breachCount) / totalNonRejected) * 100);

  return {
    avgResolutionDays,
    compliancePct: Math.max(0, Math.min(100, compliancePct)),
    breachCount,
    resolvedWithinTargetCount
  };
};
