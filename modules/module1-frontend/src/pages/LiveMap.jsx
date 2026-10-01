import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const FILTERS = ['All', 'Flood Zones', 'Landslides', 'Shelters', 'Blocked Roads'];

const LiveMap = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [riskData, setRiskData] = useState({ risk_level: 'Loading...', reason: 'Fetching real-time predictions...' });
  const [mapMarkers, setMapMarkers] = useState([]);
  const position = [15.4909, 73.8278];

  useEffect(() => {
    // Fetch live risk prediction for Patto-Panaji (area_id = 1) from Module 2 Backend
    fetch('http://127.0.0.1:8000/risk/1')
      .then(res => res.json())
      .then(data => {
        setRiskData(data);
      })
      .catch(err => {
        console.error("Error fetching risk:", err);
        setRiskData({ risk_level: 'Unknown', reason: 'Failed to connect to risk service.' });
      });

    // Fetch active reports from backend
    fetch('http://127.0.0.1:8000/reports/')
      .then(res => res.json())
      .then(data => {
        // filter open/assigned reports with lat/lon
        const active = data.filter(r => (r.status === 'Open' || r.status === 'Assigned') && r.latitude && r.longitude);
        setMapMarkers(active);
      })
      .catch(err => console.error("Error fetching reports:", err));
  }, []);

  return (
    <div style={{ background: '#f3f4ee', minHeight: '100vh', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* Page Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e0e2da', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Live Hazard Map</h1>
            <p style={{ color: '#777', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>Real-time risk data — Panaji, Goa</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  border: `1px solid ${activeFilter === f ? '#5cb82b' : '#e0e2da'}`,
                  background: activeFilter === f ? '#5cb82b' : 'white',
                  color: activeFilter === f ? 'white' : '#555',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '1.5rem auto', padding: '0 2rem', display: 'flex', gap: '1.5rem', boxSizing: 'border-box' }}>
        {/* Map */}
        <div style={{ flex: 1, minHeight: '600px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0e2da', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Dynamic Markers from Backend */}
            {mapMarkers.map(marker => {
              const show = activeFilter === 'All' || 
                           (activeFilter === 'Flood Zones' && marker.type === 'flood') ||
                           (activeFilter === 'Landslides' && marker.type === 'landslide') ||
                           (activeFilter === 'Blocked Roads' && marker.type === 'roadblock') ||
                           (activeFilter === 'Fires' && marker.type === 'fire');
              if (!show) return null;
              
              let color = '#ef4444'; // default red
              if (marker.type === 'flood') color = '#3b82f6';
              if (marker.type === 'landslide') color = '#92400e';
              if (marker.type === 'roadblock') color = '#7c3aed';
              if (marker.type === 'fire') color = '#f26b1d';

              return (
                <CircleMarker key={marker.id} center={[marker.latitude, marker.longitude]} radius={12}
                  pathOptions={{ color: color, fillColor: color, fillOpacity: 0.6, weight: 2 }}>
                  <Popup><strong>{marker.location || marker.type.toUpperCase()}</strong><br />{marker.description}</Popup>
                </CircleMarker>
              );
            })}

            {/* Hardcoded Shelters (until shelter API is built) */}
            {(activeFilter === 'All' || activeFilter === 'Shelters') && (
              <Marker position={[15.4800, 73.8200]}>
                <Popup><strong>Community Hall</strong><br />Safe Shelter<br />Capacity: 50/200</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Side panel */}
        <div style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '1rem', flexShrink: 0 }}>
          {/* Legend */}
          <div style={{ background: 'white', border: '1px solid #e0e2da', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#333' }}>Legend</h3>
            {[
              { color: '#ef4444', label: 'High Flood Risk' },
              { color: '#f59e0b', label: 'Medium Flood Risk' },
              { color: '#7c3aed', label: 'Blocked Road' },
              { color: '#3b82f6', label: 'Shelter / Safe Zone' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: item.color, opacity: 0.7, flexShrink: 0 }} />
                <span style={{ fontSize: '0.83rem', color: '#555' }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Risk Summary (Live from Backend) */}
          <div style={{ 
            background: riskData.risk_level === 'High' ? '#fef2f2' : (riskData.risk_level === 'Medium' ? '#fffbeb' : '#f0fce8'), 
            border: `1px solid ${riskData.risk_level === 'High' ? '#fecaca' : (riskData.risk_level === 'Medium' ? '#fde68a' : '#bbf7d0')}`, 
            borderRadius: '12px', 
            padding: '1.25rem' 
          }}>
            <h3 style={{ 
              fontSize: '0.9rem', 
              fontWeight: 700, 
              color: riskData.risk_level === 'High' ? '#ef4444' : (riskData.risk_level === 'Medium' ? '#f59e0b' : '#5cb82b'), 
              marginBottom: '0.75rem',
              textTransform: 'uppercase'
            }}>
              ⚠ Current Risk: {riskData.risk_level}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.6, margin: 0 }}>
              {riskData.reason}
            </p>
          </div>

          {/* Reports count */}
          <div style={{ background: 'white', border: '1px solid #e0e2da', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#333', marginBottom: '1rem' }}>Today's Reports</h3>
            {[
              { label: 'Flood reports', count: mapMarkers.filter(m => m.type === 'flood').length, color: '#3b82f6' },
              { label: 'Road blocks', count: mapMarkers.filter(m => m.type === 'roadblock' || m.type === 'blocked_road').length, color: '#7c3aed' },
              { label: 'Fires', count: mapMarkers.filter(m => m.type === 'fire').length, color: '#f26b1d' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.83rem', color: '#666' }}>{r.label}</span>
                <span style={{ fontWeight: 700, color: r.color, background: `${r.color}15`, padding: '0.1rem 0.6rem', borderRadius: '9999px', fontSize: '0.82rem' }}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
