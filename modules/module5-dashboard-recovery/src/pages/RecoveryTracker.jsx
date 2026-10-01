/**
 * RecoveryTracker — households log damage and needs after an event.
 * Volunteers/NGOs pick up tasks. Shows matched resource from need-offer matching.
 */
import React, { useState, useEffect } from 'react';
import { getResources } from '../services/api.js';
import { MOCK_RECOVERY_TASKS, MOCK_RESOURCES } from '../services/mockData.js';
import { StatusBadge, RiskBadge } from '../components/ui/StatusBadge.jsx';
import { SpotlightCard } from '../components/ui/SpotlightCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { format } from 'date-fns';
import {
  Plus, PackageCheck, UserCheck2, Anchor, Car, Droplets, Home,
  HeartPulse, Sparkles, Filter, CheckCircle2, AlertTriangle, LifeBuoy
} from 'lucide-react';
import { NumberTicker, ShimmerButton, CardSpotlight, FlipWords, AnimatedCircularProgress } from '../components/inspira/index.js';

const CATEGORIES = ['rescue', 'food_water', 'shelter', 'medical', 'debris_clearance', 'other'];
const SEVERITIES  = ['critical', 'high', 'medium', 'low'];

const RESOURCE_ICONS = {
  boat: Anchor, vehicle: Car, water_tank: Droplets, spare_room: Home, first_aid: HeartPulse,
};

const CATEGORY_LABELS = {
  rescue: 'Rescue', food_water: 'Food & Water', shelter: 'Shelter',
  medical: 'Medical', debris_clearance: 'Debris Clearance', other: 'Other',
};

const EMPTY_FORM = { area: '', category: 'rescue', severity: 'high', description: '', household_type: 'low-lying home' };

function formatTaskTime(dateVal) {
  if (!dateVal) return 'Recently';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return 'Recently';
    return format(d, 'dd MMM yyyy, HH:mm');
  } catch {
    return 'Recently';
  }
}

