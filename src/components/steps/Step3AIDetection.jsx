import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

export default function Step3AIDetection({ formData, updateFormData, onNext }) {
  const [isScanning, setIsScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 25;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const firstImage = formData.images && formData.images.length > 0 
    ? formData.images[0].url 
    : 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="step-content">
      <div className="hero-pill" style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
        <Bot size={16} /> Automated AI Image Verification
      </div>

      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
        Step 3 — AI Computer Vision Scan
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.95rem' }}>
        CivicLens AI is analyzing your uploaded photo to verify issue authenticity, auto-categorize the hazard, and estimate severity.
      </p>

      {/* AI Scanner Container */}
      <div className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', alignItems: 'center' }}>
          
          {/* Photo being scanned */}
          <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '220px', border: '1px solid var(--border-color)' }}>
            <img 
              src={firstImage} 
              alt="Scan Evidence" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            {isScanning && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(37,99,235,0.4) 0%, rgba(37,99,235,0.05) 50%, rgba(37,99,235,0.4) 100%)',
                animation: 'scanPulse 1.5s infinite ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700
              }}>
                <div style={{ background: 'rgba(15,23,42,0.85)', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={18} color="var(--primary)" /> Scanning Neural Network... {scanProgress}%
                </div>
              </div>
            )}
          </div>

          {/* AI Findings Output */}
          <div>
            <div className="ai-scan-box" style={{ marginTop: 0 }}>
              <div className="ai-scan-header">
                <Sparkles size={18} color="var(--primary)" /> AI Vision Analysis Result
              </div>

              {isScanning ? (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Extracting feature vectors, validating geolocated hazard density, checking against municipal issue model...
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Detected Category:</span>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>
                      {formData.category || 'Road'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Confidence Score:</span>
                    <span style={{ fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={16} /> {formData.aiConfidence || 98}% Verified Match
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Recommended Severity:</span>
                    <span className="badge" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316', border: '1px solid #f97316' }}>
                      {formData.severity || 'High'} Priority
                    </span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <strong>Tag:</strong> {formData.aiTag || 'Automated Road Damage Classification'}
                  </div>
                </div>
              )}
            </div>

            {!isScanning && (
              <button 
                type="button" 
                className="btn-primary"
                onClick={onNext}
                style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}
              >
                Confirm AI Suggestion & Continue <ArrowRight size={18} />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
