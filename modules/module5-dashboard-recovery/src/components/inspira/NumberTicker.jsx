import React, { useEffect, useState, useRef } from 'react';

/**
 * NumberTicker — Inspira UI component.
 * Smooth animated counter with easing curve for stats and KPIs.
 */
export function NumberTicker({
  value = 0,
  direction = 'up',
  duration = 800, // ms
  decimalPlaces = 0,
  className = '',
}) {
  const [displayValue, setDisplayValue] = useState(direction === 'down' ? value : 0);
  const startRef = useRef(null);
  const targetRef = useRef(value);

  useEffect(() => {
    targetRef.current = value;
    const startVal = displayValue;
    const endVal = value;
    let animationFrameId;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutExpo easing curve
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startVal + (endVal - startVal) * easedProgress;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endVal);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(displayValue);

  return (
    <span className={`inline-block tracking-tight tabular-nums ${className}`}>
      {formatted}
    </span>
  );
}
