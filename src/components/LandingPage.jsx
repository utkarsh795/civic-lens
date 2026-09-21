import React from 'react';
import { CIVICLENS_CATEGORIES } from '../types/issue';
import Footer from './Footer';
import SmartCivicMap from './SmartCivicMap';
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle2, 
  Camera, 
  Construction, 
  Lightbulb, 
  Waves, 
  Trash2, 
  Droplets, 
  AlertTriangle, 
  Building2, 
  Footprints,
  HelpCircle,
  Eye
} from 'lucide-react';

const CATEGORY_ICONS = {
  'Road Damage': Construction,
  Road: Construction,
  'Street Light': Lightbulb,
  Drainage: Waves,
  Garbage: Trash2,
  'Water Leakage': Droplets,
  Water: Droplets,
  'Traffic Signal': AlertTriangle,
  Traffic: AlertTriangle,
  Footpath: Footprints,
  'Public Infrastructure': Building2,
  Infrastructure: Building2,
  Other: HelpCircle
};

export default function LandingPage({ onReportClick, onTrackClick }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div>
          <div className="hero-pill">
            <Sparkles size={16} /> AI-Powered Smart City Civic Platform
          </div>

          <h1 className="hero-title">
            <span style={{ color: 'var(--primary)', background: 'linear-gradient(135deg, #2563eb, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              One Photo
            </span> Can Make a<br />
            <span style={{ color: 'var(--primary)', background: 'linear-gradient(135deg, #2563eb, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              City Safer.
            </span>
          </h1>

          <p className="hero-subtitle">
            CivicLens empowers citizens and municipal authorities to detect, verify, and resolve urban issues with AI image verification, real-time GPS tracking, and transparent SLA response times.
          </p>

          <div className="hero-actions">
            <button type="button" className="btn-primary" onClick={onReportClick} style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
              Report an Issue <ArrowRight size={20} />
            </button>
            
            <button type="button" className="btn-secondary" onClick={onTrackClick} style={{ padding: '14px 24px', fontSize: '1.05rem' }}>
              Track Complaint
            </button>
          </div>
        </div>

        {/* Smart City Visual Interactive Card */}
        <div className="smartcity-visual-card">
          <div className="smartcity-grid-bg" />
          
          <div className="smartcity-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
              <Eye size={20} color="var(--primary)" /> Smart City Grid Monitor
            </div>
            <div className="live-pulse">
              <div className="pulse-dot" /> LIVE INCIDENT FEED
            </div>
          </div>

          {/* Simulated live active civic markers feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', zIndex: 2 }}>
            
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '12px 16px', borderRadius: '10px', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#ef4444', padding: '6px', borderRadius: '8px' }}><Construction size={18} color="white" /></div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>CL-2026-94812 • Pothole Hazard</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>MG Road • Verified by AI Vision</div>
                </div>
              </div>
              <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>Critical</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '12px 16px', borderRadius: '10px', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#f59e0b', padding: '6px', borderRadius: '8px' }}><Lightbulb size={18} color="white" /></div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>CL-2026-41903 • Street Light Outage</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Koramangala 4th Block</div>
                </div>
              </div>
              <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>In Progress</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '12px 16px', borderRadius: '10px', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#10b981', padding: '6px', borderRadius: '8px' }}><Trash2 size={18} color="white" /></div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>CL-2026-78210 • Waste Cleared</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Indiranagar Ward 80</div>
                </div>
              </div>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>Resolved</span>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-tag">STREAMLINED 4-STEP PROCESS</div>
        <h2 className="section-heading">How CivicLens Works</h2>

        <div className="works-grid">
          <div className="work-step-card">
            <span className="work-step-num">01</span>
            <div className="work-step-emoji">📸</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>1. Snap Photo</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Capture a quick evidence photo of the issue using your phone camera or file upload.
            </p>
          </div>

          <div className="work-step-card">
            <span className="work-step-num">02</span>
            <div className="work-step-emoji">📍</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>2. Pin Location</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Use instant GPS location detection or pin exact spot on the interactive map.
            </p>
          </div>

          <div className="work-step-card">
            <span className="work-step-num">03</span>
            <div className="work-step-emoji">🤖</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>3. AI Verification</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              CivicLens AI verifies image, classifies category, and prioritizes severity SLA target.
            </p>
          </div>

          <div className="work-step-card">
            <span className="work-step-num">04</span>
            <div className="work-step-emoji">✅</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>4. Fast Resolution</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Dispatched directly to ward engineers with live progress tracking until fixed.
            </p>
          </div>
        </div>
      </section>

      {/* Issue Categories Grid */}
      <section style={{ margin: '48px 0' }}>
        <div className="section-tag">CIVIC ISSUE TYPES</div>
        <h2 className="section-heading" style={{ marginBottom: '16px' }}>Report Common Urban Hazards</h2>

        <div className="categories-grid">
          {CIVICLENS_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || HelpCircle;
            return (
              <div 
                key={cat.id} 
                className="category-tile"
                onClick={onReportClick}
              >
                <div style={{ background: `${cat.color}15`, color: cat.color, padding: '10px', borderRadius: '10px' }}>
                  <Icon size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{cat.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Public Smart Civic Map Section */}
      <section id="public-map" style={{ margin: '48px 0' }}>
        <div className="section-tag">SMART CITY MONITOR</div>
        <h2 className="section-heading" style={{ marginBottom: '16px' }}>Public Smart Civic Map</h2>

        <SmartCivicMap />
      </section>

      {/* Footer */}
      <Footer onNavigate={onReportClick} />
    </div>
  );
}
