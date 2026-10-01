import React from 'react';
import { CardSpotlight } from './CardSpotlight.jsx';

/**
 * BentoGrid & BentoCard — Inspira UI components.
 * High-density modern grid system for dashboard layouts.
 */
export function BentoGrid({ children, className = '' }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr ${className}`}>
      {children}
    </div>
  );
}

export function BentoCard({
  icon: Icon,
  title,
  description,
  header,
  footer,
  className = '',
  spotlightColor = 'rgba(59, 130, 246, 0.15)',
  children,
  ...props
}) {
  return (
    <CardSpotlight
      gradientColor={spotlightColor}
      className={`p-5 flex flex-col justify-between group hover:border-slate-600 transition-all ${className}`}
      {...props}
    >
      <div>
        {header && <div className="mb-3">{header}</div>}
        <div className="flex items-center gap-2 mb-2">
          {Icon && (
            <div className="p-2 rounded-xl bg-slate-800/80 border border-surface-border text-primary-400 group-hover:text-primary-300 transition-colors">
              <Icon size={16} />
            </div>
          )}
          {title && <h3 className="text-sm font-bold text-slate-100">{title}</h3>}
        </div>
        {description && <p className="text-xs text-slate-400 leading-relaxed">{description}</p>}
        {children}
      </div>
      {footer && <div className="mt-4 pt-3 border-t border-surface-border/60">{footer}</div>}
    </CardSpotlight>
  );
}
