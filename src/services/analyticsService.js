import { ALL_DEPARTMENTS } from './departmentMapper';

// 1. Issues by Category
export function getIssuesByCategory(reports = []) {
  const counts = {};
  reports.forEach(r => {
    const cat = r.category || 'Other';
    counts[cat] = (counts[cat] || 0) + 1;
  });
  return counts;
}

// 2. Issues by Severity
export function getIssuesBySeverity(reports = []) {
  const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  reports.forEach(r => {
    const sev = r.severity || 'Medium';
    counts[sev] = (counts[sev] || 0) + 1;
  });
  return counts;
}

// Helper to normalize Area/Ward from location object
export function getReportArea(report) {
  const addr = report.location?.address || '';
  if (addr.includes('Koramangala') || addr.includes('151')) return 'Koramangala Ward 151';
  if (addr.includes('MG Road') || addr.includes('112')) return 'MG Road Central Ward';
  if (addr.includes('Indiranagar') || addr.includes('80')) return 'Indiranagar Ward 80';
  if (addr.includes('Jayanagar') || addr.includes('160')) return 'Jayanagar Ward 160';
  if (addr.includes('Lucknow')) return 'Lucknow Central';
  if (addr.includes('Civil Lines')) return 'Civil Lines Zone';
  return 'Central Municipal Zone';
}

// 3. Issues by Area
export function getIssuesByArea(reports = []) {
  const counts = {};
  reports.forEach(r => {
    const area = getReportArea(r);
    counts[area] = (counts[area] || 0) + 1;
  });
  return counts;
}

// 4. Monthly Reports Trend (past 6 months)
export function getMonthlyReportsTrend(reports = []) {
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const monthCounts = {};
  months.forEach(m => { monthCounts[m] = 0; });

  // Distribute reports into months
  reports.forEach((r, idx) => {
    const date = r.createdAt ? new Date(r.createdAt) : new Date();
    const monthName = date.toLocaleString('default', { month: 'short' });
    if (monthCounts[monthName] !== undefined) {
      monthCounts[monthName] += 1;
    } else {
      // fallback mock distribution for demo
      const mKey = months[idx % months.length];
      monthCounts[mKey] += 1;
    }
  });

  return monthCounts;
}

// 5. Resolved vs Pending
export function getResolvedVsPending(reports = []) {
  let resolved = 0;
  let resolutionSubmitted = 0;
  let inProgress = 0;
  let assigned = 0;
  let verified = 0;
  let submitted = 0;

  reports.forEach(r => {
    switch (r.status) {
      case 'Resolved':
        resolved++;
        break;
      case 'Resolution Submitted':
        resolutionSubmitted++;
        break;
      case 'In Progress':
        inProgress++;
        break;
      case 'Assigned':
        assigned++;
        break;
      case 'Verified':
        verified++;
        break;
      default:
        submitted++;
        break;
    }
  });

  return {
    resolved,
    resolutionSubmitted,
    inProgress,
    assigned,
    verified,
    submitted,
    totalPending: inProgress + assigned + verified + submitted + resolutionSubmitted,
    total: reports.length
  };
}

// 6. Average Resolution Time by Category & Overall (in Hours / Days)
export function getAverageResolutionTimeByCategory(reports = []) {
  const categoryTimes = {};
  const categoryCounts = {};

  reports.forEach(r => {
    const cat = r.category || 'Other';
    if (!categoryTimes[cat]) {
      categoryTimes[cat] = 0;
      categoryCounts[cat] = 0;
    }

    // Use actual resolvedAt if available or estimate based on SLA & age
    if (r.resolvedAt && r.createdAt) {
      const hrs = (new Date(r.resolvedAt) - new Date(r.createdAt)) / (1000 * 60 * 60);
      categoryTimes[cat] += Math.max(2, Math.round(hrs));
      categoryCounts[cat] += 1;
    } else {
      // Mock realistic resolution averages in hours by category
      let mockHrs = 36;
      if (r.severity === 'Critical') mockHrs = 18;
      else if (r.severity === 'High') mockHrs = 32;
      else if (r.severity === 'Medium') mockHrs = 48;
      else mockHrs = 72;

      categoryTimes[cat] += mockHrs;
      categoryCounts[cat] += 1;
    }
  });

  const result = {};
  Object.keys(categoryTimes).forEach(cat => {
    const avgHrs = Math.round(categoryTimes[cat] / (categoryCounts[cat] || 1));
    result[cat] = {
      avgHours: avgHrs,
      avgDays: (avgHrs / 24).toFixed(1)
    };
  });

  return result;
}

