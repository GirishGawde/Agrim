/**
 * Skeleton loaders and empty/error state components.
 */
import React from 'react';
import { AlertTriangle, InboxIcon } from 'lucide-react';

export function Skeleton({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-slate-700/50 ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr aria-hidden="true">
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function EmptyState({ title = 'Nothing here yet', message = '', icon: Icon = InboxIcon }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3" role="status">
      <Icon size={40} strokeWidth={1} />
      <p className="font-medium text-slate-400">{title}</p>
      {message && <p className="text-sm text-center max-w-xs">{message}</p>}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-red-400 gap-3" role="alert">
      <AlertTriangle size={36} />
      <p className="font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-1.5 text-sm rounded-lg bg-red-900/40 border border-red-600/40 hover:bg-red-800/50 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
