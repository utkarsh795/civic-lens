import React, { useState } from 'react';
import { loginUser, signupUser, setCurrentUser } from '../services/auth';
import { X, UserCheck, ShieldAlert, LogIn, UserPlus, Lock, Mail, User, Phone, MapPin, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [role, setRole] = useState('citizen'); // 'citizen' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (!email || !password) {
        setError('Please enter your email and password.');
        return;
      }
      const res = loginUser(email, password, role);
      onAuthSuccess(res.user);
      onClose();
    } else {
      if (!name || !email || !password) {
        setError('Please enter your full name, email, and password.');
        return;
      }
      const res = signupUser({ name, email, phone, city, role });
      onAuthSuccess(res.user);
      onClose();
    }
  };

  const handleDemoCitizen = () => {
    const user = {
      id: 'usr_citizen_101',
      name: 'Ananya Sharma',
      email: 'ananya.sharma@civiclens.org',
      phone: '+91 98765 43210',
      city: 'Lucknow',
      role: 'citizen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
    setCurrentUser(user);
    onAuthSuccess(user);
    onClose();
  };

  const handleDemoAdmin = () => {
    const user = {
      id: 'usr_admin_001',
      name: 'Eng. Rajesh Kumar (Chief Officer)',
      email: 'rajesh.kumar@municipal.gov.in',
      department: 'Public Works Department',
      role: 'admin',
      badgeNumber: 'PWD-OFFICER-442',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    };
    setCurrentUser(user);
    onAuthSuccess(user);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '24px',
        position: 'relative',
        animation: 'modalSlideUp 0.3s ease'
      }}>
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>

        {/* Role Toggle Selector */}
        <div style={{ display: 'flex', background: 'var(--bg-subtle)', borderRadius: '8px', padding: '4px', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => setRole('citizen')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: role === 'citizen' ? 'var(--bg-surface)' : 'transparent',
              color: role === 'citizen' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: role === 'citizen' ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserCheck size={16} /> Citizen Portal
          </button>

          <button
            type="button"
            onClick={() => setRole('admin')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: role === 'admin' ? 'var(--bg-surface)' : 'transparent',
              color: role === 'admin' ? '#ef4444' : 'var(--text-muted)',
              boxShadow: role === 'admin' ? 'var(--shadow-sm)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ShieldAlert size={16} /> Municipal Admin
          </button>
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '4px' }}>
          {role === 'admin' ? 'Municipal Officer Portal' : mode === 'login' ? 'Citizen Sign In' : 'Create Citizen Account'}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          {role === 'admin' ? 'Access municipal incident dispatch dashboard & SLA management' : 'Report urban hazards and track real-time resolution progress.'}
        </p>

        {/* Quick Demo Shortcuts */}
        <div style={{ background: 'var(--primary-light)', border: '1px solid rgba(79, 70, 229, 0.2)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={14} /> HACKATHON QUICK DEMO LOGIN:
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="button" 
              onClick={handleDemoCitizen}
              style={{ flex: 1, padding: '6px 10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
            >
              👤 Log In as Citizen
            </button>
            <button 
              type="button" 
              onClick={handleDemoAdmin}
              style={{ flex: 1, padding: '6px 10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
            >
              🛡️ Log In as Officer
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '14px' }}>
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'signup' && role === 'citizen' && (
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={14} /> Full Name
              </label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Ananya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={14} /> Email Address
            </label>
            <input 
              type="email" 
              className="form-input" 
              placeholder={role === 'admin' ? 'officer@municipal.gov.in' : 'name@example.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={14} /> Password
            </label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === 'signup' && role === 'citizen' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="+91 98765..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">City / Zone</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Lucknow"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="nav-cta-btn" 
            style={{ 
              marginTop: '6px', 
              justifyContent: 'center', 
              padding: '10px',
              background: role === 'admin' ? '#ef4444' : 'var(--primary)'
            }}
          >
            {mode === 'login' ? (
              <>
                <LogIn size={18} /> Sign In
              </>
            ) : (
              <>
                <UserPlus size={18} /> Complete Registration
              </>
            )}
          </button>
        </form>

        {/* Toggle Login vs Signup */}
        {role === 'citizen' && (
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {mode === 'login' ? (
              <span>
                Don't have a citizen account?{' '}
                <button 
                  type="button"
                  onClick={() => setMode('signup')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer' }}
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button 
                  type="button"
                  onClick={() => setMode('login')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer' }}
                >
                  Log In
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