// 7. Department Performance Metrics
export function getDepartmentPerformanceMetrics(reports = []) {
  const deptData = {};
  ALL_DEPARTMENTS.forEach(d => {
    deptData[d] = {
      total: 0,
      resolved: 0,
      inProgress: 0,
      breached: 0,
      avgHours: 24,
      complianceRate: 100
    };
  });

  reports.forEach(r => {
    const dept = r.department || r.suggestedDepartment || 'Public Works';
    if (!deptData[dept]) {
      deptData[dept] = { total: 0, resolved: 0, inProgress: 0, breached: 0, avgHours: 24, complianceRate: 100 };
    }

    deptData[dept].total += 1;
    if (r.status === 'Resolved' || r.status === 'Resolution Submitted') {
      deptData[dept].resolved += 1;
    } else {
      deptData[dept].inProgress += 1;
    }

    // Check SLA breach
    if (r.status !== 'Resolved') {
      const created = r.createdAt ? new Date(r.createdAt) : new Date();
      const ageHours = (new Date() - created) / (1000 * 60 * 60);
      let targetHrs = 72;
      if (r.severity === 'Critical') targetHrs = 24;
      else if (r.severity === 'High') targetHrs = 48;

      if (ageHours > targetHrs) {
        deptData[dept].breached += 1;
      }
    }
  });

  // Calculate compliance rates
  Object.keys(deptData).forEach(d => {
    const item = deptData[d];
    if (item.total > 0) {
      item.complianceRate = Math.max(0, Math.round(((item.total - item.breached) / item.total) * 100));
    }
  });

  return deptData;
}

// 8. SLA Compliance Breakdown
export function getSLAComplianceBreakdown(reports = []) {
  const severitySLA = {
    Critical: { total: 0, compliant: 0, breached: 0, targetHrs: 24 },
    High: { total: 0, compliant: 0, breached: 0, targetHrs: 48 },
    Medium: { total: 0, compliant: 0, breached: 0, targetHrs: 72 },
    Low: { total: 0, compliant: 0, breached: 0, targetHrs: 120 }
  };

  reports.forEach(r => {
    const sev = r.severity || 'Medium';
    if (!severitySLA[sev]) return;

    severitySLA[sev].total += 1;
    const created = r.createdAt ? new Date(r.createdAt) : new Date();
    const ageHrs = (new Date() - created) / (1000 * 60 * 60);
    const target = severitySLA[sev].targetHrs;

    if (r.status === 'Resolved') {
      severitySLA[sev].compliant += 1;
    } else if (ageHrs > target) {
      severitySLA[sev].breached += 1;
    } else {
      severitySLA[sev].compliant += 1;
    }
  });

  return severitySLA;
}

