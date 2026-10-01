/**
 * IncidentTimeline — Inspira UI-inspired timeline component.
 * Shows a vertical list of incident events.
 */
import React from 'react';
import { format } from 'date-fns';
import { Waves, Mountain, Flame, HelpCircle } from 'lucide-react';

const HAZARD_ICONS = {
  flood: Waves,
  landslide: Mountain,
  fire: Flame,
};

const DAMAGE_COLOURS = {
  minor:    'border-emerald-600 bg-emerald-900/30',
  moderate: 'border-amber-600 bg-amber-900/30',
  severe:   'border-red-600 bg-red-900/30',
};

export function IncidentTimeline({ incidents }) {
  if (!incidents?.length) return null;

  return (
    <ol className="relative border-l-2 border-surface-border ml-4 space-y-6" aria-label="Incident timeline">
      {incidents.map((inc, idx) => {
        const Icon = HAZARD_ICONS[inc.hazard_type] || HelpCircle;
        const dmgCls = DAMAGE_COLOURS[inc.damage_level] || 'border-slate-600 bg-slate-800';
        return (
          <li key={inc.id} className="ml-6 animate-slide-up" style={{ animationDelay: `${idx * 40}ms` }}>
            {/* Dot */}
            <span className={`absolute -left-[13px] flex items-center justify-center w-6 h-6 rounded-full border-2 ${dmgCls}`}>
              <Icon size={12} aria-hidden />
            </span>

            <article className="p-4 rounded-xl border border-surface-border bg-surface-card hover:border-slate-600 transition-colors">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <time className="text-xs text-slate-500" dateTime={inc.date}>
                  {format(new Date(inc.date), 'dd MMM yyyy')}
                </time>
                <span className="text-xs font-medium text-slate-300 capitalize">{inc.hazard_type}</span>
                <span className="text-xs text-slate-500">· {inc.area}</span>
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full border ${dmgCls} capitalize`}>
                  {inc.damage_level}
                </span>
              </div>

              {inc.what_flooded && (
                <p className="text-sm text-slate-300 mb-2"><strong>What happened:</strong> {inc.what_flooded}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                {inc.what_worked && (
                  <div className="flex gap-1">
                    <span className="text-emerald-400 shrink-0">✓</span>
                    <span><strong>Worked:</strong> {inc.what_worked}</span>
                  </div>
                )}
                {inc.what_failed && (
                  <div className="flex gap-1">
                    <span className="text-red-400 shrink-0">✗</span>
                    <span><strong>Failed:</strong> {inc.what_failed}</span>
                  </div>
                )}
              </div>

              {inc.notes && (
                <p className="mt-2 text-xs text-slate-500 italic">{inc.notes}</p>
              )}
            </article>
          </li>
        );
      })}
    </ol>
  );
}
