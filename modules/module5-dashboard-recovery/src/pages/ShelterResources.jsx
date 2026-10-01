/**
 * ShelterResources — Leaflet map + table of shelters and community resources.
 * Availability toggles for resources (authority/volunteer only).
 * Enhanced with Inspira UI: AnimatedCircularProgress, GlowCard.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { getResources, patchResource } from '../services/api.js';
import { MOCK_SHELTERS } from '../services/mockData.js';
import { EmptyState, ErrorState, Skeleton } from '../components/ui/States.jsx';
import {
  Anchor, Car, Droplets, Home, HeartPulse, ToggleLeft, ToggleRight,
  Users, MapPin, Layers, TrendingUp, AlertTriangle, ShieldCheck, Zap
} from 'lucide-react';
import { AnimatedCircularProgress, NumberTicker, CardSpotlight } from '../components/inspira/index.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const TYPE_META = {
  boat:       { label: 'Rescue Boat',  icon: Anchor,    color: '#3b82f6' },
  vehicle:    { label: '4x4 Vehicle',  icon: Car,       color: '#a855f7' },
  water_tank: { label: 'Water Tank',   icon: Droplets,  color: '#06b6d4' },
  spare_room: { label: 'Spare Room',   icon: Home,      color: '#f59e0b' },
  first_aid:  { label: 'First Aid Kit',icon: HeartPulse,color: '#10b981' },
};

function OccupancyBar({ capacity, occupancy }) {
  const pct = capacity > 0 ? Math.min(100, Math.round((occupancy / capacity) * 100)) : 0;
  const colour = pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="w-full mt-1.5">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>Occupancy: <strong>{occupancy}</strong> / {capacity}</span>
        <span className="font-semibold">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className={`h-full rounded-full transition-all ${colour}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function ShelterResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [toggling, setToggling]   = useState({});

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await getResources();
      setResources(res.data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleAvail = async (id, current) => {
    setToggling(t => ({ ...t, [id]: true }));
    try {
      const updated = await patchResource(id, { available: !current });
      setResources(rs => rs.map(r => r.id === id ? updated : r));
    } catch (e) { alert('Failed: ' + e.message); }
    finally { setToggling(t => ({ ...t, [id]: false })); }
  };

  const visible = typeFilter === 'all' ? resources : resources.filter(r => r.type === typeFilter);

  // Summary stats
  const available = resources.filter(r => r.available).length;
  const total     = resources.length;
  const totalShelterCap = MOCK_SHELTERS.reduce((acc, s) => acc + s.capacity, 0);
  const totalShelterOcc = MOCK_SHELTERS.reduce((acc, s) => acc + s.occupancy, 0);

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-surface-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">Shelters &amp; Community Resources</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-950/60 text-blue-400 border border-blue-800/50">
              <Layers size={13} /> Geospatial GIS
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Live evacuation center occupancy and community-contributed disaster relief assets across Goa
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-right bg-slate-800/80 px-3 py-1.5 rounded-xl border border-surface-border">
            <span className="text-slate-400">Total Shelter Capacity: </span>
            <strong className="text-emerald-400 font-mono">{totalShelterOcc} / {totalShelterCap}</strong>
          </div>
        </div>
      </div>

      {/* Shelter summary cards — Enhanced with circular capacity gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_SHELTERS.map(sh => {
          const pct = sh.capacity > 0 ? Math.round((sh.occupancy / sh.capacity) * 100) : 0;
          const gaugeColor = pct > 80 ? '#ef4444' : pct > 50 ? '#f59e0b' : '#10b981';
          return (
            <CardSpotlight key={sh.id} gradientColor={pct > 80 ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)'} gradientSize={200} className="p-4 rounded-2xl bg-surface-card border border-surface-border">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-slate-200 truncate">{sh.name}</h3>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className="text-primary-400" aria-hidden /> {sh.area}
                  </p>
                </div>
                <AnimatedCircularProgress
                  value={pct}
                  size={64}
                  strokeWidth={7}
                  primaryColor={gaugeColor}
                  duration={1500}
                />
              </div>
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-surface-border/50 text-[11px]">
                <span className="text-slate-400">
                  <NumberTicker value={sh.occupancy} /> / {sh.capacity}
                </span>
                <span className={`font-bold ${pct > 80 ? 'text-red-400' : pct > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {pct > 80 ? 'Near Capacity' : pct > 50 ? 'Filling Up' : 'Available'}
                </span>
              </div>
              <div className="mt-1.5 text-[10px] text-slate-500 truncate">
                {sh.facilities.replaceAll(',', ' · ')}
              </div>
            </CardSpotlight>
          );
        })}
      </div>

      {/* Side-by-Side Command View: 7 cols Map (LHS) + 5 cols Resource Table (RHS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LHS: Interactive Map */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-surface-border flex items-center justify-between bg-slate-900/40">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-primary-400" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Geospatial Distribution</h2>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Available</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> In Use</span>
              </div>
            </div>

            <div style={{ height: 460 }} className="w-full">
              {loading
                ? <div className="h-full bg-slate-800 animate-pulse flex items-center justify-center text-slate-500">Loading map...</div>
                : (
                  <MapContainer center={[15.4989, 73.8278]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    {/* Shelters */}
                    {MOCK_SHELTERS.map(sh => (
                      <Marker key={sh.id} position={[sh.lat, sh.lng]}>
                        <Popup>
                          <strong>{sh.name}</strong><br />
                          Capacity: {sh.capacity} · Occupancy: {sh.occupancy}<br />
                          {sh.facilities}
                        </Popup>
                      </Marker>
                    ))}
                    {/* Resources as circles */}
                    {resources.map(res => (
                      <Circle
                        key={res.id}
                        center={[res.lat, res.lng]}
                        radius={90}
                        pathOptions={{ color: res.available ? '#10b981' : '#ef4444', fillOpacity: 0.5 }}
                      >
                        <Popup>
                          <strong>{TYPE_META[res.type]?.label || res.type}</strong><br />
                          Area: {res.area}<br />
                          Available: {res.available ? 'Yes' : 'No'}<br />
                          {res.contact_note}
                        </Popup>
                      </Circle>
                    ))}
                  </MapContainer>
                )
              }
            </div>
            
            <div className="p-3 bg-slate-900/60 border-t border-surface-border text-xs text-slate-400 flex justify-between items-center">
              <span>Center: Panaji City &amp; Mandovi Estuary</span>
              <span className="text-emerald-400 font-medium">All 4 Evacuation Centers Operational</span>
            </div>
          </div>
        </div>

        {/* RHS: Community Resources Inventory & Availability Toggles */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Filter Chips */}
          <div className="flex flex-wrap gap-1.5 p-2 rounded-2xl bg-surface-card border border-surface-border">
            {['all', ...Object.keys(TYPE_META)].map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all capitalize
                  ${typeFilter === t
                    ? 'bg-primary-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
              >
                {t === 'all' ? 'All Resources' : TYPE_META[t].label}
              </button>
            ))}
          </div>

          {/* Resource Table */}
          {error
            ? <ErrorState message={error} onRetry={load} />
            : (
              <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-surface-border flex items-center justify-between bg-slate-900/40">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Community Inventory ({visible.length})
                  </h2>
                  <span className="text-xs text-emerald-400 font-medium">
                    {available} / {total} ready
                  </span>
                </div>

                <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
                  <table className="w-full text-sm" role="table" aria-label="Community resources">
                    <thead className="sticky top-0 bg-slate-900/90 backdrop-blur z-10">
                      <tr className="border-b border-surface-border text-xs uppercase tracking-wide text-slate-400">
                        <th scope="col" className="px-3 py-2.5 text-left">Type</th>
                        <th scope="col" className="px-3 py-2.5 text-left">Area</th>
                        <th scope="col" className="px-3 py-2.5 text-left">Cap</th>
                        <th scope="col" className="px-3 py-2.5 text-left">Available</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {loading
                        ? [...Array(5)].map((_,i) => (
                            <tr key={i} aria-hidden><td colSpan={4} className="px-3 py-2.5"><Skeleton className="h-4 w-full" /></td></tr>
                          ))
                        : visible.length === 0
                          ? <tr><td colSpan={4}><EmptyState title="No resources" /></td></tr>
                          : visible.map(res => {
                              const meta = TYPE_META[res.type] || { label: res.type, icon: Home, color: '#64748b' };
                              const Icon = meta.icon;
                              const busy = toggling[res.id];
                              return (
                                <tr key={res.id} className="hover:bg-slate-800/30 transition-colors">
                                  <td className="px-3 py-2.5">
                                    <span className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
                                      <Icon size={13} style={{ color: meta.color }} aria-hidden />
                                      {meta.label}
                                    </span>
                                    <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">{res.contact_note}</span>
                                  </td>
                                  <td className="px-3 py-2.5 text-xs text-slate-300">{res.area}</td>
                                  <td className="px-3 py-2.5 text-xs font-mono text-slate-400">{res.capacity}</td>
                                  <td className="px-3 py-2.5">
                                    <button
                                      onClick={() => toggleAvail(res.id, res.available)}
                                      disabled={busy}
                                      aria-pressed={res.available}
                                      aria-label={`Toggle availability for ${meta.label} in ${res.area}`}
                                      className="flex items-center gap-1.5 text-xs disabled:opacity-50 transition-colors cursor-pointer"
                                    >
                                      {res.available
                                        ? <ToggleRight size={22} className="text-emerald-400" aria-hidden />
                                        : <ToggleLeft  size={22} className="text-slate-600"    aria-hidden />
                                      }
                                      <span className={res.available ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                                        {res.available ? 'Ready' : 'In Use'}
                                      </span>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                      }
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-slate-900/60 border-t border-surface-border text-xs text-slate-400 text-center">
                  Click toggle icon to change deployment status in real-time
                </div>
              </div>
            )
          }
        </div>

      </div>
    </div>
  );
}
