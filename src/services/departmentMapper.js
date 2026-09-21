/**
 * Department Mapping Engine
 * 
 * Strict Mapping Rules:
 * - Road / Road Damage / Pothole ➔ Public Works
 * - Street Light ➔ Electrical
 * - Drainage / Drainage issue ➔ Municipal Engineering
 * - Garbage ➔ Sanitation
 * - Traffic Signal / Traffic ➔ Traffic Department
 * - Water / Water Leakage ➔ Water Department
 */

export const DEPARTMENT_MAPPING = {
  'Road Damage': 'Public Works',
  'Road': 'Public Works',
  'Pothole': 'Public Works',
  'Road crack': 'Public Works',
  
  'Street Light': 'Electrical',
  'Broken street light': 'Electrical',

  'Drainage': 'Municipal Engineering',
  'Drainage issue': 'Municipal Engineering',

  'Garbage': 'Sanitation',

  'Traffic Signal': 'Traffic Department',
  'Traffic': 'Traffic Department',

  'Water Leakage': 'Water Department',
  'Water': 'Water Department',

  'Footpath': 'Public Works',
  'Damaged footpath': 'Public Works',

  'Public Infrastructure': 'Municipal Engineering',
  'Damaged public infrastructure': 'Municipal Engineering',

  'Other': 'Public Works'
};

export const getDepartmentForCategory = (category = '') => {
  if (!category) return 'Public Works';
  
  const key = Object.keys(DEPARTMENT_MAPPING).find(
    k => k.toLowerCase() === category.trim().toLowerCase()
  );

  return key ? DEPARTMENT_MAPPING[key] : 'Public Works';
};

export const ALL_DEPARTMENTS = [
  'Public Works',
  'Electrical',
  'Municipal Engineering',
  'Sanitation',
  'Traffic Department',
  'Water Department'
];
