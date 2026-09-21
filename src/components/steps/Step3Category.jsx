import React from 'react';
import { CATEGORIES } from '../../types/issue';
import { 
  Construction, 
  Lightbulb, 
  Waves, 
  Trash2, 
  Droplets, 
  AlertTriangle, 
  Footprints, 
  Building2, 
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

const ICON_MAP = {
  Construction,
  Lightbulb,
  Waves,
  Trash2,
  Droplets,
  AlertTriangle,
  Footprints,
  Building2,
  HelpCircle
};

export default function Step3Category({ formData, updateFormData }) {
  const handleSelectCategory = (categoryId) => {
    updateFormData(prev => ({
      ...prev,
      category: categoryId
    }));
  };

  return (
    <div className="step-content">
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>
        Step 3 — Select Issue Category
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.95rem' }}>
        Choose the category that best describes the civic problem you are reporting.
      </p>

      <div className="category-grid">
        {CATEGORIES.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] || HelpCircle;
          const isSelected = formData.category === cat.id;

          return (
            <div 
              key={cat.id}
              className={`category-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelectCategory(cat.id)}
            >
              <div 
                className="category-icon-wrapper" 
                style={{ 
                  background: isSelected ? cat.color : `${cat.color}15`, 
                  color: isSelected ? '#ffffff' : cat.color 
                }}
              >
                <IconComponent size={24} />
              </div>

              <span style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
                {cat.label}
              </span>

              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.2' }}>
                {cat.desc}
              </span>

              {isSelected && (
                <div style={{ position: 'absolute', top: '8px', right: '8px', color: cat.color }}>
                  <CheckCircle2 size={18} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
