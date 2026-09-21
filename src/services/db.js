import { getDepartmentForCategory } from './departmentMapper';
import { 
  notifyReportSubmitted, 
  notifyReportVerified, 
  notifyReportRejected, 
  notifyDepartmentAssigned, 
  notifyWorkStarted, 
  notifyResolutionSubmitted, 
  notifyIssueResolved, 
  notifyIssueReopened 
} from './notifications';

const STORAGE_KEY = 'civiclens_issue_reports_v7';

// Helper to generate complaint ID: CL-2026-XXXXX
export const generateComplaintId = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000); // 5 digits
  return `CL-${year}-${randomNum}`;
};

// Calculate expected resolution date based on severity SLA days
export const calculateResolutionDate = (severityId, fromDate = new Date()) => {
  let daysToAdd = 5;
  switch (severityId) {
    case 'Critical':
      daysToAdd = 1;
      break;
    case 'High':
      daysToAdd = 3;
      break;
    case 'Medium':
      daysToAdd = 5;
      break;
    case 'Low':
      daysToAdd = 7;
      break;
    default:
      daysToAdd = 5;
  }

  const targetDate = new Date(fromDate);
  targetDate.setDate(targetDate.getDate() + daysToAdd);

  const formattedDate = targetDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return {
    raw: targetDate.toISOString(),
    formatted: formattedDate,
    slaDays: daysToAdd
  };
};

// Default rich seed dataset with full audit logs and notifications support
const SEED_REPORTS = [
  {
    id: 'CL-2026-94812',
    category: 'Road Damage',
    severity: 'Critical',
    suggestedDepartment: 'Public Works',
    department: 'Public Works',
    assignedOfficer: 'Eng. Rajesh Kumar',
    description: 'Hazardous deep pothole near school zone crossing causing severe traffic slowdown and vehicle axle risk.',
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      address: 'MG Road, near Trinity Metro Station, Ward 112'
    },
    images: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'In Progress',
    upvotes: 14,
    aiConfidence: 94,
    aiTag: 'AI Verified: Pothole (94% confidence)',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    expectedResolution: calculateResolutionDate('Critical', new Date(Date.now() - 86400000 * 2)).formatted,
    internalNotes: 'Dispatched Asphalt Patch Team #4. Traffic diverted locally.',
    activityTimeline: [
      { stage: 'Reported', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Citizen reported issue.' },
      { stage: 'Verified', timestamp: new Date(Date.now() - 86400000 * 1.8).toISOString(), note: 'AI & Admin verified hazard.' },
      { stage: 'Assigned to Public Works', timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(), note: 'Assigned to Eng. Rajesh Kumar.' },
      { stage: 'Work In Progress', timestamp: new Date(Date.now() - 86400000 * 0.5).toISOString(), note: 'Repair crew dispatched to site.' }
    ]
  },
  {
    id: 'CL-2026-41903',
    category: 'Street Light',
    severity: 'Medium',
    suggestedDepartment: 'Electrical',
    department: 'Electrical',
    assignedOfficer: 'Insp. Sarah Chen',
    description: 'Flickering street light pole #42 on main avenue creating dark safety concern at night.',
    location: {
      latitude: 12.9352,
      longitude: 77.6245,
      address: '80 Feet Road, 4th Block, Koramangala, Ward 151'
    },
    images: [
      'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'Resolution Submitted',
    upvotes: 6,
    aiConfidence: 92,
    aiTag: 'AI Verified: Broken street light (92% confidence)',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    expectedResolution: calculateResolutionDate('Medium', new Date(Date.now() - 86400000 * 1)).formatted,
    beforeImage: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    afterImage: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    resolutionDescription: 'Replaced LED bulb driver and restored pole wiring fixture.',
    internalNotes: 'Electrician crew completed repair.',
    activityTimeline: [
      { stage: 'Reported', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), note: 'Citizen reported issue.' },
      { stage: 'Verified', timestamp: new Date(Date.now() - 86400000 * 0.8).toISOString(), note: 'Verified by Electrical division.' },
      { stage: 'Assigned to Electrical', timestamp: new Date(Date.now() - 86400000 * 0.6).toISOString(), note: 'Assigned to Insp. Sarah Chen.' },
      { stage: 'Work In Progress', timestamp: new Date(Date.now() - 86400000 * 0.4).toISOString(), note: 'Repair started on light fixture.' },
      { stage: 'Resolution Submitted', timestamp: new Date(Date.now() - 86400000 * 0.1).toISOString(), note: 'Replaced LED bulb driver and restored pole wiring fixture.' }
    ]
  },
  {
    id: 'CL-2026-78210',
    category: 'Garbage',
    severity: 'High',
    suggestedDepartment: 'Sanitation',
    department: 'Sanitation',
    assignedOfficer: 'Superintendent Vikram Singh',
    description: 'Overflowing public waste bin near market entrance attracting pests and blocking pedestrian path.',
    location: {
      latitude: 12.9784,
      longitude: 77.6408,
      address: 'Indiranagar 100 Feet Road, Ward 80'
    },
    images: [
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'Resolved',
    upvotes: 56,
    aiConfidence: 97,
    aiTag: 'AI Verified: Garbage (97% confidence)',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    expectedResolution: calculateResolutionDate('High', new Date(Date.now() - 86400000 * 5)).formatted,
    beforeImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    afterImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    resolutionDescription: 'Waste cleared, dumpsters disinfected, and additional recycling bins installed.',
    resolvedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    citizenConfirmation: true,
    feedback: {
      rating: 5,
      comment: 'Super fast cleanup! Thanks to the sanitation team.'
    },
    activityTimeline: [
      { stage: 'Reported', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), note: 'Citizen reported issue.' },
      { stage: 'Verified', timestamp: new Date(Date.now() - 86400000 * 4.5).toISOString(), note: 'Verified hazard.' },
      { stage: 'Assigned to Sanitation', timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), note: 'Assigned to Supt. Vikram Singh.' },
      { stage: 'Work In Progress', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), note: 'Compactor dispatched.' },
      { stage: 'Resolution Submitted', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Waste cleared.' },
      { stage: 'Citizen Verified', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), note: 'Citizen confirmed resolution.' },
      { stage: 'Resolved', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), note: 'Complaint closed successfully.' }
    ]
  }
];