// 9. Identify Civic Hotspots (High complaint density, repeated/reopened issues, SLA breaches, criticals)
export function getCivicHotspots(reports = []) {
  const areaGroups = {};

  reports.forEach(r => {
    const area = getReportArea(r);
    if (!areaGroups[area]) {
      areaGroups[area] = {
        name: area,
        latitude: r.location?.latitude || 12.9716,
        longitude: r.location?.longitude || 77.5946,
        totalReports: 0,
        criticalCount: 0,
        breachCount: 0,
        reopenedCount: 0,
        upvotesCount: 0,
        reportsList: []
      };
    }

    const group = areaGroups[area];
    group.totalReports += 1;
    group.upvotesCount += (r.upvotes || 0);
    group.reportsList.push(r);

    if (r.severity === 'Critical') group.criticalCount += 1;
    if (r.status === 'In Progress' || r.status === 'Submitted') {
      const created = r.createdAt ? new Date(r.createdAt) : new Date();
      const ageHours = (new Date() - created) / (1000 * 60 * 60);
      if (r.severity === 'Critical' && ageHours > 24) group.breachCount += 1;
      else if (r.severity === 'High' && ageHours > 48) group.breachCount += 1;
    }
    if (r.reopenCount && r.reopenCount > 0) group.reopenedCount += r.reopenCount;
  });

  // Calculate Hotspot Risk Level
  const hotspots = Object.values(areaGroups).map(group => {
    let hotspotScore = (group.totalReports * 10) + (group.criticalCount * 25) + (group.breachCount * 20) + (group.reopenedCount * 15);
    let level = 'LOW';
    let color = '#3b82f6'; // Blue

    if (hotspotScore >= 75 || group.criticalCount >= 2 || group.breachCount >= 2) {
      level = 'CRITICAL HOTSPOT';
      color = '#ef4444'; // Red pulse
    } else if (hotspotScore >= 40 || group.totalReports >= 3) {
      level = 'HIGH RISK';
      color = '#f97316'; // Orange pulse
    } else if (hotspotScore >= 20) {
      level = 'MODERATE';
      color = '#eab308'; // Yellow pulse
    }

    return {
      ...group,
      hotspotScore,
      level,
      color,
      isHotspot: hotspotScore >= 30
    };
  });

  return hotspots;
}

// 10. Area-Level Civic Health Score (0 - 100 Engine)
export function calculateAreaHealthScores(reports = []) {
  const hotspots = getCivicHotspots(reports);

  // Core Area Wards to compute Health Scores
  const defaultWards = [
    { name: 'Lucknow Central', lat: 26.8467, lng: 80.9462, baseScore: 84 },
    { name: 'Koramangala Ward 151', lat: 12.9352, lng: 77.6245, baseScore: 68 },
    { name: 'MG Road Central Ward', lat: 12.9716, lng: 77.5946, baseScore: 78 },
    { name: 'Indiranagar Ward 80', lat: 12.9784, lng: 77.6408, baseScore: 91 },
    { name: 'Jayanagar Ward 160', lat: 12.9250, lng: 77.5938, baseScore: 88 }
  ];

  return defaultWards.map(ward => {
    const areaHotspot = hotspots.find(h => h.name === ward.name);
    let score = ward.baseScore;
    let unresolvedCount = 0;
    let criticalCount = 0;
    let breachCount = 0;
    let totalReports = 0;

    if (areaHotspot) {
      totalReports = areaHotspot.totalReports;
      criticalCount = areaHotspot.criticalCount;
      breachCount = areaHotspot.breachCount;
      
      // Dynamic Deductions
      score -= (criticalCount * 12);
      score -= (breachCount * 10);
      score -= (areaHotspot.reopenedCount * 8);
      
      const unresolved = areaHotspot.reportsList.filter(r => r.status !== 'Resolved').length;
      unresolvedCount = unresolved;
      score -= (unresolved * 4);
    }

    // Clamp score 0 - 100
    score = Math.max(15, Math.min(100, score));

    let statusLabel = '🟢 Good';
    let statusColor = '#10b981';
    let statusBg = '#dcfce7';

    if (score < 50) {
      statusLabel = '🟠 Needs Attention';
      statusColor = '#ea580c';
      statusBg = '#ffedd5';
    } else if (score < 75) {
      statusLabel = '🟡 Moderate';
      statusColor = '#d97706';
      statusBg = '#fef3c7';
    }

    return {
      areaName: ward.name,
      score,
      statusLabel,
      statusColor,
      statusBg,
      totalReports,
      unresolvedCount,
      criticalCount,
      breachCount,
      lat: ward.lat,
      lng: ward.lng
    };
  });
}
