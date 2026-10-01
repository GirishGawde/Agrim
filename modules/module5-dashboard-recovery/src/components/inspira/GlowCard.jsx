/**
 * GlowCard — card with animated radial border glow following mouse cursor.
 * Inspired by Inspira UI glow-border component.
 */
import React, { useRef, useCallback } from 'react';

export function GlowCard({
  children,
  glowColor = '#3b82f6',
  glowSize = 300,
  glowOpacity = 0.15,
  className = '',
  borderColor = 'rgba(255,255,255,0.08)',
  borderRadius = '1rem',
}) {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.background = `
      radial-gradient(${glowSize}px circle at ${x}px ${y}px, 
        ${glowColor}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')},
        transparent 60%
      )
    `;
  }, [glowColor, glowSize, glowOpacity]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) card.style.background = '';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        border: `1px solid ${borderColor}`,
        borderRadius,
        transition: 'background 0.3s ease',
      }}
    >
      {children}
    </div>
  );
}
