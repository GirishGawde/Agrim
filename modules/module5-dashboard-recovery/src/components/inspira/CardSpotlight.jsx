import React, { useRef, useState, useCallback } from 'react';

/**
 * CardSpotlight — Inspira UI component.
 * Tracks mouse position over the card and projects a luminous radial gradient spotlight.
 */
export function CardSpotlight({
  children,
  className = '',
  slotClass = '',
  gradientSize = 250,
  gradientColor = 'rgba(59, 130, 246, 0.15)', // default primary blue
  gradientOpacity = 0.8,
  ...props
}) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: -gradientSize, y: -gradientSize });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback((e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setOpacity(gradientOpacity);
  }, [gradientOpacity]);

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
  }, []);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden rounded-2xl border border-surface-border bg-surface-card text-slate-100 transition-all duration-300 ${className}`}
      {...props}
    >
      <div className={`relative z-10 ${slotClass}`}>
        {children}
      </div>

      {/* Inspira spotlight radial gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-500 ease-out"
        style={{
          opacity,
          background: `radial-gradient(circle ${gradientSize}px at ${position.x}px ${position.y}px, ${gradientColor} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}
