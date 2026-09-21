/**
 * Geographic Proximity & Duplicate Detection Module
 * 
 * Uses Haversine distance formula, category matching, and description similarity 
 * to estimate duplicate probability between reported civic issues.
 */

// Haversine distance calculation in meters
export const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;

  const R = 6371000; // Radius of Earth in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c); // Distance in meters
};

// Word overlap similarity between two descriptions
export const calculateTextSimilarity = (str1 = '', str2 = '') => {
  if (!str1 || !str2) return 0;
  
  const words1 = new Set(str1.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean));
  const words2 = new Set(str2.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean));
  
  if (words1.size === 0 || words2.size === 0) return 0;

  let intersection = 0;
  words1.forEach(word => {
    if (words2.has(word)) intersection++;
  });

  const union = new Set([...words1, ...words2]).size;
  return Math.round((intersection / union) * 100);
};

/**
 * Detects nearby duplicate issues within a reasonable geographic radius (e.g. 500m)
 * Returns { duplicateMatch, similarityScore, distanceMeters }
 */
export const detectNearbyDuplicates = (newLocation, category = '', description = '', existingReports = []) => {
  if (!newLocation || !newLocation.latitude || !newLocation.longitude || existingReports.length === 0) {
    return null;
  }

  let bestMatch = null;
  let highestScore = 0;
  let closestDistance = Infinity;

  existingReports.forEach(report => {
    // Only check unresolved reports for duplicate warnings
    if (report.status === 'Resolved') return;

    const distMeters = calculateDistanceMeters(
      newLocation.latitude,
      newLocation.longitude,
      report.location.latitude,
      report.location.longitude
    );

    // Only inspect reports within 500 meters
    if (distMeters <= 500) {
      let proximityScore = 0;
      if (distMeters <= 50) proximityScore = 45;
      else if (distMeters <= 150) proximityScore = 35;
      else if (distMeters <= 300) proximityScore = 25;
      else proximityScore = 15;

      const categoryScore = (category && report.category && category.toLowerCase() === report.category.toLowerCase()) ? 35 : 10;
      const textScore = calculateTextSimilarity(description, report.description) * 0.2;

      const totalSimilarity = Math.min(99, Math.round(proximityScore + categoryScore + textScore));

      if (totalSimilarity > highestScore) {
        highestScore = totalSimilarity;
        bestMatch = report;
        closestDistance = distMeters;
      }
    }
  });

  if (bestMatch && highestScore >= 40) {
    return {
      duplicateReport: bestMatch,
      similarityScore: highestScore,
      distanceMeters: closestDistance
    };
  }

  return null;
};
