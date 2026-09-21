// CivicLens Auth & Role-Based Access Control Service

const AUTH_KEY = 'civiclens_user_session_v1';

const DEFAULT_CITIZEN = {
  id: 'usr_citizen_101',
  name: 'Ananya Sharma',
  email: 'ananya.sharma@civiclens.org',
  phone: '+91 98765 43210',
  city: 'Lucknow',
  role: 'citizen', // 'citizen' | 'admin'
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
};

const DEFAULT_ADMIN = {
  id: 'usr_admin_001',
  name: 'Eng. Rajesh Kumar (Chief Officer)',
  email: 'rajesh.kumar@municipal.gov.in',
  department: 'Public Works Department',
  role: 'admin',
  badgeNumber: 'PWD-OFFICER-442',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
};

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return DEFAULT_CITIZEN;
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_CITIZEN;
  }
}

export function setCurrentUser(userObj) {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(userObj));
    return userObj;
  } catch (e) {
    return userObj;
  }
}

export function loginUser(email, password, role = 'citizen') {
  if (role === 'admin' || email.includes('admin') || email.includes('gov')) {
    const user = { ...DEFAULT_ADMIN, email: email || DEFAULT_ADMIN.email };
    setCurrentUser(user);
    return { success: true, user };
  }

  const user = {
    id: `usr_${Date.now()}`,
    name: email.split('@')[0].replace('.', ' ').toUpperCase() || 'Citizen User',
    email,
    phone: '+91 98765 00000',
    city: 'Central District',
    role: 'citizen',
    avatar: DEFAULT_CITIZEN.avatar
  };
  setCurrentUser(user);
  return { success: true, user };
}

export function signupUser({ name, email, phone, city, role = 'citizen' }) {
  const user = {
    id: `usr_${Date.now()}`,
    name,
    email,
    phone: phone || '+91 98765 12345',
    city: city || 'Municipal Zone',
    role,
    avatar: role === 'admin' ? DEFAULT_ADMIN.avatar : DEFAULT_CITIZEN.avatar
  };
  setCurrentUser(user);
  return { success: true, user };
}

export function logoutUser() {
  localStorage.removeItem(AUTH_KEY);
  return DEFAULT_CITIZEN;
}

export function toggleUserRole() {
  const current = getCurrentUser();
  if (current.role === 'admin') {
    setCurrentUser(DEFAULT_CITIZEN);
    return DEFAULT_CITIZEN;
  } else {
    setCurrentUser(DEFAULT_ADMIN);
    return DEFAULT_ADMIN;
  }
}
