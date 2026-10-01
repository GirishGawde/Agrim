/**
 * VolunteerTasks — assigned tasks for the logged-in volunteer,
 * plus nearby unassigned tasks they can pick up, field safety checklists, and coordinator contacts.
 * Enhanced with Inspira UI: AnimatedCircularProgress, AnimatedList, GlowCard, TypewriterText.
 */
import React, { useState, useEffect } from 'react';
import { getReports, patchReport } from '../services/api.js';
import { StatusBadge, RiskBadge } from '../components/ui/StatusBadge.jsx';
import { EmptyState, ErrorState, SkeletonCard } from '../components/ui/States.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { format } from 'date-fns';
import {
  CheckSquare, MapPin, UserCheck2, Waves, Mountain, Flame,
  ShieldCheck, PhoneCall, AlertCircle, Zap, Star, Clock, Target
} from 'lucide-react';
import {
  NumberTicker, CardSpotlight, AnimatedCircularProgress,
  AnimatedList, TypewriterText, GlowCard
} from '../components/inspira/index.js';

const HAZARD_ICONS = { flood: Waves, landslide: Mountain, fire: Flame };

const LIVE_FEED_ITEMS = [
  { title: 'Rescue Boat #RB-02 Deployed', text: 'Heading to Ribandar Jetty sector', time: 'Just now', icon: <Waves size={13} className="text-cyan-400" /> },
  { title: 'Shelter Panaji Hall Updated', text: '40% capacity — receiving evacuees', time: '3m ago', icon: <ShieldCheck size={13} className="text-emerald-400" /> },
  { title: 'High Tide Advisory Issued', text: 'Crest at 14:15 — avoid causeway', time: '8m ago', icon: <AlertCircle size={13} className="text-amber-400" /> },
  { title: 'Volunteer Priya Naik Check-In', text: 'Reporting from Miramar Beach sector', time: '15m ago', icon: <UserCheck2 size={13} className="text-blue-400" /> },
  { title: 'IoT Sensor MB-04 Update', text: 'Water level +0.14m surge detected', time: '22m ago', icon: <Zap size={13} className="text-purple-400" /> },
  { title: 'Medical Kit #MK-07 Dispatched', text: 'En route to Campal flood zone', time: '31m ago', icon: <Target size={13} className="text-red-400" /> },
];

