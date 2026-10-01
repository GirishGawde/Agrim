import React, { useMemo } from 'react';

/**
 * Meteors — Inspira UI component.
 * Atmospheric shooting stars falling across the container.
 */
export function Meteors({ count = 16, className = '' }) {
  const meteors = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      top: -20,
      left: Math.floor(Math.random() * 800 - 200),
      delay: `${(Math.random() * 0.8 + 0.2).toFixed(2)}s`,
      duration: `${Math.floor(Math.random() * 6 + 3)}s`,
    }));
  }, [count]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {meteors.map((m) => (
        <span
          key={m.id}
          style={{
            top: m.top,
            left: `${m.left}px`,
            animationDelay: m.delay,
            animationDuration: m.duration,
          }}
          className="animate-meteor-effect absolute h-0.5 w-0.5 rotate-[215deg] rounded-full bg-slate-400 shadow-[0_0_0_1px_#ffffff20] before:absolute before:top-1/2 before:h-px before:w-[60px] before:-translate-y-1/2 before:bg-gradient-to-r before:from-blue-400 before:to-transparent"
        />
      ))}
    </div>
  );
}
