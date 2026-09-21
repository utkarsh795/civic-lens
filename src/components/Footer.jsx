import React from 'react';
import { Eye, Heart, Globe, Share2, MessageSquare, Mail } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="civiclens-footer">
      <div className="footer-inner">
        {/* Brand column */}
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.2rem' }}>
            <div className="brand-badge-icon" style={{ width: '30px', height: '30px', borderRadius: '8px' }}>
              <Eye size={18} />
            </div>
            Civic<span style={{ color: 'var(--primary)' }}>Lens</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            “See a Problem. Report It. Get It Fixed.”<br />
            AI-powered Smart City civic issue reporting & transparent municipal resolution platform.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="footer-links-title">Quick Platform Navigation</h4>
          <ul className="footer-links">
            <li><a href="#report" onClick={(e) => { e.preventDefault(); onNavigate('report'); }}>Report New Civic Issue</a></li>
            <li><a href="#dashboard" onClick={(e) => { e.preventDefault(); onNavigate('citizen'); }}>Citizen Complaints Dashboard</a></li>
            <li><a href="#map" onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}>Public Civic Map</a></li>
            <li><a href="#admin" onClick={(e) => { e.preventDefault(); onNavigate('admin'); }}>Municipal Admin Command Center</a></li>
          </ul>
        </div>

        {/* Support & Legal */}
        <div>
          <h4 className="footer-links-title">Support & Legal</h4>
          <ul className="footer-links">
            <li><a href="#about" onClick={(e) => e.preventDefault()}>About Smart City Initiative</a></li>
            <li><a href="#contact" onClick={(e) => e.preventDefault()}>Contact Municipal Support</a></li>
            <li><a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy & Data Rights</a></li>
            <li><a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="footer-links-title">Connect & Social</h4>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <a href="https://civiclens.gov" target="_blank" rel="noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}>
              <Globe size={18} />
            </a>
            <a href="https://civiclens.gov/share" target="_blank" rel="noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}>
              <Share2 size={18} />
            </a>
            <a href="https://civiclens.gov/chat" target="_blank" rel="noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}>
              <MessageSquare size={18} />
            </a>
            <a href="mailto:support@civiclens.gov" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}>
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          © 2026 CivicLens Smart City Platform. All rights reserved.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Built for modern smart cities <Heart size={14} color="#ef4444" fill="#ef4444" />
        </div>
      </div>
    </footer>
  );
}