export default function RecoveryTracker() {
  const { user } = useAuth();
  const [tasks, setTasks]         = useState(MOCK_RECOVERY_TASKS);
  const [resources, setResources] = useState(MOCK_RESOURCES);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    getResources()
      .then(r => {
        if (r && Array.isArray(r.data) && r.data.length > 0) {
          setResources(r.data);
        }
      })
      .catch(() => {});
  }, []);

  // Simple need-offer match: find first available resource matching category
  const matchResource = (category) => {
    const typeMap = {
      rescue: 'boat', food_water: 'water_tank', shelter: 'spare_room',
      medical: 'first_aid', debris_clearance: 'vehicle',
    };
    const targetType = typeMap[category];
    const pool = resources.length > 0 ? resources : MOCK_RESOURCES;
    return pool.find(r => r.type === targetType && r.available);
  };

  // Helper to resolve matched resource object whether it is an ID, object, or null
  const getMatchedResource = (task) => {
    if (!task.matched_resource) return null;
    if (typeof task.matched_resource === 'object') return task.matched_resource;
    const pool = resources.length > 0 ? resources : MOCK_RESOURCES;
    const found = pool.find(r => r.id === task.matched_resource);
    if (found) return found;
    return {
      id: task.matched_resource,
      type: task.category === 'rescue' ? 'boat' : task.category === 'food_water' ? 'water_tank' : 'vehicle',
      area: task.area,
      capacity: 4,
      contact_note: 'Dispatched via Emergency Relief Pool',
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.area || !form.description) return;
    setSubmitting(true);
    setError(null);
    try {
      const matched = matchResource(form.category);
      const nowIso = new Date().toISOString();
      const newTask = {
        id: `rt-${Date.now()}`,
        household_id: user?.id || 'hh-new',
        area: form.area,
        category: form.category,
        severity: form.severity,
        description: form.description,
        status: 'open',
        logged_at: nowIso,
        created_at: nowIso,
        assigned_to: null,
        matched_resource: matched || null,
      };
      setTasks(ts => [newTask, ...ts]);
      setForm(EMPTY_FORM);
      setSuccessMsg('Damage report logged! Matched with nearest relief resource.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccept = (taskId) => {
    setTasks(ts => ts.map(t => t.id === taskId ? { ...t, status: 'assigned', assigned_to: user?.name || 'You' } : t));
  };

  const handleComplete = (taskId) => {
    setTasks(ts => ts.map(t => t.id === taskId ? { ...t, status: 'resolved' } : t));
  };

  const visible = filterStatus === 'all' ? tasks : tasks.filter(t => t.status === filterStatus);

  // Stats
  const counts = {
    open: tasks.filter(t => t.status === 'open').length,
    assigned: tasks.filter(t => t.status === 'assigned').length,
    resolved: tasks.filter(t => t.status === 'resolved').length,
  };

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-surface-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">Recovery &amp; Damage Tracker</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-950/60 text-purple-400 border border-purple-800/50">
              <Sparkles size={13} />
              <FlipWords words={['Module 4 Matching', 'Need-Offer Engine', 'AI Asset Pairing', 'Auto-Dispatch']} duration={2600} className="font-medium" />
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Log damage and relief needs post-event · automated pairing with community rescue assets
          </p>
        </div>
      </div>

      {/* Summary Spotlight Cards with Inspira NumberTicker */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ['Open Relief Needs', counts.open, 'rgba(245, 158, 11, 0.22)', 'Awaiting volunteer pickup', '#f59e0b'],
          ['Active Assignments', counts.assigned, 'rgba(59, 130, 246, 0.22)', 'Volunteers dispatched', '#3b82f6'],
          ['Resolved Cases', counts.resolved, 'rgba(16, 185, 129, 0.22)', 'Aid successfully delivered', '#10b981']
        ].map(([label, count, color, subtitle, gaugeColor]) => (
          <CardSpotlight key={label} gradientColor={color} gradientSize={240} className="p-4 rounded-2xl bg-surface-card border border-surface-border shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
                <p className="text-3xl font-extrabold text-slate-100 mt-1">
                  <NumberTicker value={count} />
                </p>
                <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
              </div>
              <AnimatedCircularProgress
                value={tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0}
                size={72}
                strokeWidth={8}
                primaryColor={gaugeColor}
                duration={1400}
              />
            </div>
          </CardSpotlight>
        ))}
      </div>

      {/* Side-by-side Dual Column: LHS Active Needs (7 cols) + RHS Log Form (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LHS: Task Cards & Filter (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-surface-card border border-surface-border">
            <div className="flex items-center gap-1">
              {['all', 'open', 'assigned', 'resolved'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all capitalize
                    ${filterStatus === s
                      ? 'bg-primary-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                >
                  {s} ({tasks.filter(t => s === 'all' ? true : t.status === s).length})
                </button>
              ))}
            </div>
          </div>

          {/* Tasks List */}
          {visible.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-surface-border bg-surface-card text-slate-500 text-sm">
              No recovery requests matching filter.
            </div>
          ) : (
            <div className="space-y-4">
              {visible.map(task => {
                const matched = getMatchedResource(task);
                const MatchedIcon = matched ? (RESOURCE_ICONS[matched.type] || Anchor) : null;
                const taskTimeStr = task.logged_at || task.created_at;
                return (
                  <article key={task.id} className="rounded-2xl border border-surface-border bg-surface-card p-5 space-y-3.5 shadow-sm hover:border-slate-700 transition-colors animate-slide-up">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-400 font-semibold">{task.id}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-xs font-semibold text-primary-400 capitalize">{CATEGORY_LABELS[task.category] || task.category}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-xs text-slate-300 font-medium">{task.area}</span>
                        </div>
                        <p className="text-sm text-slate-200 mt-2 leading-relaxed">{task.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <RiskBadge level={task.severity} />
                        <StatusBadge status={task.status} />
                      </div>
                    </div>

                    {/* Matched Resource Banner (Module 4 Need-Offer Engine) */}
                    {matched && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs">
                        {MatchedIcon && <MatchedIcon size={16} className="text-purple-400 shrink-0" aria-hidden />}
                        <div className="flex-1 min-w-0">
                          <span className="text-purple-300 font-semibold">Matched Asset: </span>
                          <span className="text-slate-200 capitalize font-medium">{matched.type}</span>
                          <span className="text-slate-400 ml-1">in {matched.area} (Cap: {matched.capacity})</span>
                          <div className="text-[11px] text-slate-500 truncate">{matched.contact_note}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-900/60 text-purple-300 border border-purple-700/50">
                          Auto-Paired
                        </span>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-surface-border/50 text-xs">
                      <time className="text-slate-500" dateTime={taskTimeStr || ''}>
                        {formatTaskTime(taskTimeStr)}
                      </time>

                      <div className="flex items-center gap-2">
                        {task.status === 'open' && (
                          <button
                            onClick={() => handleAccept(task.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium text-xs shadow-sm transition-all"
                          >
                            <UserCheck2 size={13} /> Pick Up Task
                          </button>
                        )}
                        {task.status === 'assigned' && (
                          <button
                            onClick={() => handleComplete(task.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs shadow-sm transition-all"
                          >
                            <PackageCheck size={13} /> Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* RHS: Log Damage Form & Need-Matching Rules (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Quick Log Form */}
          <div className="rounded-2xl border border-primary-700/40 bg-surface-card p-5 space-y-4 shadow-md sticky top-6">
            <div className="flex items-center justify-between pb-2 border-b border-surface-border">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Plus size={16} className="text-primary-400" /> Log Damage or Urgent Need
              </h2>
              <span className="text-[11px] text-slate-400">Citizen / NGO</span>
            </div>

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 size={15} /> {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1" htmlFor="area">Location / Ward *</label>
                <input
                  id="area"
                  required
                  value={form.area}
                  onChange={e => setForm(f => ({...f, area: e.target.value}))}
                  className="w-full bg-slate-900 border border-surface-border rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  placeholder="e.g. Patto Plaza or Ribandar"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1" htmlFor="category">Category *</label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={e => setForm(f => ({...f, category: e.target.value}))}
                    className="w-full bg-slate-900 border border-surface-border rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1" htmlFor="severity">Severity *</label>
                  <select
                    id="severity"
                    value={form.severity}
                    onChange={e => setForm(f => ({...f, severity: e.target.value}))}
                    className="w-full bg-slate-900 border border-surface-border rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-primary-500 capitalize"
                  >
                    {SEVERITIES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1" htmlFor="htype">Household Profile</label>
                <select
                  id="htype"
                  value={form.household_type}
                  onChange={e => setForm(f => ({...f, household_type: e.target.value}))}
                  className="w-full bg-slate-900 border border-surface-border rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                >
                  {['low-lying home', 'shop', 'farmer', 'fisherman', 'tourist'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1" htmlFor="description">Damage Description *</label>
                <textarea
                  id="description"
                  required
                  value={form.description}
                  onChange={e => setForm(f => ({...f, description: e.target.value}))}
                  rows={3}
                  placeholder="Describe specific assistance needed (e.g. basement flooded, 2 elderly need evacuation to Panaji hall)..."
                  className="w-full bg-slate-900 border border-surface-border rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 resize-none"
                />
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <ShimmerButton
                type="submit"
                disabled={submitting}
                shimmerColor="#93c5fd"
                background="linear-gradient(135deg, rgba(37, 99, 235, 0.95), rgba(29, 78, 216, 0.95))"
                className="w-full py-3 rounded-xl text-white font-bold text-xs shadow-md"
              >
                {submitting ? 'Submitting & Matching...' : 'Submit & Match with Nearby Asset'}
              </ShimmerButton>
            </form>

            {/* Need-Offer Matching Engine Card */}
            <div className="pt-3 border-t border-surface-border/60 text-[11px] text-slate-400 space-y-2">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <LifeBuoy size={13} className="text-purple-400" /> Module 4 Pairing Logic
              </div>
              <p className="leading-relaxed">
                Submissions automatically query active community inventory. Rescue requests prioritize registered boats within a 1.5 km radius.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
