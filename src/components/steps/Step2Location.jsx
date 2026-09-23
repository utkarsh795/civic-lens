import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import MapPicker from '../MapPicker';
import { getReports, supportReport } from '../../services/db';
import { detectNearbyDuplicates } from '../../services/duplicateDetector';
import DuplicateWarningCard from '../DuplicateWarningCard';

export default function Step2Location({ formData, updateFormData, onSupportSuccess }) {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [duplicateData, setDuplicateData] = useState(null);
  const [ignoreDuplicate, setIgnoreDuplicate] = useState(false);

  // Perform proximity check when location changes
  useEffect(() => {
    if (formData.location.latitude && formData.location.longitude && !ignoreDuplicate) {
      const reports = getReports();
      const match = detectNearbyDuplicates(formData.location, formData.category, formData.description, reports);
      setDuplicateData(match);
    }
  }, [formData.location.latitude, formData.location.longitude, formData.category, ignoreDuplicate]);

  // 1. Get current geolocation with automatic fallback
  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setLocationError('');

    const fallbackIPLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data.latitude && data.longitude) {
            const lat = parseFloat(data.latitude.toFixed(6));
            const lng = parseFloat(data.longitude.toFixed(6));
            const address = `${data.city || 'Central District'}, ${data.region || 'Municipal Zone'}, ${data.country_name || ''}`;
            updateFormData(prev => ({
              ...prev,
              location: { latitude: lat, longitude: lng, address }
            }));
            setIsLocating(false);
            return;
          }
        }
      } catch (e) {
        console.warn('IP location fallback failed:', e);
      }
      // Smart City Central Zone fallback
      const lat = 26.8467;
      const lng = 80.9462;
      const address = 'Lucknow Central Zone, Hazratganj, Ward 44';
      updateFormData(prev => ({
        ...prev,
        location: { latitude: lat, longitude: lng, address }
      }));
      setIsLocating(false);
    };

    if (!navigator.geolocation) {
      fallbackIPLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));
        let address = `Lat: ${lat}, Long: ${lng}`;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.display_name) {
              address = data.display_name;
            }
          }
        } catch (e) {
          console.warn('Geocoding lookup error:', e);
        }

        updateFormData(prev => ({
          ...prev,
          location: {
            latitude: lat,
            longitude: lng,
            address
          }
        }));
        setIsLocating(false);
      },
      (error) => {
        console.warn('Browser GPS permission denied or timed out, switching to smart location fallback:', error);
        fallbackIPLocation();
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
    );
  };

  // 2. Search address using Nominatim forward geocoding API
  const handleAddressSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setLocationError('');

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const firstResult = data[0];
          updateFormData(prev => ({
            ...prev,
            location: {
              latitude: parseFloat(firstResult.lat),
              longitude: parseFloat(firstResult.lon),
              address: firstResult.display_name
            }
          }));
        } else {
          setLocationError('Address not found. Please click location directly on map.');
        }
      }
    } catch (e) {
      setLocationError('Address search failed. Please use map pin picker.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleMapLocationChange = (newLoc) => {
    updateFormData(prev => ({
      ...prev,
      location: newLoc
    }));
  };

  const handleManualAddressChange = (e) => {
    const newAddress = e.target.value;
    updateFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        address: newAddress
      }
    }));
  };

  const handleSupportExisting = (reportId) => {
    supportReport(reportId);
    alert('Thank you! You have supported this existing report (+1 upvote). Municipal engineers have been notified.');
    if (onSupportSuccess) onSupportSuccess();
  };

  const hasLocation = formData.location.latitude && formData.location.longitude;

  return (
    <div className="step-content">
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
        Step 2 — Pin Location
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.95rem' }}>
        Specify where this issue is located using your GPS position, map pin, or street address.
      </p>

      {/* Action buttons bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <button 
          type="button" 
          className="btn-primary"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          style={{ padding: '10px 18px', fontSize: '0.9rem' }}
        >
          {isLocating ? <Loader2 size={18} className="spin" /> : <Navigation size={18} />}
          {isLocating ? 'Detecting GPS...' : 'Use Current Location'}
        </button>

        <form onSubmit={handleAddressSearch} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '260px' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search city, area, or landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px 14px' }}
          />
          <button type="submit" className="btn-secondary" disabled={isSearching}>
            {isSearching ? <Loader2 size={18} className="spin" /> : <Search size={18} />}
          </button>
        </form>
      </div>

      {locationError && (
        <div style={{
          padding: '10px 14px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#ef4444',
          fontSize: '0.85rem',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} /> {locationError}
        </div>
      )}

      {/* Interactive Map */}
      <MapPicker 
        location={formData.location} 
        onLocationChange={handleMapLocationChange} 
      />

      {/* Selected Location Form Details */}
      <div style={{ marginTop: '20px', background: 'var(--bg-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={16} color="var(--primary)" /> Selected Address / Details
          </label>
          {hasLocation && (
            <span style={{ fontSize: '0.75rem', background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
              <CheckCircle2 size={12} style={{ marginRight: '4px' }} /> Location Pin Set
            </span>
          )}
        </div>

        <textarea 
          className="form-textarea" 
          rows={2} 
          placeholder="Enter or edit street address / nearby landmark..."
          value={formData.location.address}
          onChange={handleManualAddressChange}
          style={{ minHeight: '60px' }}
        />

        <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span><strong>Lat:</strong> {formData.location.latitude ?? 'Not selected'}</span>
          <span><strong>Long:</strong> {formData.location.longitude ?? 'Not selected'}</span>
        </div>
      </div>

      {/* Duplicate Warning Card */}
      {duplicateData && !ignoreDuplicate && (
        <DuplicateWarningCard 
          duplicateData={duplicateData}
          onSupportExisting={handleSupportExisting}
          onContinueNewReport={() => setIgnoreDuplicate(true)}
        />
      )}
    </div>
  );
}
