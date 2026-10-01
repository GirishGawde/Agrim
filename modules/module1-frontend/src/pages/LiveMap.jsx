import React, { useState } from 'react';
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
  const position = [15.4909, 73.8278];

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
            {(activeFilter === 'All' || activeFilter === 'Flood Zones') && (
              <>
                <Circle center={[15.4950, 73.8300]} radius={800}
                  pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.25, weight: 2 }}>
                  <Popup><strong>Patto Area</strong><br />High Flood Risk</Popup>
                </Circle>
                <Circle center={[15.4860, 73.8350]} radius={400}
                  pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.2, weight: 2 }}>
                  <Popup><strong>Miramar</strong><br />Medium Flood Risk</Popup>
                </Circle>
              </>
            )}
            {(activeFilter === 'All' || activeFilter === 'Shelters') && (
              <Marker position={[15.4800, 73.8200]}>
                <Popup><strong>Community Hall</strong><br />Safe Shelter<br />Capacity: 50/200</Popup>
              </Marker>
            )}
            {(activeFilter === 'All' || activeFilter === 'Blocked Roads') && (
              <CircleMarker center={[15.4920, 73.8270]} radius={12}
                pathOptions={{ color: '#7c3aed', fillColor: '#7c3aed', fillOpacity: 0.6, weight: 2 }}>
                <Popup><strong>NH-66 Block</strong><br />Road flooded, avoid area</Popup>
              </CircleMarker>
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

          {/* Risk Summary */}
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.75rem' }}>⚠ Current Risk: HIGH</h3>
            <p style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.6, margin: 0 }}>
              Patto-Panaji area is at high flood risk. 248mm rainfall recorded in last 6 hours. Predicted surge at 3PM.
            </p>
          </div>

          {/* Reports count */}
          <div style={{ background: 'white', border: '1px solid #e0e2da', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#333', marginBottom: '1rem' }}>Today's Reports</h3>
            {[
              { label: 'Flood reports', count: 5, color: '#3b82f6' },
              { label: 'Road blocks', count: 2, color: '#7c3aed' },
              { label: 'Fires', count: 0, color: '#f26b1d' },
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
