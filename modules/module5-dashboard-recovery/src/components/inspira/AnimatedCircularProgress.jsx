/**
 * AnimatedCircularProgress — React port of Inspira UI AnimatedCircularProgressBar
 * Smooth SVG ring with animated stroke and centered label.
 */
import React, { useEffect, useRef, useState } from 'react';

export function AnimatedCircularProgress({
  value = 0,
  max = 100,
  min = 0,
  size = 120,
  strokeWidth = 10,
  primaryColor = '#3b82f6',
  secondaryColor = 'rgba(255,255,255,0.08)',
  label,
  sublabel,
  duration = 1200,
  className = '',
}) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(pct * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pct, duration]);

  const strokeDash = (displayed / 100) * circumference;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r={radius} fill="none" stroke={secondaryColor} strokeWidth={strokeWidth} />
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={primaryColor} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          {label !== undefined ? (
            <span className="text-sm font-extrabold text-slate-100 font-mono leading-none">{label}</span>
          ) : (
            <span className="text-sm font-extrabold text-slate-100 font-mono leading-none">{Math.round(displayed)}%</span>
          )}
          {sublabel && <span className="text-[9px] text-slate-400 text-center leading-tight px-1">{sublabel}</span>}
        </div>
      </div>
    </div>
  );
}
