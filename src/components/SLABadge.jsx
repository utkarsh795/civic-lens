import React from 'react';
import { getSLAStatus } from '../services/slaService';

export default function SLABadge({ report, style }) {
  if (!report) return null;

  const sla = getSLAStatus(report);

  return (
    <span 
      className="badge" 
      style={{
        background: sla.badgeBg,
        color: sla.badgeColor,
        border: `1px solid ${sla.badgeColor}`,
        fontSize: '0.75rem',
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        ...style
      }}
    >
      {sla.badgeText}
    </span>
  );
}
