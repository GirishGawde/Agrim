import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBoard } from '../components/StatusBoard.jsx';
import { StatusBadge, RiskBadge } from '../components/ui/StatusBadge.jsx';
import { SkeletonCard, SkeletonRow, EmptyState, ErrorState } from '../components/ui/States.jsx';
import { SpotlightCard } from '../components/ui/SpotlightCard.jsx';
import { BorderBeam, ShimmerButton, CardSpotlight, NumberTicker, TypewriterText, AnimatedList, FlipWords, AnimatedCircularProgress } from '../components/inspira/index.js';
import { getReports, patchReport, getVolunteers, getAlerts } from '../services/api.js';
import { format } from 'date-fns';
import {
  UserCheck, CheckSquare, RefreshCw, Filter, Waves, Mountain, Flame,
  Activity, Radio, Droplets, ArrowRight, ShieldAlert,
  PhoneCall, AlertCircle, Compass, Sparkles, Search, Zap
} from 'lucide-react';

const HAZARD_ICONS = { flood: Waves, landslide: Mountain, fire: Flame };
const POLL_INTERVAL = 15_000; // ms — live refresh without websocket

// Mocked live command logs for dynamic war-room activity stream
const INITIAL_LOGS = [
  { id: 'log-1', text: 'Volunteer Arjun Naik acknowledged rescue dispatch for Patto sector', time: '2m ago', type: 'volunteer' },
  { id: 'log-2', text: 'IoT Sensor #MB-04 reported water surge +0.14m at Ribandar Jetty', time: '6m ago', type: 'telemetry' },
  { id: 'log-3', text: 'Panaji Indoor Relief Hall reached 40% shelter capacity', time: '14m ago', type: 'shelter' },
  { id: 'log-4', text: 'Rescue Boat #res-001 deployed with 2 certified rescue crew', time: '21m ago', type: 'resource' },
  { id: 'log-5', text: 'IMD Altinho Doppler Radar flagged 85mm convective storm cell', time: '35m ago', type: 'weather' },
];

