import React from 'react';
import { CheckCircle2, Clock, MapPin, UserCheck, Wrench, Camera, CheckCheck, RefreshCw, XCircle } from 'lucide-react';

const STAGE_ICONS = {
  'Reported': Clock,
  'Submitted': Clock,
  'Verified': CheckCircle2,
  'Assigned': UserCheck,
  'Work Started': Wrench,
  'In Progress': Wrench,
  'Resolution Submitted': Camera,
  'Citizen Verified': CheckCheck,
  'Resolved': CheckCircle2,
  'Reopened by Citizen': RefreshCw,
  'Rejected': XCircle
};

export default function ActivityTimeline({ timeline = [] }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        No timeline events recorded yet.
      </div>
    );
  }

  return (
    <div style={{ padding: '12px 0' }}>
      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Clock size={16} color="var(--primary)" /> Activity & Verification Audit Timeline
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '20px' }}>
        
        {/* Continuous vertical line */}
        <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '7px', width: '2px', background: 'var(--border-color)' }} />

        {timeline.map((item, idx) => {
          const isFinal = idx === timeline.length - 1;
          const isReopen = item.stage.includes('Reopen');

          return (
            <div key={idx} style={{ position: 'relative', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              {/* Bullet Node */}
              <div style={{
                position: 'absolute',
                left: '-20px',
                top: '0',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: isReopen ? '#ef4444' : isFinal ? '#10b981' : 'var(--primary)',
                border: '2px solid white',
                boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.6rem'
              }} />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: isReopen ? '#ef4444' : 'var(--text-main)' }}>
                    {item.stage}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>

                {item.note && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {item.note} {item.author ? `— ${item.author}` : ''}
                  </div>
                )}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
