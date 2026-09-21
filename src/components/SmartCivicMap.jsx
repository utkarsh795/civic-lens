import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { getReports, supportReport } from '../services/db';
import { getCivicHotspots } from '../services/analyticsService';
import { CIVICLENS_CATEGORIES } from '../types/issue';
import { Filter, Search, Calendar, MapPin, ThumbsUp, CheckCircle2, ShieldAlert, Building2, Flame } from 'lucide-react';

const SEVERITY_COLORS = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#f59e0b',
  Low: '#10b981',
  Resolved: '#059669'
};

export default function SmartCivicMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const [reports, setReports] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [searchArea, setSearchArea] = useState('');
  const [showHotspots, setShowHotspots] = useState(true);

  useEffect(() => {
    setReports(getReports());
  }, []);

  const handleSupportClick = (id) => {
    const updated = supportReport(id);
    setReports(updated);
  };

  // Filter logic
  const filteredReports = reports.filter(r => {
    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;
    const matchesSeverity = severityFilter === 'All' || r.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesArea = !searchArea || r.location.address.toLowerCase().includes(searchArea.toLowerCase()) || r.id.toLowerCase().includes(searchArea.toLowerCase());

    let matchesDate = true;
    if (dateFilter === '7days') {
      const sevenDaysAgo = Date.now() - 86400000 * 7;
      matchesDate = new Date(r.createdAt).getTime() >= sevenDaysAgo;
    } else if (dateFilter === '30days') {
      const thirtyDaysAgo = Date.now() - 86400000 * 30;
      matchesDate = new Date(r.createdAt).getTime() >= thirtyDaysAgo;
    }

    return matchesCategory && matchesSeverity && matchesStatus && matchesArea && matchesDate;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([12.9716, 77.5946], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }
  }, []);

  // Update map markers when filteredReports or showHotspots change
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    // 1. Render Civic Hotspot Overlays
    if (showHotspots) {
      const hotspots = getCivicHotspots(reports);
      hotspots.forEach(hs => {
        if (!hs.isHotspot) return;

        const hotspotMarker = L.divIcon({
          className: 'civic-hotspot-pin',
          html: `
            <div style="
              background: rgba(239, 68, 68, 0.15);
              border: 2px solid ${hs.color};
              width: 54px;
              height: 54px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              animation: pulse-ring 2s infinite;
              box-shadow: 0 0 16px ${hs.color};
            ">
              <div style="
                background: ${hs.color};
                color: white;
                font-weight: 900;
                font-size: 11px;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              ">
                🔥
              </div>
            </div>
          `
        });

        const popupContent = `
          <div style="font-family: system-ui, sans-serif; padding: 4px; max-width: 220px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
              <span style="background: ${hs.color}; color: white; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 4px;">
                ${hs.level}
              </span>
            </div>
            <strong style="font-size: 14px; color: #0f172a;">${hs.name}</strong>
            <div style="margin-top: 6px; font-size: 12px; color: #475569; display: flex; flex-direction: column; gap: 3px;">
              <div>• <strong>${hs.totalReports}</strong> total complaints reported</div>
              <div>• <strong>${hs.criticalCount}</strong> critical safety hazards</div>
              <div>• <strong>${hs.breachCount}</strong> SLA deadline breaches</div>
              <div>• <strong>${hs.reopenedCount}</strong> repeated / reopened issues</div>
            </div>
          </div>
        `;

        L.marker([hs.latitude, hs.longitude], { icon: hotspotMarker })
          .bindPopup(popupContent)
          .addTo(layerGroupRef.current);
      });
    }

    // 2. Render Individual Incident Markers
    filteredReports.forEach(r => {
      const lat = r.location.latitude || 12.9716;
      const lng = r.location.longitude || 77.5946;
      const markerColor = r.status === 'Resolved' ? SEVERITY_COLORS.Resolved : (SEVERITY_COLORS[r.severity] || '#2563eb');

      const customIcon = L.divIcon({
        className: 'civic-marker-pin',
        html: `
          <div style="
            background: ${markerColor};
            width: 34px;
            height: 34px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 10px;
              height: 10px;
              background: white;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `
      });

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; padding: 4px; max-width: 240px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 11px; font-weight: 800; color: #64748b;">${r.id}</span>
            <span style="font-size: 11px; font-weight: 800; color: ${markerColor}; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">
              ${r.severity}
            </span>
          </div>
          <strong style="font-size: 13px; color: #0f172a; display: block; margin-bottom: 4px;">${r.category}</strong>
          <p style="font-size: 12px; color: #475569; margin: 0 0 6px 0; line-height: 1.3;">${r.description.substring(0, 80)}...</p>
          
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            📍 ${r.location.address}
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            <span style="font-size: 11px; color: #059669; font-weight: 700;">Status: ${r.status}</span>
            <span style="font-size: 11px; color: #4f46e5; font-weight: 800;">👍 ${r.upvotes || 0} Citizens</span>
          </div>
        </div>
      `;

      L.marker([lat, lng], { icon: customIcon })
        .bindPopup(popupContent)
        .addTo(layerGroupRef.current);
    });

  }, [filteredReports, showHotspots, reports]);

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={22} color="var(--primary)" /> Smart Civic Map & Hotspot Radar
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-time public map of urban issues with SLA tracking, duplicate detection, and civic hotspots.
          </p>
        </div>

        {/* Legend & Hotspot Toggle */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.75rem', fontWeight: 700 }}>
          <button 
            type="button" 
            onClick={() => setShowHotspots(prev => !prev)}
            style={{
              background: showHotspots ? '#ef4444' : 'var(--bg-subtle)',
              color: showHotspots ? 'white' : 'var(--text-muted)',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <Flame size={14} /> {showHotspots ? '🔥 Hotspots ON' : 'Show Hotspots'}
          </button>

          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: SEVERITY_COLORS.Critical }} /> Critical
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: SEVERITY_COLORS.High }} /> High
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: SEVERITY_COLORS.Medium }} /> Medium
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: SEVERITY_COLORS.Low }} /> Low
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: SEVERITY_COLORS.Resolved }} /> Resolved
          </span>
        </div>
      </div>

      {/* Map Filter Controls Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search area / street..." 
            value={searchArea}
            onChange={(e) => setSearchArea(e.target.value)}
            style={{ paddingLeft: '32px', padding: '6px 10px 6px 32px', fontSize: '0.85rem' }}
          />
        </div>

        <select 
          className="form-input"
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: '6px 10px', fontSize: '0.85rem' }}
        >
          <option value="All">All Categories</option>
          {CIVICLENS_CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>

        <select 
          className="form-input"
          value={severityFilter} 
          onChange={(e) => setSeverityFilter(e.target.value)}
          style={{ padding: '6px 10px', fontSize: '0.85rem' }}
        >
          <option value="All">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select 
          className="form-input"
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '6px 10px', fontSize: '0.85rem' }}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select 
          className="form-input"
          value={dateFilter} 
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ padding: '6px 10px', fontSize: '0.85rem' }}
        >
          <option value="All">All Time</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
      </div>

      {/* Leaflet Map Box */}
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '420px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}
      />
    </div>
  );
}
