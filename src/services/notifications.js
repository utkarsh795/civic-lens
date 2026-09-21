/**
 * In-App Citizen Notification Center Service
 * 
 * Manages citizen notifications for 8 lifecycle events:
 * 1. Report submitted
 * 2. Report verified
 * 3. Report rejected
 * 4. Department assigned
 * 5. Work started
 * 6. Resolution submitted
 * 7. Issue resolved
 * 8. Issue reopened
 */

const NOTIF_STORAGE_KEY = 'civiclens_notifications_v1';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    complaintId: 'CL-2026-94812',
    type: 'WORK_STARTED',
    title: '🔧 Repair Work Started',
    message: 'Public Works crew has been dispatched to begin repair on your reported Pothole Hazard at MG Road.',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    isRead: false
  },
  {
    id: 'notif-2',
    complaintId: 'CL-2026-41903',
    type: 'RESOLUTION_SUBMITTED',
    title: '📸 Resolution Submitted — Verification Needed',
    message: 'Electrical division has submitted repair proof for Street Light #42. Please verify if fixed.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    isRead: false
  },
  {
    id: 'notif-3',
    complaintId: 'CL-2026-78210',
    type: 'RESOLVED',
    title: '✅ Issue Resolved & Closed',
    message: 'Your report CL-2026-78210 for Garbage Overflow has been confirmed resolved. Thank you!',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    isRead: true
  }
];

export const getNotifications = () => {
  try {
    const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading notifications:', err);
    return INITIAL_NOTIFICATIONS;
  }
};

export const addNotification = ({ complaintId, type, title, message }) => {
  const current = getNotifications();
  const newNotif = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    complaintId,
    type,
    title,
    message,
    timestamp: new Date().toISOString(),
    isRead: false
  };

  const updated = [newNotif, ...current];
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const markNotificationRead = (id) => {
  const current = getNotifications();
  const updated = current.map(n => n.id === id ? { ...n, isRead: true } : n);
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const markAllNotificationsRead = () => {
  const current = getNotifications();
  const updated = current.map(n => ({ ...n, isRead: true }));
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const getUnreadCount = () => {
  const current = getNotifications();
  return current.filter(n => !n.isRead).length;
};

// 8 Event Notification Triggers
export const notifyReportSubmitted = (complaintId, category = '') => {
  addNotification({
    complaintId,
    type: 'SUBMITTED',
    title: '📝 Complaint Submitted',
    message: `Your report ${complaintId} for ${category || 'civic issue'} has been registered with CivicLens.`
  });
};

export const notifyReportVerified = (complaintId) => {
  addNotification({
    complaintId,
    type: 'VERIFIED',
    title: '🔍 Report Verified',
    message: `Report ${complaintId} has been verified by AI and municipal inspection.`
  });
};

export const notifyReportRejected = (complaintId, reason = '') => {
  addNotification({
    complaintId,
    type: 'REJECTED',
    title: '❌ Report Rejected',
    message: `Report ${complaintId} was rejected: ${reason || 'Does not meet municipal triage policy.'}`
  });
};

export const notifyDepartmentAssigned = (complaintId, department = '') => {
  addNotification({
    complaintId,
    type: 'ASSIGNED',
    title: '🏢 Department Assigned',
    message: `Report ${complaintId} has been assigned to ${department || 'Public Works'}.`
  });
};

export const notifyWorkStarted = (complaintId) => {
  addNotification({
    complaintId,
    type: 'WORK_STARTED',
    title: '🔧 Repair Work In Progress',
    message: `Municipal repair crew has dispatched to site for report ${complaintId}.`
  });
};

export const notifyResolutionSubmitted = (complaintId) => {
  addNotification({
    complaintId,
    type: 'RESOLUTION_SUBMITTED',
    title: '📸 Resolution Submitted',
    message: `Authority submitted repair proof for ${complaintId}. Please sign off if fixed.`
  });
};

export const notifyIssueResolved = (complaintId) => {
  addNotification({
    complaintId,
    type: 'RESOLVED',
    title: '✅ Issue Resolved',
    message: `Report ${complaintId} has been confirmed resolved and closed. Thank you!`
  });
};

export const notifyIssueReopened = (complaintId) => {
  addNotification({
    complaintId,
    type: 'REOPENED',
    title: '🔄 Issue Reopened',
    message: `Report ${complaintId} was reopened and returned to In Progress for re-inspection.`
  });
};