export const getReports = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REPORTS));
      return SEED_REPORTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading reports database:', err);
    return SEED_REPORTS;
  }
};

export const saveReport = (formData) => {
  const reports = getReports();
  const id = generateComplaintId();
  const createdAt = new Date().toISOString();
  const resolutionInfo = calculateResolutionDate(formData.severity);

  const category = formData.category || 'Road Damage';
  const confidence = formData.aiAnalysis ? formData.aiAnalysis.confidence : 94;
  const dept = getDepartmentForCategory(category);

  const newReport = {
    id,
    category,
    severity: formData.severity || 'Medium',
    description: formData.description,
    suggestedDepartment: dept,
    department: dept,
    assignedOfficer: 'Unassigned',
    location: {
      latitude: formData.location.latitude || 12.9716,
      longitude: formData.location.longitude || 77.5946,
      address: formData.location.address || 'Smart City Civic Zone'
    },
    images: formData.images.map(img => typeof img === 'string' ? img : img.url),
    status: 'Submitted',
    upvotes: 1,
    aiConfidence: confidence,
    aiTag: `AI Verified: ${category} (${confidence}% confidence)`,
    createdAt,
    expectedResolution: resolutionInfo.formatted,
    internalNotes: '',
    activityTimeline: [
      { stage: 'Reported', timestamp: createdAt, note: 'Citizen registered complaint.' }
    ]
  };

  const updated = [newReport, ...reports];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Trigger notification
  notifyReportSubmitted(id, category);

  return newReport;
};