export default function AuthorityDashboard() {
  const navigate = useNavigate();
  const [reports, setReports]         = useState([]);
  const [volunteers, setVolunteers]   = useState([]);
  const [alerts, setAlerts]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterHazard, setFilterHazard] = useState('all');
  const [searchQuery, setSearchQuery]   = useState('');
  const [assigning, setAssigning]     = useState({}); // { [reportId]: bool }
  const [activityLogs, setActivityLogs] = useState(INITIAL_LOGS);

  const counts = {
    open:     reports.filter(r => r.status === 'open').length,
    assigned: reports.filter(r => r.status === 'assigned').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
  };

  const highRiskAreas = [...new Set(
    reports.filter(r => r.severity === 'high' && r.status !== 'resolved').map(r => r.area)
  )];

  const pendingAlerts = alerts.filter(a => a.status === 'pending');

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const [rData, vData, aData] = await Promise.all([
        getReports(),
        getVolunteers(),
        getAlerts().catch(() => ({ data: [] }))
      ]);
      setReports(rData.data);
      setVolunteers(vData.data);
      setAlerts(aData.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + polling for live updates
  useEffect(() => {
    load();
    const t = setInterval(() => load(true), POLL_INTERVAL);
    return () => clearInterval(t);
  }, [load]);

  const assign = async (reportId, volunteerId) => {
    setAssigning(a => ({ ...a, [reportId]: true }));
    try {
      const updated = await patchReport(reportId, { status: 'assigned', assigned_volunteer: volunteerId });
      setReports(rs => rs.map(r => r.id === reportId ? updated : r));
      const vol = volunteers.find(v => v.id === volunteerId);
      setActivityLogs(logs => [
        {
          id: `log-${Date.now()}`,
          text: `Volunteer ${vol ? vol.name : volunteerId} assigned to incident ${reportId}`,
          time: 'Just now',
          type: 'volunteer'
        },
        ...logs.slice(0, 7)
      ]);
    } catch (e) {
      alert('Failed to assign: ' + e.message);
    } finally {
      setAssigning(a => ({ ...a, [reportId]: false }));
    }
  };

  const resolve = async (reportId) => {
    setAssigning(a => ({ ...a, [reportId]: true }));
    try {
      const updated = await patchReport(reportId, { status: 'resolved' });
      setReports(rs => rs.map(r => r.id === reportId ? updated : r));
      setActivityLogs(logs => [
        {
          id: `log-${Date.now()}`,
          text: `Incident ${reportId} marked resolved by incident commander`,
          time: 'Just now',
          type: 'resolved'
        },
        ...logs.slice(0, 7)
      ]);
    } catch (e) {
      alert('Failed to resolve: ' + e.message);
    } finally {
      setAssigning(a => ({ ...a, [reportId]: false }));
    }
  };

  const visible = reports.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesHazard = filterHazard === 'all' || r.hazard_type === filterHazard;
    const matchesSearch = !searchQuery.trim() ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesHazard && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-surface-border/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">Authority Command Center</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <TypewriterText
                words={['Live Telemetry', 'SEOC Active', 'Goa SDMA Online', 'Command Active']}
                typingSpeed={65}
                deletingSpeed={35}
                pauseMs={2200}
                className="font-medium"
                cursorColor="#4ade80"
              />
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time incident dispatch, environmental telemetry & resource orchestration · Goa SDMA
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => load()}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl bg-slate-800 border border-surface-border text-slate-200 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
            aria-label="Refresh reports"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} aria-hidden /> Refresh Telemetry
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {loading && reports.length === 0
        ? <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_,i) => <SkeletonCard key={i} />)}</div>
        : <StatusBoard counts={counts} highRiskAreas={highRiskAreas} />
      }

      {/* Main Command Center Grid: 8 cols LHS + 4 cols RHS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LHS: Incident Reports & Dispatching (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Controls: Search & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-surface-card border border-surface-border">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search incident ID, area, or description..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900/80 border border-surface-border rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-surface-border/60">
                {['all', 'open', 'assigned', 'resolved'].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all capitalize
                      ${filterStatus === s
                        ? 'bg-primary-600 text-white shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <select
                value={filterHazard}
                onChange={e => setFilterHazard(e.target.value)}
                className="text-xs bg-slate-900 border border-surface-border rounded-xl px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-primary-500"
                aria-label="Filter by hazard"
              >
                <option value="all">All Hazards</option>
                <option value="flood">Flood</option>
                <option value="landslide">Landslide</option>
                <option value="fire">Fire</option>
              </select>
            </div>
          </div>

          {/* Incident Reports Table */}
          {error
            ? <ErrorState message={error} onRetry={load} />
            : (
              <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 border-b border-surface-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-primary-400" />
                    <h2 className="text-sm font-semibold text-slate-200">Active Field Incidents & Mobilization</h2>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-surface-border">
                    {visible.length} of {reports.length} records
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm" role="table" aria-label="Hazard reports">
                    <thead>
                      <tr className="border-b border-surface-border text-xs uppercase tracking-wide text-slate-400 bg-slate-900/40">
                        <th scope="col" className="px-4 py-3 text-left">ID</th>
                        <th scope="col" className="px-4 py-3 text-left">Area</th>
                        <th scope="col" className="px-4 py-3 text-left">Hazard</th>
                        <th scope="col" className="px-4 py-3 text-left">Severity</th>
                        <th scope="col" className="px-4 py-3 text-left">Status</th>
                        <th scope="col" className="px-4 py-3 text-left">Reported</th>
                        <th scope="col" className="px-4 py-3 text-left">Dispatch & Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {loading && reports.length === 0
                        ? [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
                        : visible.length === 0
                          ? (
                            <tr><td colSpan={7}><EmptyState title="No matching incidents" message="No reports match your current filters." /></td></tr>
                          )
                          : visible.map(report => {
                              const HazIcon = HAZARD_ICONS[report.hazard_type] || Waves;
                              const vol = volunteers.find(v => v.id === report.assigned_volunteer);
                              const busy = assigning[report.id];
                              return (
                                <tr key={report.id} className="hover:bg-slate-800/30 transition-colors animate-fade-in">
                                  <td className="px-4 py-3.5 font-mono text-xs text-slate-400 font-semibold">{report.id}</td>
                                  <td className="px-4 py-3.5 font-medium text-slate-200">{report.area}</td>
                                  <td className="px-4 py-3.5">
                                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 capitalize bg-slate-800/80 px-2 py-1 rounded-md border border-surface-border">
                                      <HazIcon size={12} className="text-primary-400" aria-hidden /> {report.hazard_type}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3.5">
                                    <RiskBadge level={report.severity} />
                                  </td>
                                  <td className="px-4 py-3.5">
                                    <StatusBadge status={report.status} />
                                  </td>
                                  <td className="px-4 py-3.5 text-xs text-slate-400">
                                    <time dateTime={report.created_at}>
                                      {format(new Date(report.created_at), 'dd MMM HH:mm')}
                                    </time>
                                  </td>
                                  <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {report.status === 'open' && (
                                        <select
                                          aria-label={`Assign volunteer for ${report.id}`}
                                          disabled={busy}
                                          defaultValue=""
                                          onChange={e => e.target.value && assign(report.id, e.target.value)}
                                          className="text-xs bg-slate-800 border border-primary-600/50 rounded-lg px-2.5 py-1 text-slate-200 hover:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
                                        >
                                          <option value="" disabled>Assign Volunteer...</option>
                                          {volunteers.filter(v => v.availability).map(v => (
                                            <option key={v.id} value={v.id}>{v.name} ({v.area})</option>
                                          ))}
                                        </select>
                                      )}
                                      {report.status === 'assigned' && (
                                        <span className="text-xs text-slate-300 flex items-center gap-1.5 bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded-md">
                                          <UserCheck size={12} className="text-blue-400" aria-hidden /> {vol?.name || 'Assigned'}
                                        </span>
                                      )}
                                      {report.status !== 'resolved' && (
                                        <button
                                          onClick={() => resolve(report.id)}
                                          disabled={busy}
                                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-800/60 disabled:opacity-50 transition-colors"
                                          aria-label={`Mark ${report.id} as resolved`}
                                        >
                                          <CheckSquare size={12} aria-hidden /> Resolve
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                    </tbody>
                  </table>
                </div>

                {/* Footer KPI ribbon */}
                <div className="p-3 bg-slate-900/50 border-t border-surface-border text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <span>Average Dispatch Time: <strong className="text-slate-200">12.4 mins</strong></span>
                    <span>•</span>
                    <span>SDRF Units Active: <strong className="text-slate-200">4 Squads</strong></span>
                  </div>
                  <span className="text-slate-500">Auto-sync: every 15s</span>
                </div>
              </div>
            )
          }
        </div>

        {/* RHS: Command & Telemetry Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* 1. Pending Emergency Alerts Gate */}
          {/* 1. Pending Emergency Alerts Gate — Inspira BorderBeam + ShimmerButton */}
          {pendingAlerts.length > 0 && (
            <div className="relative rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-900 p-5 shadow-xl shadow-amber-950/30 overflow-hidden animate-slide-up">
              {/* Inspira BorderBeam glowing gradient effect */}
              <BorderBeam size={220} duration={8} colorFrom="#f59e0b" colorTo="#ef4444" borderWidth={2} />

              <div className="flex items-start gap-3 relative z-10">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                  <ShieldAlert size={22} className="animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">Action Required</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {pendingAlerts.length} Pending
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mt-1">High-Priority Alert Approval</h3>
                  <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">
                    {pendingAlerts[0]?.title || 'Early warning notification awaiting officer sign-off before mass broadcast.'}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-slate-400">
                      Confidence: <strong className="text-emerald-400 font-mono text-xs">{Math.round((pendingAlerts[0]?.confidence_score || 0.89) * 100)}%</strong>
                    </div>

                    <ShimmerButton
                      onClick={() => navigate('/alerts')}
                      shimmerColor="#fef08a"
                      background="linear-gradient(135deg, rgba(217, 119, 6, 0.95), rgba(180, 83, 9, 0.95))"
                      className="px-3.5 py-1.5 rounded-xl text-white font-bold text-xs shadow-md"
                    >
                      Review &amp; Approve <ArrowRight size={13} />
                    </ShimmerButton>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Live Environmental & River Telemetry (Mandovi Basin) — Inspira CardSpotlight */}
          <CardSpotlight
            gradientColor="rgba(6, 182, 212, 0.20)"
            gradientSize={280}
            className="p-5 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Waves size={16} className="text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-100">Mandovi River Basin Telemetry</h3>
              </div>
              <span className="text-[11px] font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full">
                Active Gauge
              </span>
            </div>

            {/* River level meter */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-surface-border/60 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-400">Water Gauge (Patto Bridge)</span>
                <span className="text-sm font-mono font-bold text-amber-400">3.42 m <span className="text-[10px] text-slate-500 font-normal">/ 3.50m Crit</span></span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 rounded-full transition-all" style={{ width: '94%' }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                <span>Surge Risk: <strong className="text-amber-400">Elevated (94%)</strong></span>
                <span>Next High Tide: <strong>14:15 (+2.1m)</strong></span>
              </div>
            </div>

            {/* Secondary telemetry metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/40 border border-surface-border/50">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Droplets size={13} className="text-blue-400" /> 24h Rainfall
                </div>
                <div className="text-lg font-bold text-slate-100 font-mono">114.5 mm</div>
                <div className="text-[10px] text-amber-400 mt-0.5">Heavy Monsoon Band</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-surface-border/50">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Radio size={13} className="text-emerald-400" /> IoT Stations
                </div>
                <div className="text-lg font-bold text-emerald-400 font-mono">
                  <NumberTicker value={4} /> / 4
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">All Sensors Online</div>
              </div>
            </div>
          </CardSpotlight>

          {/* 3. Resource & Shelter Mobilization Gauges */}
          <div className="rounded-2xl border border-surface-border bg-surface-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass size={16} className="text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-100">Mobilization Readiness</h3>
              </div>
              <button
                onClick={() => navigate('/shelters')}
                className="text-xs text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1"
              >
                View Map <ArrowRight size={12} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Volunteer Responders Active</span>
                  <span className="font-semibold text-slate-200">22 / 30 Ready</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '73%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Community Rescue Boats</span>
                  <span className="font-semibold text-slate-200">5 Deployed · 3 Staged</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '62%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Shelter Capacity (Panaji Zone)</span>
                  <span className="font-semibold text-slate-200">120 / 320 Occupants (38%)</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '38%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Live Command Activity Feed — Inspira AnimatedList */}
          <div className="rounded-2xl border border-surface-border bg-surface-card p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-100">Live Incident Activity Feed</h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <AnimatedList
              items={activityLogs.map(log => ({
                _id: log.id,
                title: log.text,
                time: log.time,
                icon: <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-0.5 shrink-0 block" />,
              }))}
              delay={3500}
              maxVisible={5}
            />
          </div>

          {/* 5. Emergency SEOC Hotlines */}
          <div className="rounded-2xl border border-surface-border bg-gradient-to-r from-slate-900 to-slate-800/90 p-4 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <PhoneCall size={14} className="text-red-400" /> Emergency Hotlines & Dispatch
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-surface-border">
                <span className="text-[10px] text-slate-500 block">SEOC Panaji War Room</span>
                <a href="tel:1070" className="font-mono font-bold text-primary-400 hover:underline">1070 / 0832-2421100</a>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-surface-border">
                <span className="text-[10px] text-slate-500 block">Coast Guard (MRCC)</span>
                <a href="tel:1554" className="font-mono font-bold text-cyan-400 hover:underline">1554 (Toll-Free)</a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
