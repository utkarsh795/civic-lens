/**
 * Smart Priority Queue Engine
 * 
 * Calculates multi-factor priority score for complaints based on:
 * - Severity level
 * - Public safety hazard keywords (school, hospital, crossing, highway)
 * - Citizen upvote counts (multiple citizens reporting)
 * - Age of complaint (hours pending)
 * - AI confidence score
 */

export const calculatePriorityScore = (report) => {
  let score = 0;

  // 1. Severity weight
  switch (report.severity) {
    case 'Critical':
      score += 40;
      break;
    case 'High':
      score += 30;
      break;
    case 'Medium':
      score += 20;
      break;
    case 'Low':
      score += 10;
      break;
    default:
      score += 15;
  }

  // 2. Public safety proximity keywords
  const text = `${report.description || ''} ${report.location?.address || ''}`.toLowerCase();
  const safetyKeywords = ['school', 'hospital', 'crossing', 'highway', 'metro', 'children', 'elderly', 'danger', 'hazard', 'pedestrian'];
  
  let matchesSafety = false;
  safetyKeywords.forEach(kw => {
    if (text.includes(kw)) matchesSafety = true;
  });

  if (matchesSafety) {
    score += 25;
  }

  // 3. Number of citizens reporting / upvotes
  const citizenCount = report.upvotes || 1;
  score += Math.min(30, citizenCount * 4);

  // 4. Age of complaint (hours pending)
  const createdTime = new Date(report.createdAt).getTime();
  const hoursOld = Math.max(0, Math.floor((Date.now() - createdTime) / 3600000));
  score += Math.min(25, hoursOld * 1.5);

  // 5. AI confidence recommendation
  if (report.aiConfidence && report.aiConfidence >= 90) {
    score += 10;
  }

  return {
    score: Math.round(score),
    isPublicSafety: matchesSafety,
    citizenCount,
    hoursOld
  };
};

export const getSmartPriorityQueue = (reports = []) => {
  return reports
    .filter(r => r.status !== 'Resolved' && r.status !== 'Rejected')
    .map(r => ({
      report: r,
      priorityDetails: calculatePriorityScore(r)
    }))
    .sort((a, b) => b.priorityDetails.score - a.priorityDetails.score);
};
