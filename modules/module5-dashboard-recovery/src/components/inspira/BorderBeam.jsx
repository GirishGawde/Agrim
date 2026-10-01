import React from 'react';

/**
 * BorderBeam — Inspira UI component.
 * An animated glowing gradient beam that traces around the border of any container.
 */
export function BorderBeam({
  className = '',
  size = 200,
  duration = 10,
  borderWidth = 1.5,
  colorFrom = '#f59e0b',
  colorTo = '#ef4444',
  delay = 0,
}) {
  return (
    <div
      style={{
        '--size': `${size}px`,
        '--duration': `${duration}s`,
        '--delay': `${delay}s`,
        '--border-width': `${borderWidth}px`,
        '--color-from': colorFrom,
        '--color-to': colorTo,
      }}
      className={`pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          padding: `${borderWidth}px`,
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, var(--color-from) 60deg, var(--color-to) 120deg, transparent 180deg)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          animation: `spin-beam var(--duration) linear infinite`,
          animationDelay: 'var(--delay)',
        }}
      />
      <style>{`
        @keyframes spin-beam {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
