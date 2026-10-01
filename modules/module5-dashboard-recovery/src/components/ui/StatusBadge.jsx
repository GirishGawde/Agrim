/**
 * StatusBadge — colour-blind-safe status/risk badge with icon + label.
 * Never relies on colour alone.
 */
import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Loader2 } from 'lucide-react';

const STATUS_MAP = {
  open:     { label: 'Open',     icon: Clock,         cls: 'bg-amber-900/40  text-amber-300  border-amber-600/40'  },
  assigned: { label: 'Assigned', icon: Loader2,       cls: 'bg-blue-900/40   text-blue-300   border-blue-600/40'   },
  resolved: { label: 'Resolved', icon: CheckCircle2,  cls: 'bg-emerald-900/40 text-emerald-300 border-emerald-600/40' },
  pending:  { label: 'Pending',  icon: Clock,         cls: 'bg-amber-900/40  text-amber-300  border-amber-600/40'  },
  approved: { label: 'Approved', icon: CheckCircle2,  cls: 'bg-emerald-900/40 text-emerald-300 border-emerald-600/40' },
  rejected: { label: 'Rejected', icon: AlertTriangle, cls: 'bg-red-900/40    text-red-300    border-red-600/40'    },
};

const RISK_MAP = {
  low:    { label: 'Low',    cls: 'bg-emerald-900/40 text-emerald-300 border-emerald-600/40' },
  medium: { label: 'Medium', cls: 'bg-amber-900/40   text-amber-300   border-amber-600/40'  },
  high:   { label: 'High',   cls: 'bg-red-900/40     text-red-300     border-red-600/40'    },
};

export function StatusBadge({ status, className = '' }) {
  const cfg = STATUS_MAP[status] || { label: status, icon: Clock, cls: 'bg-slate-700 text-slate-300 border-slate-600' };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border
      animate-fade-in transition-all ${cfg.cls} ${className}`}
      aria-label={`Status: ${cfg.label}`}
    >
      <Icon size={11} aria-hidden />
      {cfg.label}
    </span>
  );
}

export function RiskBadge({ level, className = '' }) {
  const cfg = RISK_MAP[level] || { label: level, cls: 'bg-slate-700 text-slate-300 border-slate-600' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border
      ${cfg.cls} ${className}`}
      aria-label={`Risk: ${cfg.label}`}
    >
      <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-current" />
      {cfg.label} Risk
    </span>
  );
}
