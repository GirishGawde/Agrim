import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from 'react-leaflet';
import { Route, Search, Navigation, Clock, AlertTriangle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const SafeRoute = () => {
  const [destination, setDestination] = useState('');
  const [routeShown, setRouteShown] = useState(true);
  const position = [15.4909, 73.8278];

  const safeRouteCoords = [
    [15.4950, 73.8200],
    [15.4920, 73.8220],
    [15.4900, 73.8250],
    [15.4850, 73.8280]
  ];

  return (
    <div style={{ background: '#f3f4ee', minHeight: '100vh', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e0e2da', padding: '1.25rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: '#1a1a1a' }}>Find a Safe Route</h1>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
              <Search size={18} color="#aaa" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Enter destination (e.g. Panaji Community Hall)"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '8px', border: '1px solid #e0e2da', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#5cb82b'}
                onBlur={e => e.target.style.borderColor = '#e0e2da'}
              />
            </div>
            <button
              onClick={() => setRouteShown(true)}
              style={{ background: '#5cb82b', color: 'white', border: 'none', borderRadius: '8px', padding: '0.875rem 1.5rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}
            >
              <Route size={18} /> Get Safe Route
            </button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: '1100px', width: '100%', margin: '1.5rem auto', padding: '0 2rem', display: 'flex', gap: '1.5rem', boxSizing: 'border-box' }}>
        {/* Map */}
        <div style={{ flex: 1, minHeight: '560px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0e2da', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
          <MapContainer center={position} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {routeShown && (
              <>
                <Polyline positions={safeRouteCoords} color="#5cb82b" weight={6} opacity={0.85} dashArray="12, 4" />
                <CircleMarker center={safeRouteCoords[0]} radius={10} pathOptions={{ color: 'white', fillColor: '#5cb82b', fillOpacity: 1, weight: 3 }}>
                  <Popup>Start: Your Location</Popup>
                </CircleMarker>
                <CircleMarker center={safeRouteCoords[safeRouteCoords.length - 1]} radius={10} pathOptions={{ color: 'white', fillColor: '#3b82f6', fillOpacity: 1, weight: 3 }}>
                  <Popup>Destination: Community Hall</Popup>
                </CircleMarker>
              </>
            )}
            <CircleMarker center={[15.4920, 73.8270]} radius={18} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.3, weight: 2 }}>
              <Popup><strong>Road Blocked</strong><br />Waterlogging reported here</Popup>
            </CircleMarker>
          </MapContainer>
        </div>

        {/* Route Panel */}
        <div style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '1rem', flexShrink: 0 }}>
          {routeShown && (
            <div style={{ background: 'white', border: '1px solid #e0e2da', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#333', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Navigation size={16} color="#5cb82b" /> Route Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>Distance</span>
                  <strong style={{ fontSize: '0.85rem' }}>1.8 km</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>Est. Time</span>
                  <strong style={{ fontSize: '0.85rem', color: '#5cb82b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} /> 12 mins</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>Hazards Avoided</span>
                  <strong style={{ fontSize: '0.85rem', color: '#ef4444' }}>1 flood zone</strong>
                </div>
              </div>
              <div style={{ marginTop: '1rem', background: '#f0fce8', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.75rem', fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                ✓ Route is currently passable
              </div>
            </div>
          )}

          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={15} /> Active Blockages
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.6, margin: '0 0 0.5rem' }}>• NH-66 near Panaji bridge</p>
            <p style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.6, margin: 0 }}>• Patto junction underpass</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeRoute;
