import React, { useState } from 'react';
import { AlignLeft, Mic, MicOff, Sparkles, Tag } from 'lucide-react';

const QUICK_SUGGESTIONS = [
  'Deep pothole causing traffic risk',
  'Water main leaking onto public road',
  'Street light completely non-functional',
  'Garbage overflow blocking sidewalk',
  'Broken drainage cover creating safety hazard',
  'Damaged traffic signal light'
];

export default function Step4Description({ formData, updateFormData }) {
  const [isListening, setIsListening] = useState(false);

  const handleTextChange = (e) => {
    updateFormData(prev => ({
      ...prev,
      description: e.target.value
    }));
  };

  const handleChipClick = (suggestion) => {
    const current = formData.description;
    const newText = current ? `${current}. ${suggestion}` : suggestion;
    updateFormData(prev => ({
      ...prev,
      description: newText
    }));
  };

  // Speech to text integration
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your description.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const current = formData.description;
        updateFormData(prev => ({
          ...prev,
          description: current ? `${current} ${transcript}` : transcript
        }));
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  const charCount = formData.description.length;

  return (
    <div className="step-content">
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>
        Step 4 — Provide Issue Description
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.95rem' }}>
        Provide details about the problem, specific landmarks, or immediate hazards.
      </p>

      {/* Quick Suggestion Chips */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="var(--primary)" /> Quick Suggestions (Click to add)
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {QUICK_SUGGESTIONS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              className="btn-option"
              onClick={() => handleChipClick(chip)}
              style={{ fontSize: '0.8rem', padding: '5px 10px', borderRadius: '16px' }}
            >
              <Tag size={12} /> {chip}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlignLeft size={16} color="var(--primary)" /> Detailed Description
          </label>
          <button 
            type="button" 
            className="btn-option" 
            onClick={toggleVoiceInput}
            style={{ 
              fontSize: '0.8rem', 
              padding: '4px 10px',
              background: isListening ? 'rgba(239, 68, 68, 0.15)' : undefined,
              color: isListening ? '#ef4444' : undefined
            }}
          >
            {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            {isListening ? 'Listening...' : 'Voice Input'}
          </button>
        </div>

        <textarea 
          className="form-textarea" 
          rows={5}
          placeholder="Describe the issue in detail (e.g., location specifics, size of damage, severity impact)..."
          value={formData.description}
          onChange={handleTextChange}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {charCount} characters
        </div>
      </div>
    </div>
  );
}
