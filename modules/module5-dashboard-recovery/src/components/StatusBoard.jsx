import React from 'react';
import { CardSpotlight, NumberTicker } from './inspira/index.js';
import { TrendingUp, AlertTriangle, CheckCircle2, MapPin } from 'lucide-react';

/**
 * StatusBoard — Inspira UI powered summary cards for the AuthorityDashboard.
 * Features dynamic spotlight cursor tracking and animated NumberTickers.
 */
export function StatusBoard({ counts, highRiskAreas }) {
  const cards = [
    {
      label: 'Open Reports',
      value: counts.open ?? 0,
      icon: AlertTriangle,
      color: 'rgba(245, 158, 11, 0.22)',
      iconCls: 'text-amber-400',
      badge: 'Active Surge',
    },
    {
      label: 'Assigned Responders',
      value: counts.assigned ?? 0,
      icon: TrendingUp,
      color: 'rgba(59, 130, 246, 0.22)',
      iconCls: 'text-blue-400',
      badge: 'Dispatched',
    },
    {
      label: 'Resolved Incidents',
      value: counts.resolved ?? 0,
      icon: CheckCircle2,
      color: 'rgba(16, 185, 129, 0.22)',
      iconCls: 'text-emerald-400',
      badge: 'Safe',
    },
    {
      label: 'High-Risk Zones',
      value: highRiskAreas?.length ?? 0,
      icon: MapPin,
      color: 'rgba(239, 68, 68, 0.22)',
      iconCls: 'text-red-400',
      detail: highRiskAreas?.join(', ') || 'No critical zones',
      badge: 'Perimeter',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => (
        <CardSpotlight
          key={card.label}
          gradientColor={card.color}
          gradientSize={260}
          className="p-5 relative overflow-hidden border-surface-border shadow-sm hover:border-slate-600"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.label}</span>
            <div className="p-2 rounded-xl bg-slate-800/80 border border-surface-border/60">
              <card.icon size={16} className={card.iconCls} aria-hidden />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              <NumberTicker value={card.value} />
            </p>
            {card.badge && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-surface-border/60">
                {card.badge}
              </span>
            )}
          </div>

          {card.detail && (
            <p className="mt-2 text-xs text-slate-400 truncate" title={card.detail}>
              {card.detail}
            </p>
          )}
        </CardSpotlight>
      ))}
    </div>
  );
}
