import React from 'react';

/**
 * ShimmerButton — Inspira UI component.
 * A luxury animated button featuring a spinning conic-gradient shimmer and inset shine.
 */
export function ShimmerButton({
  children,
  shimmerColor = '#ffffff',
  shimmerSize = '0.08em',
  borderRadius = '12px',
  shimmerDuration = '3s',
  background = 'rgba(15, 23, 42, 0.95)',
  className = '',
  onClick,
  disabled = false,
  ...props
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        '--spread': '90deg',
        '--shimmer-color': shimmerColor,
        '--radius': borderRadius,
        '--speed': shimmerDuration,
        '--cut': shimmerSize,
        '--bg': background,
      }}
      className={`group relative z-0 flex items-center justify-center overflow-hidden border border-white/10 px-4 py-2 text-xs font-semibold text-white transition-all duration-300 ease-in-out active:translate-y-px disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${className}`}
      {...props}
    >
      {/* Container with blur for spinning conic gradient */}
      <div className="absolute inset-0 -z-30 overflow-hidden blur-[2px] rounded-[inherit]">
        <div
          className="absolute -inset-full animate-shimmer-spin"
          style={{
            background: `conic-gradient(from 225deg, transparent 0deg, var(--shimmer-color) 45deg, transparent 90deg)`,
          }}
        />
      </div>

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-1.5 font-medium tracking-wide">
        {children}
      </span>

      {/* Inset shine effect */}
      <div className="absolute inset-0 size-full rounded-[inherit] shadow-[inset_0_-4px_8px_rgba(255,255,255,0.12)] transition-all duration-300 group-hover:shadow-[inset_0_-2px_6px_rgba(255,255,255,0.25)]" />

      {/* Background layer */}
      <div
        className="absolute inset-[1px] -z-20 rounded-[inherit]"
        style={{ background: 'var(--bg)' }}
      />
    </button>
  );
}
