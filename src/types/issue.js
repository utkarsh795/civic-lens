export const CIVICLENS_CATEGORIES = [
  { id: 'Road Damage', label: 'Road Damage', icon: 'Construction', color: '#ef4444', desc: 'Potholes, cracks, road collapse' },
  { id: 'Street Light', label: 'Street Light', icon: 'Lightbulb', color: '#f59e0b', desc: 'Outages, flickering poles, broken fixtures' },
  { id: 'Drainage', label: 'Drainage', icon: 'Waves', color: '#06b6d4', desc: 'Clogged drains, sewage overflow, missing grates' },
  { id: 'Garbage', label: 'Garbage', icon: 'Trash2', color: '#10b981', desc: 'Uncollected waste, overflowing dumpsters' },
  { id: 'Water Leakage', label: 'Water Leakage', icon: 'Droplets', color: '#3b82f6', desc: 'Main line leakage, pipe burst, water supply' },
  { id: 'Traffic Signal', label: 'Traffic Signal', icon: 'AlertTriangle', color: '#8b5cf6', desc: 'Broken signals, missing signs, lane hazard' },
  { id: 'Footpath', label: 'Footpath', icon: 'Footprints', color: '#ec4899', desc: 'Broken pavers, damaged sidewalk, obstruction' },
  { id: 'Public Infrastructure', label: 'Public Infrastructure', icon: 'Building2', color: '#6366f1', desc: 'Damaged public parks, benches, bus shelters' },
  { id: 'Other', label: 'Other', icon: 'HelpCircle', color: '#64748b', desc: 'General civic concern' }
];

export const CATEGORIES = CIVICLENS_CATEGORIES;

export const CIVICLENS_SEVERITIES = [
  { 
    id: 'Low', 
    label: 'Low', 
    color: '#10b981', 
    bgColor: 'rgba(16, 185, 129, 0.1)', 
    borderColor: '#10b981',
    slaDays: 5, 
    desc: 'Routine target (5 days / 120h SLA)' 
  },
  { 
    id: 'Medium', 
    label: 'Medium', 
    color: '#f59e0b', 
    bgColor: 'rgba(245, 158, 11, 0.1)', 
    borderColor: '#f59e0b',
    slaDays: 3, 
    desc: 'Moderate target (3 days / 72h SLA)' 
  },
  { 
    id: 'High', 
    label: 'High', 
    color: '#f97316', 
    bgColor: 'rgba(249, 115, 22, 0.1)', 
    borderColor: '#f97316',
    slaDays: 2, 
    desc: 'Urgent target (2 days / 48h SLA)' 
  },
  { 
    id: 'Critical', 
    label: 'Critical', 
    color: '#ef4444', 
    bgColor: 'rgba(239, 68, 68, 0.1)', 
    borderColor: '#ef4444',
    slaDays: 1, 
    desc: 'Immediate public safety target (24h SLA)' 
  }
];

export const SEVERITIES = CIVICLENS_SEVERITIES;

export const STATUS_LIFECYCLE = [
  'Submitted',
  'Verified',
  'Assigned',
  'In Progress',
  'Resolution Submitted',
  'Citizen Verification',
  'Resolved',
  'Rejected'
];

export const INITIAL_CIVICLENS_FORM = {
  images: [],
  location: {
    latitude: null,
    longitude: null,
    address: ''
  },
  aiConfidence: 98,
  aiTag: 'AI Verified: Road Surface Hazard',
  category: 'Road Damage',
  description: '',
  severity: 'High'
};
