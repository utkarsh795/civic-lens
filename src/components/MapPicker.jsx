import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

// Custom Map Marker Icon styling to avoid default leaflet asset missing bug
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background: #4f46e5;
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36]
  });
};

export default function MapPicker({ location, onLocationChange }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const defaultLat = location.latitude || 12.9716;
  const defaultLng = location.longitude || 77.5946;

  // Initialize leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const marker = L.marker([defaultLat, defaultLng], {
        draggable: true,
        icon: createCustomIcon()
      }).addTo(map);

      // Handle marker drag
      marker.on('dragend', async () => {
        const position = marker.getLatLng();
        handleMapUpdate(position.lat, position.lng);
      });

      // Handle map click
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        handleMapUpdate(lat, lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map view when location prop changes from external buttons
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && location.latitude && location.longitude) {
      const { latitude, longitude } = location;
      markerRef.current.setLatLng([latitude, longitude]);
      mapInstanceRef.current.setView([latitude, longitude], 15);
    }
  }, [location.latitude, location.longitude]);

  // Reverse geocode lat & lng to address string
  const handleMapUpdate = async (lat, lng) => {
    let address = location.address || `Lat: ${lat.toFixed(4)}, Long: ${lng.toFixed(4)}`;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.display_name) {
          address = data.display_name;
        }
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
    }

    onLocationChange({
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6)),
      address
    });
  };

  return (
    <div className="map-picker-wrapper">
      <div 
        ref={mapContainerRef} 
        className="map-container-box" 
        style={{ width: '100%', height: '300px', borderRadius: '12px' }}
      />
      <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <MapPin size={14} color="var(--primary)" /> Click anywhere on map or drag pin to adjust location.
      </div>
    </div>
  );
}
