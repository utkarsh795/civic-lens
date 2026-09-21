import React, { useState } from 'react';
import { Eye, PlusCircle, LayoutDashboard, Map, Menu, X, ShieldAlert, Home, HelpCircle, Globe, User, LogIn, Repeat, Bell } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

export default function Navbar({ activePage, setActivePage, reportCount, currentUser, onOpenAuth, onToggleRole }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Top Navigation Bar (Shown on screens < 900px) */}
      <header className="mobile-top-navbar">
        <div className="brand-logo" onClick={() => handleNavClick('landing')}>
          <div className="brand-badge-icon">
            <Eye size={20} />
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Civic<span style={{ color: 'var(--primary)' }}>Lens</span></span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <NotificationCenter onSelectComplaint={() => handleNavClick('citizen')} />
          <button 
            type="button" 
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div className="sidebar-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Fixed Vertical Left Sidebar */}
      <aside className={`civiclens-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        
        {/* 1. Sidebar Header / Logo Branding */}
        <div className="sidebar-brand" onClick={() => handleNavClick('landing')}>
          <div className="brand-badge-icon">
            <Eye size={22} />
          </div>
          <div>
            <div style={{ lineHeight: 1.1, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Civic<span style={{ color: 'var(--primary)' }}>Lens</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.5px', marginTop: '2px' }}>
              AI SMART CITY PORTAL
            </div>
          </div>
        </div>

        {/* 2. Navigation Items List */}
        <nav className="sidebar-nav-list">
          <button 
            type="button" 
            className={`sidebar-nav-btn ${activePage === 'landing' ? 'active' : ''}`}
            onClick={() => handleNavClick('landing')}
          >
            <Home size={18} /> <span>Home</span>
          </button>

          <button 
            type="button" 
            className={`sidebar-nav-btn ${activePage === 'transparency' ? 'active' : ''}`}
            onClick={() => handleNavClick('transparency')}
          >
            <Globe size={18} /> <span>Transparency Portal</span>
          </button>

          <button 
            type="button" 
            className="sidebar-nav-btn"
            onClick={() => {
              handleNavClick('landing');
              setTimeout(() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          >
            <HelpCircle size={18} /> <span>How It Works</span>
          </button>

          <button 
            type="button" 
            className="sidebar-nav-btn"
            onClick={() => {
              handleNavClick('landing');
              setTimeout(() => {
                const el = document.getElementById('public-map');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          >
            <Map size={18} /> <span>Explore Issues</span>
          </button>

          <button 
            type="button" 
            className={`sidebar-nav-btn ${activePage === 'citizen' ? 'active' : ''}`}
            onClick={() => handleNavClick('citizen')}
          >
            <LayoutDashboard size={18} /> <span>Citizen Dashboard</span>
            {reportCount > 0 && (
              <span className="sidebar-badge-count">
                {reportCount}
              </span>
            )}
          </button>

          <button 
            type="button" 
            className={`sidebar-nav-btn sidebar-admin-btn ${activePage === 'admin' ? 'active' : ''}`}
            onClick={() => handleNavClick('admin')}
          >
            <ShieldAlert size={18} /> <span>Admin Panel</span>
          </button>

          {/* Desktop Notification Item inside Sidebar */}
          <div className="sidebar-notification-item">
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bell size={18} color="var(--primary)" /> <span>Notifications</span>
            </span>
            <NotificationCenter onSelectComplaint={() => handleNavClick('citizen')} />
          </div>
        </nav>

        {/* 3. Flexible Spacer */}
        <div style={{ flex: 1, minHeight: '20px' }} />

        {/* 4. User Profile & Role Switcher Section */}
        <div className="sidebar-user-section">
          {currentUser ? (
            <button 
              type="button"
              className="sidebar-user-card"
              onClick={onToggleRole}
              title={`Switch Role (Current: ${currentUser.role})`}
            >
              <div className="sidebar-user-avatar">
                {currentUser.role === 'admin' ? <ShieldAlert size={16} color="#ef4444" /> : <User size={16} color="var(--primary)" />}
              </div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">
                  {currentUser.role === 'admin' ? 'Official' : 'Citizen'}
                </div>
                <div className="sidebar-user-role">
                  {currentUser.role === 'admin' ? 'Official Mode' : 'Citizen Mode'}
                </div>
              </div>
              <Repeat size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />
            </button>
          ) : (
            <button 
              type="button" 
              className="sidebar-signin-btn"
              onClick={onOpenAuth}
            >
              <LogIn size={16} /> <span>Sign In / Register</span>
            </button>
          )}
        </div>

        {/* 5. Report Issue Full-Width CTA Button */}
        <div className="sidebar-cta-wrapper">
          <button 
            type="button" 
            className="sidebar-cta-btn"
            onClick={() => handleNavClick('report')}
          >
            <PlusCircle size={18} /> Report Issue
          </button>
        </div>
      </aside>
    </>
  );
}
