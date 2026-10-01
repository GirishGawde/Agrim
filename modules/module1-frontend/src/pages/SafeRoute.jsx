import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from 'react-leaflet';
import { Route, Search, Navigation, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const SafeRoute = () => {
  const [destination, setDestination] = useState('');
  const [routeShown, setRouteShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [blockedRoads, setBlockedRoads] = useState([]);

  const position = [15.4989, 73.8278]; // User location (Patto, Panaji)

  // Fetch live blockages on mount
  useEffect(() => {
    fetch('http://127.0.0.1:8000/route/blocked-roads')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setBlockedRoads(data);
        } else {
          // Fallback hardcoded blockages for the demo if none exist
          setBlockedRoads([
            { id: 991, latitude: 15.4920, longitude: 73.8270, location: 'NH-66 near Panaji bridge', description: 'Waterlogging reported here', type: 'roadblock' },
            { id: 992, latitude: 15.4850, longitude: 73.8220, location: 'Patto junction underpass', description: 'Completely submerged', type: 'flood' }
          ]);
        }
      })
      .catch(err => {
        console.error("Error fetching blockages", err);
        setBlockedRoads([
          { id: 991, latitude: 15.4920, longitude: 73.8270, location: 'NH-66 near Panaji bridge', description: 'Waterlogging reported here', type: 'roadblock' },
          { id: 992, latitude: 15.4850, longitude: 73.8220, location: 'Patto junction underpass', description: 'Completely submerged', type: 'flood' }
        ]);
      });
  }, []);

  const handleGetRoute = () => {
    if (!destination.trim()) return;
    setLoading(true);
    setRouteShown(false);

    // Mock geocoding: If user types "ponda", use Ponda coordinates, otherwise use a generic point south of Panaji
    const isPonda = destination.toLowerCase().includes('ponda');
    const endLat = isPonda ? 15.4026 : 15.4800;
    const endLon = isPonda ? 74.0135 : 73.8200;

    // Pass blocked roads explicitly in case we are using the fallback data
    const blockedParams = blockedRoads.map(b => `${b.latitude},${b.longitude}`).join(';');
    const url = `http://127.0.0.1:8000/route/?start_lat=${position[0]}&start_lon=${position[1]}&end_lat=${endLat}&end_lon=${endLon}&auto_avoid=true&blocked=${blockedParams}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        // GeoJSON coordinates are [lon, lat], Leaflet wants [lat, lon]
        if (data.geometry && data.geometry.coordinates) {
          data.safeRouteCoords = data.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        } else {
          data.safeRouteCoords = [position, [endLat, endLon]]; // fallback
        }
        setRouteData(data);
        setRouteShown(true);
      })
      .catch(err => {
        console.error("Routing error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
                placeholder="Enter destination (e.g. Ponda)"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGetRoute()}
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem', borderRadius: '8px', border: '1px solid #e0e2da', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#5cb82b'}
                onBlur={e => e.target.style.borderColor = '#e0e2da'}
              />
            </div>
            <button
              onClick={handleGetRoute}
              disabled={loading}
              style={{ background: '#5cb82b', color: 'white', border: 'none', borderRadius: '8px', padding: '0.875rem 1.5rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Route size={18} />} 
              {loading ? 'Calculating...' : 'Get Safe Route'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: '1100px', width: '100%', margin: '1.5rem auto', padding: '0 2rem', display: 'flex', gap: '1.5rem', boxSizing: 'border-box' }}>
        {/* Map */}
        <div style={{ flex: 1, minHeight: '560px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0e2da', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {routeShown && routeData?.safeRouteCoords && (
              <>
                <Polyline positions={routeData.safeRouteCoords} color="#5cb82b" weight={6} opacity={0.85} dashArray="12, 4" />
                <CircleMarker center={routeData.safeRouteCoords[0]} radius={10} pathOptions={{ color: 'white', fillColor: '#5cb82b', fillOpacity: 1, weight: 3 }}>
                  <Popup>Start: Your Location</Popup>
                </CircleMarker>
                <CircleMarker center={routeData.safeRouteCoords[routeData.safeRouteCoords.length - 1]} radius={10} pathOptions={{ color: 'white', fillColor: '#3b82f6', fillOpacity: 1, weight: 3 }}>
                  <Popup>Destination: {destination}</Popup>
                </CircleMarker>
              </>
            )}

            {/* Dynamic Blocked Roads */}
            {blockedRoads.map(block => (
              <CircleMarker key={block.id || Math.random()} center={[block.latitude, block.longitude]} radius={15} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.3, weight: 2 }}>
                <Popup><strong>{block.location || 'Road Blocked'}</strong><br />{block.description || 'Hazard reported'}</Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Route Panel */}
        <div style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '1rem', flexShrink: 0 }}>
          {routeShown && routeData && (
            <div style={{ background: 'white', border: '1px solid #e0e2da', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#333', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Navigation size={16} color="#5cb82b" /> Route Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>Distance</span>
                  <strong style={{ fontSize: '0.85rem' }}>{routeData.distance_km || 0} km</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>Est. Time</span>
                  <strong style={{ fontSize: '0.85rem', color: '#5cb82b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} /> {routeData.duration_min || 0} mins</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>Hazards Avoided</span>
                  <strong style={{ fontSize: '0.85rem', color: '#ef4444' }}>{routeData.blocked_roads_avoided?.length || 0} zone(s)</strong>
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
            {blockedRoads.length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.6, margin: 0 }}>No active blockages reported.</p>
            ) : (
              blockedRoads.map((b, i) => (
                <p key={i} style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.6, margin: '0 0 0.5rem' }}>• {b.location || 'Unknown Road'}</p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeRoute;