function TaskCard({ report, onAccept, onComplete, isMyTask, busy }) {
  const Icon = HAZARD_ICONS[report.hazard_type] || Waves;
  const isHigh = report.severity === 'high' || report.severity === 'critical';
  return (
    <GlowCard
      glowColor={isHigh ? '#ef4444' : '#3b82f6'}
      glowOpacity={0.12}
      className="rounded-2xl bg-surface-card p-4 sm:p-5 space-y-3 hover:shadow-lg transition-all animate-fade-in shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="p-1.5 rounded-lg bg-slate-800/80 border border-surface-border/60">
          <Icon size={14} className="text-primary-400" aria-hidden />
        </span>
        <span className="text-sm font-semibold text-slate-100 capitalize">{report.hazard_type} – {report.area}</span>
        <div className="ml-auto flex items-center gap-2">
          <RiskBadge level={report.severity} />
          <StatusBadge status={report.status} />
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{report.description}</p>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-surface-border/50 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <MapPin size={11} className="text-primary-400" aria-hidden />
            {report.lat?.toFixed(4)}, {report.lng?.toFixed(4)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} className="text-slate-500" />
            <time dateTime={report.created_at || ''}>
              {report.created_at ? format(new Date(report.created_at), 'dd MMM HH:mm') : 'Recently'}
            </time>
          </span>
        </div>

        <div>
          {!isMyTask && report.status === 'open' && (
            <button
              onClick={() => onAccept(report.id)}
              disabled={busy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-primary-600 hover:bg-primary-500 text-white shadow-sm disabled:opacity-50 transition-all"
            >
              <UserCheck2 size={13} aria-hidden /> Accept Task
            </button>
          )}
          {isMyTask && report.status === 'assigned' && (
            <button
              onClick={() => onComplete(report.id)}
              disabled={busy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white shadow-sm disabled:opacity-50 transition-all"
            >
              <CheckSquare size={13} aria-hidden /> Mark Complete
            </button>
          )}
        </div>
      </div>
    </GlowCard>
  );
}

export default function VolunteerTasks() {
  const { user } = useAuth();
  const [reports, setReports]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [busy, setBusy]         = useState({});

  useEffect(() => {
    getReports()
      .then(r => setReports(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const myTasks   = reports.filter(r => r.assigned_volunteer === (user?.id || 'vol-01') || (user?.id === 'vol-01' && r.assigned_volunteer === 'v001'));
  const nearby    = reports.filter(r => r.status === 'open' && !myTasks.find(m => m.id === r.id));
  const done      = reports.filter(r => r.status === 'resolved' && (r.assigned_volunteer === (user?.id || 'vol-01'))).length;
  const totalAssigned = myTasks.filter(t => t.status === 'assigned').length;

  const act = async (id, body) => {
    setBusy(b => ({ ...b, [id]: true }));
    try {
      const updated = await patchReport(id, body);
      setReports(rs => rs.map(r => r.id === id ? updated : r));
    } catch (e) {
      alert('Failed: ' + e.message);
    } finally {
      setBusy(b => ({ ...b, [id]: false }));
    }
  };

  const handleAccept   = (id) => act(id, { status: 'assigned', assigned_volunteer: user?.id || 'vol-01' });
  const handleComplete = (id) => act(id, { status: 'resolved' });

  const completionPct = myTasks.length > 0 ? Math.round((done / (myTasks.length + done)) * 100) : 0;

  if (error) return <div className="animate-fade-in"><ErrorState message={error} /></div>;

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-surface-border/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              Volunteer Field Operations
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <TypewriterText
                words={['On Standby', 'Field Ready', 'Active Responder', 'Sector: Panaji']}
                typingSpeed={70}
                deletingSpeed={35}
                pauseMs={2500}
                className="text-emerald-400 font-medium"
                cursorColor="#4ade80"
              />
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Responder: <strong className="text-slate-200">{user?.name || 'Arjun Naik'}</strong> · Aapda Mitra Volunteer #V-001 (Patto / Panaji Ward)
          </p>
        </div>
      </div>

      {/* Quick stats with Inspira NumberTicker */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CardSpotlight gradientColor="rgba(59, 130, 246, 0.22)" gradientSize={250} className="p-4 rounded-2xl bg-surface-card border border-surface-border shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Tasks</span>
            <p className="text-3xl font-extrabold text-slate-100 mt-1">
              <NumberTicker value={totalAssigned} />
            </p>
            <p className="text-xs text-blue-400 mt-1">Under your immediate response</p>
          </CardSpotlight>
          <CardSpotlight gradientColor="rgba(245, 158, 11, 0.22)" gradientSize={250} className="p-4 rounded-2xl bg-surface-card border border-surface-border shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nearby Unassigned</span>
            <p className="text-3xl font-extrabold text-slate-100 mt-1">
              <NumberTicker value={nearby.length} />
            </p>
            <p className="text-xs text-amber-400 mt-1">Open requests in your patrol radius</p>
          </CardSpotlight>
          <CardSpotlight gradientColor="rgba(16, 185, 129, 0.22)" gradientSize={250} className="p-4 rounded-2xl bg-surface-card border border-surface-border shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resolved Today</span>
            <p className="text-3xl font-extrabold text-slate-100 mt-1">
              <NumberTicker value={done} />
            </p>
            <p className="text-xs text-emerald-400 mt-1">Citizens safely assisted</p>
          </CardSpotlight>
        </div>
      )}

      {/* 2-column layout: LHS Task Lists (8 cols) + RHS Field Kit & Safety Info (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LHS: Tasks */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* My Assigned Tasks */}
          <section aria-labelledby="my-tasks-heading" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 id="my-tasks-heading" className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                My Assigned Tasks ({myTasks.length})
              </h2>
            </div>

            {loading
              ? <div className="space-y-3">{[...Array(2)].map((_,i) => <SkeletonCard key={i} />)}</div>
              : myTasks.length === 0
                ? <EmptyState title="No active tasks assigned" message="Pick up a high-priority incident from the nearby open list below." />
                : (
                  <div className="space-y-3">
                    {myTasks.map(r => (
                      <TaskCard key={r.id} report={r} onComplete={handleComplete} isMyTask busy={busy[r.id]} />
                    ))}
                  </div>
                )
            }
          </section>

          {/* Nearby Unassigned Tasks */}
          <section aria-labelledby="nearby-heading" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 id="nearby-heading" className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Nearby Emergency Incidents ({nearby.length})
              </h2>
            </div>

            {loading
              ? <div className="space-y-3">{[...Array(2)].map((_,i) => <SkeletonCard key={i} />)}</div>
              : nearby.length === 0
                ? <EmptyState title="No unassigned incidents" message="All active requests in your sector have been dispatched." />
                : (
                  <div className="space-y-3">
                    {nearby.map(r => (
                      <TaskCard key={r.id} report={r} onAccept={handleAccept} isMyTask={false} busy={busy[r.id]} />
                    ))}
                  </div>
                )
            }
          </section>
        </div>

        {/* RHS: Responder Safety & Coordinator Support */}
        <div className="lg:col-span-4 space-y-5">

          {/* Mission Completion Gauge — Inspira AnimatedCircularProgress */}
          <div className="rounded-2xl border border-surface-border bg-surface-card p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Star size={16} className="text-amber-400" />
              Mission Readiness
            </h3>

            <div className="grid grid-cols-3 gap-2 items-center justify-items-center py-2">
              <AnimatedCircularProgress
                value={completionPct}
                size={90}
                strokeWidth={9}
                primaryColor="#10b981"
                sublabel="Tasks Done"
                duration={1400}
              />
              <AnimatedCircularProgress
                value={Math.min(100, nearby.length * 15)}
                size={90}
                strokeWidth={9}
                primaryColor="#f59e0b"
                sublabel="Workload"
                duration={1600}
              />
              <AnimatedCircularProgress
                value={73}
                size={90}
                strokeWidth={9}
                primaryColor="#3b82f6"
                sublabel="Volunteers"
                duration={1200}
              />
            </div>

            <div className="grid grid-cols-3 text-center gap-1 text-[10px] text-slate-400">
              <span>Completion</span>
              <span>Area Load</span>
              <span>Team Ready</span>
            </div>
          </div>

          {/* Readiness Checklist */}
          <div className="rounded-2xl border border-surface-border bg-surface-card p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              Responder Safety &amp; Gear
            </h3>
            
            <div className="space-y-2 text-xs text-slate-300">
              {[
                ['Certified First Aid Kit', '✓ Inspected', 'text-emerald-400'],
                ['Life Jacket (Type III PFD)', '✓ Equipped', 'text-emerald-400'],
                ['VHF Marine / Waterproof Radio', 'Channel 16', 'text-cyan-400'],
                ['Offline Maps Cached', '✓ Panaji Ward', 'text-emerald-400'],
                ['Emergency Rations', '✓ 48-hr Supply', 'text-emerald-400'],
              ].map(([label, val, color]) => (
                <div key={label} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-surface-border/50 hover:bg-slate-800/40 transition-colors">
                  <span>{label}</span>
                  <span className={`font-bold ${color}`}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Weather & Water Advisory */}
          <div className="rounded-2xl border border-amber-800/40 bg-amber-950/20 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <AlertCircle size={15} /> Sector Water Hazard Notice
            </div>
            <p className="text-slate-300 leading-relaxed">
              Mandovi river high tide reaches crest at 14:15. Avoid low-lying Ribandar causeway without 4x4 or community boat escort.
            </p>
          </div>

          {/* Live Sector Feed — Inspira AnimatedList */}
          <div className="rounded-2xl border border-surface-border bg-surface-card p-5 space-y-3 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2"><Zap size={16} className="text-purple-400" /> Live Sector Feed</span>
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            </h3>
            <AnimatedList items={LIVE_FEED_ITEMS} delay={2800} maxVisible={4} />
          </div>

          {/* Incident Coordinator Hotline */}
          <div className="rounded-2xl border border-surface-border bg-surface-card p-5 space-y-3 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <PhoneCall size={16} className="text-primary-400" />
              Field Incident Command
            </h3>
            <p className="text-xs text-slate-400">
              Report stuck residents, hazardous downed electrical lines, or medical emergencies immediately:
            </p>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-surface-border text-xs space-y-1">
              <div className="text-slate-400">SEOC Panaji Duty Officer:</div>
              <a href="tel:1070" className="text-sm font-mono font-bold text-primary-400 block hover:underline">
                1070 / +91 832 242 1100
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

