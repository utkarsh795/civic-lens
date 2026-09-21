import React, { useState } from 'react';
import { Bot, Cpu, ShieldCheck, Edit3, Check, Sparkles, Building2 } from 'lucide-react';
import { AI_CATEGORIES, DEPARTMENT_MAP } from '../services/aiAnalysis';

export default function AIResultCard({ isAnalyzing, aiResult, onOverrideCategory }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isAnalyzing) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(79, 70, 229, 0.08))',
        border: '1px solid rgba(37, 99, 235, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        marginTop: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: 'var(--primary)',
        fontWeight: 700,
        fontSize: '0.95rem'
      }}>
        <Cpu className="spin" size={20} />
        <span>Analyzing image… Neural vision model processing evidence...</span>
      </div>
    );
  }

  if (!aiResult) return null;

  return (
    <div className="ai-scan-box" style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>
          <Bot size={20} /> 🤖 AI Analysis Result
        </div>

        <button 
          type="button" 
          className="btn-option" 
          onClick={() => setIsEditing(prev => !prev)}
          style={{ fontSize: '0.8rem', padding: '4px 10px' }}
        >
          <Edit3 size={13} /> {isEditing ? 'Done Overriding' : 'Override Category'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        
        {/* Category & Confidence */}
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Detected Category</div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span>{aiResult.category}</span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 6px', borderRadius: '10px', fontWeight: 700 }}>
              <ShieldCheck size={12} style={{ display: 'inline', marginRight: '2px' }} /> {aiResult.confidence}% confidence
            </span>
          </div>
        </div>

        {/* Severity */}
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Severity Priority</div>
          <div style={{ marginTop: '4px' }}>
            <span className="badge" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316', border: '1px solid #f97316' }}>
              Severity: {aiResult.severity}
            </span>
          </div>
        </div>

        {/* Department */}
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Suggested Department</div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <Building2 size={14} /> {aiResult.suggestedDepartment}
          </div>
        </div>

      </div>

      {/* Citizen Category Override dropdown if editing */}
      {isEditing && (
        <div style={{ marginTop: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            Correct AI Prediction (Select True Category):
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {AI_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn-option ${aiResult.category === cat ? 'active' : ''}`}
                onClick={() => {
                  onOverrideCategory(cat, DEPARTMENT_MAP[cat] || 'Public Works Department');
                  setIsEditing(false);
                }}
                style={{
                  fontSize: '0.8rem',
                  padding: '5px 10px',
                  background: aiResult.category === cat ? 'var(--primary)' : undefined,
                  color: aiResult.category === cat ? 'white' : undefined,
                  borderColor: aiResult.category === cat ? 'var(--primary)' : undefined
                }}
              >
                {cat === aiResult.category && <Check size={12} style={{ marginRight: '4px' }} />}
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