export const supportReport = (reportId) => {
  const reports = getReports();
  const updated = reports.map(r => {
    if (r.id === reportId) {
      return { ...r, upvotes: (r.upvotes || 0) + 1 };
    }
    return r;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const updateReportStatus = (reportId, newStatus) => {
  const reports = getReports();
  const updated = reports.map(r => {
    if (r.id === reportId) {
      const now = new Date().toISOString();
      const currentTimeline = r.activityTimeline || [];
      const newTimeline = [...currentTimeline, { stage: newStatus, timestamp: now, note: `Status updated to ${newStatus}` }];
      return { ...r, status: newStatus, activityTimeline: newTimeline };
    }
    return r;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const updateAdminReportDetails = (reportId, payload) => {
  const reports = getReports();
  const updated = reports.map(r => {
    if (r.id === reportId) {
      const now = new Date().toISOString();
      const currentTimeline = r.activityTimeline || [];
      let newTimeline = [...currentTimeline];
      const prevStatus = r.status;

      if (payload.status && payload.status !== r.status) {
        let stageLabel = payload.status;
        if (payload.status === 'In Progress') stageLabel = 'Work In Progress';
        if (payload.status === 'Assigned') stageLabel = `Assigned to ${payload.department || r.department || 'Authority'}`;
        
        newTimeline.push({ 
          stage: stageLabel, 
          timestamp: now, 
          note: payload.internalNotes || `Status updated from ${prevStatus} to ${payload.status}` 
        });

        // Trigger notifications
        if (payload.status === 'Verified') notifyReportVerified(reportId);
        if (payload.status === 'Rejected') notifyReportRejected(reportId, payload.rejectedReason);
        if (payload.status === 'Assigned') notifyDepartmentAssigned(reportId, payload.department);
        if (payload.status === 'In Progress') notifyWorkStarted(reportId);
        if (payload.status === 'Resolved') notifyIssueResolved(reportId);
      }

      return {
        ...r,
        ...payload,
        activityTimeline: newTimeline
      };
    }
    return r;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

// Submit Authority Resolution Proof (Changes status to Resolution Submitted)
export const submitResolutionProof = (reportId, { afterImage, resolutionDescription, authorityOfficer }) => {
  const reports = getReports();
  const now = new Date().toISOString();

  const updated = reports.map(r => {
    if (r.id === reportId) {
      const beforeImage = (r.images && r.images.length > 0) ? r.images[0] : '';
      const currentTimeline = r.activityTimeline || [];
      
      const newTimeline = [
        ...currentTimeline,
        {
          stage: 'Resolution Submitted',
          timestamp: now,
          note: resolutionDescription || 'Authority submitted resolution proof.',
          author: authorityOfficer || r.assignedOfficer || 'Municipal Authority'
        }
      ];

      notifyResolutionSubmitted(reportId);

      return {
        ...r,
        status: 'Resolution Submitted',
        beforeImage: r.beforeImage || beforeImage,
        afterImage: afterImage || beforeImage,
        resolutionDescription: resolutionDescription || 'Issue marked repaired by authority.',
        activityTimeline: newTimeline
      };
    }
    return r;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

// Citizen Verification Sign-Off (Yes = Resolved, No = Reopened to In Progress)
export const verifyResolutionByCitizen = (reportId, { confirmed, feedback, reopenReason }) => {
  const reports = getReports();
  const now = new Date().toISOString();

  const updated = reports.map(r => {
    if (r.id === reportId) {
      const currentTimeline = r.activityTimeline || [];
      
      if (confirmed) {
        // YES -> Resolved
        const newTimeline = [
          ...currentTimeline,
          { stage: 'Citizen Verified', timestamp: now, note: 'Citizen confirmed resolution.' },
          { stage: 'Resolved', timestamp: now, note: 'Complaint closed successfully.' }
        ];

        notifyIssueResolved(reportId);

        return {
          ...r,
          status: 'Resolved',
          resolvedAt: now,
          citizenConfirmation: true,
          feedback: feedback || { rating: 5, comment: 'Resolved satisfactorily.' },
          activityTimeline: newTimeline
        };
      } else {
        // NO -> Reopened to In Progress
        const newTimeline = [
          ...currentTimeline,
          { 
            stage: 'Reopened by Citizen', 
            timestamp: now, 
            note: reopenReason ? `Citizen reported issue still exists: "${reopenReason}"` : 'Citizen reported issue still exists.' 
          },
          { stage: 'Work In Progress', timestamp: now, note: 'Returned to In Progress for authority re-inspection.' }
        ];

        notifyIssueReopened(reportId);

        return {
          ...r,
          status: 'In Progress',
          citizenConfirmation: false,
          reopenReason: reopenReason || 'Issue still exists on site.',
          reopenCount: (r.reopenCount || 0) + 1,
          activityTimeline: newTimeline
        };
      }
    }
    return r;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

// Permanently delete a complaint record from database
export const deleteReport = (reportId) => {
  try {
    const reports = getReports();
    const updated = reports.filter(r => r.id !== reportId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error deleting report from database:', err);
    throw err;
  }
};

