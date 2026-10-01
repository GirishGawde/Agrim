/**
 * LessonsLearned — past incidents list, filters, stats, create-incident form,
 * and a "Trigger retraining" button that calls the /retrain endpoint.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { getIncidents, postIncident, postRetrain } from '../services/api.js';
import { IncidentTimeline } from '../components/IncidentTimeline.jsx';
import { SpotlightCard } from '../components/ui/SpotlightCard.jsx';
import { EmptyState, ErrorState, SkeletonCard } from '../components/ui/States.jsx';
import { Plus, RefreshCw, Cpu, Info, CheckCircle2, History, Database, Sparkles as SparklesIcon } from 'lucide-react';
import { NumberTicker, BorderBeam, ShimmerButton, CardSpotlight, TypewriterText, FlipWords } from '../components/inspira/index.js';

const HAZARD_TYPES  = ['flood', 'landslide', 'fire', 'other'];
const DAMAGE_LEVELS = ['minor', 'moderate', 'severe'];
const EMPTY_FORM = {
  area: '', date: '', hazard_type: 'flood', damage_level: 'moderate',
  what_flooded: '', what_worked: '', what_failed: '', notes: '',
  affected_households: '',
};

export default function LessonsLearned() {
  const [incidents, setIncidents]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [submitting, setSubmitting]   = useState(false);
  const [retraining, setRetraining]   = useState(false);
  const [retrainResult, setRetrainResult] = useState(null);
  const [retrainAvail, setRetrainAvail]   = useState(true);
  const [successNote, setSuccessNote] = useState(null);

  // Filters
  const [filterHazard, setFilterHazard] = useState('all');
  const [filterArea, setFilterArea]     = useState('');
  const [filterFrom, setFilterFrom]     = useState('');
  const [filterTo, setFilterTo]         = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const params = {};
      if (filterHazard !== 'all') params.hazard = filterHazard;
      if (filterArea) params.area = filterArea;
      if (filterFrom) params.from = filterFrom;
      if (filterTo)   params.to   = filterTo;
      const res = await getIncidents(params);
      setIncidents(res.data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [filterHazard, filterArea, filterFrom, filterTo]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const inc = await postIncident({ ...form, affected_households: Number(form.affected_households) || 0, status: 'open' });
      setIncidents(is => [inc, ...is]);
      setForm(EMPTY_FORM);
      setSuccessNote('Incident saved into historical ground-truth archive.');
      setTimeout(() => setSuccessNote(null), 4000);
    } catch (e) { alert('Failed: ' + e.message); }
    finally { setSubmitting(false); }
  };

  const handleRetrain = async () => {
    setRetraining(true);
    setRetrainResult(null);
    try {
      const res = await postRetrain();
      setRetrainResult({ ok: true, msg: res.message || 'Model weights updated with latest field incident logs.' });
    } catch (e) {
      setRetrainResult({ ok: false, msg: e.message });
      if (e.message.includes('404') || e.message.includes('Failed to fetch')) {
        setRetrainAvail(false);
      }
    }
    finally { setRetraining(false); }
  };

  // Summary stats
  const stats = {
    total: incidents.length,
    severeCount: incidents.filter(i => i.damage_level === 'severe').length,
    byHazard: incidents.reduce((acc, i) => {
      acc[i.hazard_type] = (acc[i.hazard_type] || 0) + 1;
      return acc;
    }, {}),
    totalAffected: incidents.reduce((acc, i) => acc + (Number(i.affected_households) || 0), 0),
  };

  const filtered = incidents;

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-surface-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">Lessons Learned &amp; Post-Mortems</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-950/60 text-indigo-400 border border-indigo-800/50">
              <History size={13} />
              <FlipWords words={['Continuous Learning', 'Field Evaluation', 'Risk Modeling', 'ML Retraining']} duration={2800} className="font-medium" />
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Historical incident records, field evaluations (what worked vs failed), and active risk model retraining
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      {/* Summary KPI Cards — Inspira NumberTicker */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SpotlightCard color="rgba(139, 92, 246, 0.22)" className="p-4 rounded-2xl bg-surface-card border border-surface-border">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Archived Incidents</span>
            <p className="text-3xl font-extrabold text-slate-100 mt-1">
              <NumberTicker value={stats.total} />
            </p>
            <p className="text-xs text-indigo-400 mt-1">Ground-truth records</p>
          </SpotlightCard>
          <SpotlightCard color="rgba(239, 68, 68, 0.22)" className="p-4 rounded-2xl bg-surface-card border border-surface-border">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Severe Emergencies</span>
            <p className="text-3xl font-extrabold text-slate-100 mt-1">
              <NumberTicker value={stats.severeCount} />
            </p>
            <p className="text-xs text-red-400 mt-1">Required multi-agency dispatch</p>
          </SpotlightCard>
          <SpotlightCard color="rgba(6, 182, 212, 0.22)" className="p-4 rounded-2xl bg-surface-card border border-surface-border">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monsoon Floods</span>
            <p className="text-3xl font-extrabold text-slate-100 mt-1">
              <NumberTicker value={stats.byHazard.flood || 0} />
            </p>
            <p className="text-xs text-cyan-400 mt-1">River &amp; tidal inundation events</p>
          </SpotlightCard>
          <SpotlightCard color="rgba(16, 185, 129, 0.22)" className="p-4 rounded-2xl bg-surface-card border border-surface-border">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Households Assisted</span>
            <p className="text-3xl font-extrabold text-slate-100 mt-1">
              <NumberTicker value={stats.totalAffected} />
            </p>
            <p className="text-xs text-emerald-400 mt-1">Recorded in historical logs</p>
          </SpotlightCard>
        </div>
      )}

      {/* 2-Column War-Room Grid: LHS Incident Timeline (7 cols) + RHS Retraining & Form (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LHS: Filters & Timeline */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-wrap gap-2 p-3 rounded-2xl border border-surface-border bg-surface-card items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <select
                id="fhazard"
                value={filterHazard}
                onChange={e => setFilterHazard(e.target.value)}
                className="bg-slate-900 border border-surface-border rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-primary-500 capitalize"
              >
                <option value="all">All Hazards</option>
                {HAZARD_TYPES.map(h => <option key={h} value={h}>{h}</option>)}
              </select>

              <input
                id="farea"
                value={filterArea}
                onChange={e => setFilterArea(e.target.value)}
                placeholder="Filter area (e.g. Patto)..."
                className="bg-slate-900 border border-surface-border rounded-xl px-3 py-1.5 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-primary-500"
              />
            </div>

            <button
              onClick={load}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-surface-border bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} aria-hidden /> Apply Filter
            </button>
          </div>

          {/* Timeline Output */}
          {error
            ? <ErrorState message={error} onRetry={load} />
            : loading
              ? <div className="space-y-3">{[...Array(3)].map((_,i) => <SkeletonCard key={i} />)}</div>
              : filtered.length === 0
                ? <EmptyState title="No incidents found" message="Adjust filters or create the first incident record." />
                : <IncidentTimeline incidents={filtered} />
          }
        </div>

        {/* RHS: Retraining Trigger Hub + Create Incident Form */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* 1. Retraining Trigger Hub — Inspira BorderBeam + ShimmerButton + TypewriterText */}
          <div className="relative rounded-2xl border border-purple-700/50 bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 p-5 space-y-4 shadow-xl shadow-purple-950/20 overflow-hidden">
            <BorderBeam size={220} duration={9} colorFrom="#a855f7" colorTo="#3b82f6" borderWidth={1.5} />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <Cpu size={18} className="text-purple-400" />
                <h3 className="text-sm font-bold text-slate-100">Model Calibration Hub</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-900/60 text-purple-300 border border-purple-700/50">
                Module 1 &amp; 3 Sync
              </span>
            </div>

            <div className="relative z-10">
              <TypewriterText
                words={[
                  'Feed post-incident evaluations into flood risk pipeline...',
                  'Fine-tune ML thresholds with ground-truth field data...',
                  'Update vulnerability weights from damage severity logs...',
                ]}
                typingSpeed={45}
                deletingSpeed={25}
                pauseMs={2000}
                className="text-xs text-slate-300 leading-relaxed"
                cursorColor="#a855f7"
              />
            </div>

            <div className="relative z-10">
              <ShimmerButton
                onClick={handleRetrain}
                disabled={retraining || !retrainAvail}
                shimmerColor="#e9d5ff"
                background="linear-gradient(135deg, rgba(126, 34, 206, 0.95), rgba(88, 28, 135, 0.95))"
                className="w-full py-2.5 rounded-xl text-white font-semibold text-xs shadow-md"
              >
                <Cpu size={14} className={retraining ? 'animate-spin' : ''} />
                {retraining ? 'Retraining ML Risk Models...' : 'Trigger Model Retraining'}
              </ShimmerButton>
            </div>

            {retrainResult && (
              <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 animate-slide-up ${
                retrainResult.ok
                  ? 'bg-purple-950/60 border-purple-700/50 text-purple-200'
                  : 'bg-red-950/60 border-red-700/50 text-red-300'
              }`}>
                {retrainResult.ok ? <SparklesIcon size={14} className="shrink-0 mt-0.5 text-purple-400" /> : <Info size={14} className="shrink-0 mt-0.5 text-red-400" />}
                <span>{retrainResult.msg}</span>
              </div>
            )}
          </div>

          {/* 2. Create Incident Post-Mortem Form */}
          <div className="rounded-2xl border border-surface-border bg-surface-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-surface-border">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Plus size={16} className="text-primary-400" /> Record Field Post-Mortem
              </h3>
              <span className="text-[11px] text-slate-500">Official Evaluation</span>
            </div>

            {successNote && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 size={15} /> {successNote}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1" htmlFor="inc-area">Area / Ward *</label>
                  <input
                    id="inc-area"
                    type="text"
                    required
                    value={form.area}
                    placeholder="e.g. Patto"
                    onChange={e => setForm(f => ({...f, area: e.target.value}))}
                    className="w-full bg-slate-900 border border-surface-border rounded-xl px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1" htmlFor="inc-date">Date *</label>
                  <input
                    id="inc-date"
                    type="date"
                    required
                    value={form.date}
                    onChange={e => setForm(f => ({...f, date: e.target.value}))}
                    className="w-full bg-slate-900 border border-surface-border rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1" htmlFor="inc-hazard">Hazard</label>
                  <select
                    id="inc-hazard"
                    value={form.hazard_type}
                    onChange={e => setForm(f => ({...f, hazard_type: e.target.value}))}
                    className="w-full bg-slate-900 border border-surface-border rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-primary-500 capitalize"
                  >
                    {HAZARD_TYPES.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1" htmlFor="inc-dmg">Damage Level</label>
                  <select
                    id="inc-dmg"
                    value={form.damage_level}
                    onChange={e => setForm(f => ({...f, damage_level: e.target.value}))}
                    className="w-full bg-slate-900 border border-surface-border rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-primary-500 capitalize"
                  >
                    {DAMAGE_LEVELS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1" htmlFor="inc-hh">Affected Households</label>
                <input
                  id="inc-hh"
                  type="number"
                  min="0"
                  value={form.affected_households}
                  placeholder="e.g. 45"
                  onChange={e => setForm(f => ({...f, affected_households: e.target.value}))}
                  className="w-full bg-slate-900 border border-surface-border rounded-xl px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1" htmlFor="inc-what_flooded">What Flooded / Damage Observed *</label>
                <textarea
                  id="inc-what_flooded"
                  rows={2}
                  required
                  value={form.what_flooded}
                  placeholder="Details of water level, street inundation..."
                  onChange={e => setForm(f => ({...f, what_flooded: e.target.value}))}
                  className="w-full bg-slate-900 border border-surface-border rounded-xl px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1" htmlFor="inc-what_worked">What Worked</label>
                  <textarea
                    id="inc-what_worked"
                    rows={2}
                    value={form.what_worked}
                    placeholder="e.g. Early sirens, community boat..."
                    onChange={e => setForm(f => ({...f, what_worked: e.target.value}))}
                    className="w-full bg-slate-900 border border-surface-border rounded-xl px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1" htmlFor="inc-what_failed">What Failed</label>
                  <textarea
                    id="inc-what_failed"
                    rows={2}
                    value={form.what_failed}
                    placeholder="e.g. Mobile network dropped..."
                    onChange={e => setForm(f => ({...f, what_failed: e.target.value}))}
                    className="w-full bg-slate-900 border border-surface-border rounded-xl px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Incident to Knowledge Base'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
