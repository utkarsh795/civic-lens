import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, Eye, Plus, AlertCircle, Video, X } from 'lucide-react';
import { analyzeCivicImage } from '../../services/aiAnalysis';
import AIResultCard from '../AIResultCard';

export default function Step1UploadEvidence({ formData, updateFormData }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  
  const [isDragActive, setIsDragActive] = useState(false);
  const [showWebcamModal, setShowWebcamModal] = useState(false);
  const [previewImageModal, setPreviewImageModal] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Trigger AI analysis on uploaded image
  const runAIAnalysis = async (fileObj) => {
    setIsAnalyzing(true);
    try {
      const res = await analyzeCivicImage(fileObj);
      updateFormData(prev => ({
        ...prev,
        aiAnalysis: res,
        category: res.category,
        severity: res.severity,
        suggestedDepartment: res.suggestedDepartment,
        description: prev.description || res.description
      }));
    } catch (err) {
      console.warn('AI analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle file selections
  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).filter(file => file.type.startsWith('image/'));
    
    newFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageObj = {
          id: Date.now() + Math.random().toString(36).substring(2, 9),
          name: file.name,
          url: e.target.result,
          size: (file.size / 1024).toFixed(1) + ' KB'
        };

        updateFormData(prev => ({
          ...prev,
          images: [...prev.images, imageObj]
        }));

        // Run AI analysis on the first uploaded photo
        if (index === 0) {
          runAIAnalysis(imageObj);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (idToRemove) => {
    updateFormData(prev => {
      const remaining = prev.images.filter(img => img.id !== idToRemove);
      return {
        ...prev,
        images: remaining,
        aiAnalysis: remaining.length === 0 ? null : prev.aiAnalysis
      };
    });
  };

  const handleOverrideCategory = (newCategory, newDept) => {
    updateFormData(prev => ({
      ...prev,
      category: newCategory,
      suggestedDepartment: newDept,
      aiAnalysis: prev.aiAnalysis ? { ...prev.aiAnalysis, category: newCategory, suggestedDepartment: newDept } : null
    }));
  };

  // Web Camera Modal trigger
  const startCamera = async () => {
    try {
      setShowWebcamModal(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera stream fallback to input:', err);
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
      setShowWebcamModal(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowWebcamModal(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');

    const snapObj = {
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      name: `camera-snap-${Date.now()}.jpg`,
      url: dataUrl,
      size: 'Snapshot'
    };

    updateFormData(prev => ({
      ...prev,
      images: [...prev.images, snapObj]
    }));

    runAIAnalysis(snapObj);
    stopCamera();
  };

  return (
    <div className="step-content">
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
        Step 1 — Upload Evidence Photos
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.95rem' }}>
        Capture or upload photos of the civic issue. At least <strong style={{ color: 'var(--text-main)' }}>1 photo is required</strong>.
      </p>

      {/* Hidden file inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        multiple 
        accept="image/*" 
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      <input 
        type="file" 
        ref={cameraInputRef} 
        accept="image/*" 
        capture="environment" 
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Dropzone Area */}
      <div 
        className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <Upload className="dropzone-icon" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>
          Drag & Drop photos here, or browse
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Supports PNG, JPG, WEBP formats (Upload multiple photos if available)
        </p>

        <div className="dropzone-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            type="button" 
            className="btn-browse-files" 
            onClick={() => fileInputRef.current.click()}
          >
            <Upload size={18} /> Browse Files
          </button>
          
          <button 
            type="button" 
            className="btn-take-photo" 
            onClick={startCamera}
          >
            <Camera size={18} /> Take Photo (Camera)
          </button>
        </div>
      </div>

      {/* Validation warning if empty */}
      {formData.images.length === 0 && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={20} />
          <span>Please upload or capture at least one evidence image to proceed.</span>
        </div>
      )}

      {/* Image Preview Grid */}
      {formData.images.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>
              Attached Photos ({formData.images.length})
            </h4>
            <button 
              type="button" 
              className="btn-option"
              onClick={() => fileInputRef.current.click()}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <Plus size={14} /> Add More
            </button>
          </div>

          <div className="image-grid">
            {formData.images.map((img) => (
              <div key={img.id} className="image-card">
                <img src={img.url} alt={img.name} />
                <div className="image-card-overlay">
                  <button 
                    type="button" 
                    className="btn-icon-view" 
                    title="View Image"
                    onClick={() => setPreviewImageModal(img)}
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    type="button" 
                    className="btn-icon-danger" 
                    title="Remove Image"
                    onClick={() => handleRemoveImage(img.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* AI Result Card Display */}
          <AIResultCard 
            isAnalyzing={isAnalyzing}
            aiResult={formData.aiAnalysis}
            onOverrideCategory={handleOverrideCategory}
          />
        </div>
      )}

      {/* Camera Live Modal */}
      {showWebcamModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Video size={20} color="var(--primary)" /> Camera Capture
              </h3>
              <button type="button" onClick={stopCamera} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#000', borderRadius: '12px', overflow: 'hidden', height: '280px', marginBottom: '16px' }}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button type="button" className="btn-secondary" onClick={stopCamera}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={capturePhoto}>
                <Camera size={18} /> Snap Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Fullscreen Modal */}
      {previewImageModal && (
        <div className="modal-overlay" onClick={() => setPreviewImageModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontWeight: 700 }}>{previewImageModal.name}</h4>
              <button type="button" onClick={() => setPreviewImageModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>
            <img 
              src={previewImageModal.url} 
              alt="Full Preview" 
              style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px' }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
