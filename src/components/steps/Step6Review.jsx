import React from 'react';
import { Camera, MapPin, Grid, AlignLeft, ShieldAlert, Edit2, Calendar } from 'lucide-react';
import { SEVERITIES } from '../../types/issue';
import { calculateResolutionDate } from '../../services/db';

export default function Step6Review({ formData, onJumpToStep }) {
  const selectedSev = SEVERITIES.find(s => s.id === formData.severity) || SEVERITIES[1];
  const resolutionInfo = calculateResolutionDate(formData.severity);

  return (
    <div className="step-content">
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>
        Step 6 — Review Report Details
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.95rem' }}>
        Please verify all details before final submission. Click any edit icon to modify.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Photos section */}
        <div className="glass-card" style={{ padding: '16px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Camera size={18} color="var(--primary)" /> Evidence Photos ({formData.images.length})
            </h4>
            <button 
              type="button" 
              className="btn-option" 
              onClick={() => onJumpToStep(1)}
              style={{ fontSize: '0.8rem', padding: '4px 10px' }}
            >
              <Edit2 size={13} /> Edit
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
            {formData.images.map((img) => (
              <img 
                key={img.id} 
                src={img.url} 
                alt="Evidence" 
                style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }} 
              />
            ))}
          </div>
        </div>

        {/* Category & Severity section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '16px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Grid size={18} color="var(--primary)" /> Category
              </h4>
              <button 
                type="button" 
                className="btn-option" 
                onClick={() => onJumpToStep(3)}
                style={{ fontSize: '0.8rem', padding: '4px 10px' }}
              >
                <Edit2 size={13} /> Edit
              </button>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>
              {formData.category || 'Not selected'}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '16px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={18} color={selectedSev.color} /> Severity & SLA
              </h4>
              <button 
                type="button" 
                className="btn-option" 
                onClick={() => onJumpToStep(5)}
                style={{ fontSize: '0.8rem', padding: '4px 10px' }}
              >
                <Edit2 size={13} /> Edit
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge" style={{ background: selectedSev.bgColor, color: selectedSev.color, border: `1px solid ${selectedSev.color}` }}>
                {selectedSev.label} Priority
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Target: {resolutionInfo.formatted}
              </span>
            </div>
          </div>
        </div>

        {/* Location section */}
        <div className="glass-card" style={{ padding: '16px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="var(--primary)" /> Issue Location
            </h4>
            <button 
              type="button" 
              className="btn-option" 
              onClick={() => onJumpToStep(2)}
              style={{ fontSize: '0.8rem', padding: '4px 10px' }}
            >
              <Edit2 size={13} /> Edit
            </button>
          </div>
          <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>
            {formData.location.address || 'Address not specified'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Coordinates: {formData.location.latitude ?? 'N/A'}, {formData.location.longitude ?? 'N/A'}
          </div>
        </div>

        {/* Description section */}
        <div className="glass-card" style={{ padding: '16px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlignLeft size={18} color="var(--primary)" /> Issue Description
            </h4>
            <button 
              type="button" 
              className="btn-option" 
              onClick={() => onJumpToStep(4)}
              style={{ fontSize: '0.8rem', padding: '4px 10px' }}
            >
              <Edit2 size={13} /> Edit
            </button>
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
            {formData.description}
          </p>
        </div>

      </div>
    </div>
  );
}
