/**
 * Sparkles — React port of Inspira UI Sparkles.vue
 * Canvas-based floating sparkle particles background.
 */
import React, { useEffect, useRef } from 'react';

export function Sparkles({
  particleColor = '#ffffff',
  minSize = 1,
  maxSize = 2.5,
  speed = 3,
  particleDensity = 80,
  className = '',
  children,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctxRef.current = canvas.getContext('2d');
      if (ctxRef.current) ctxRef.current.scale(dpr, dpr);
    };

    resize();

    // Generate particles
    const baseSpeed = 0.05;
    particlesRef.current = Array.from({ length: particleDensity }, () => {
      const sv = Math.random() * 0.3 + 0.7;
      return {
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (maxSize - minSize) + minSize,
        opacity: Math.random() * 0.5 + 0.3,
        vx: (Math.random() - 0.5) * baseSpeed * sv * speed,
        vy: ((Math.random() - 0.5) * baseSpeed - baseSpeed * 0.3) * sv * speed,
        phase: Math.random() * Math.PI * 2,
      };
    });

    const tick = () => {
      const ctx = ctxRef.current;
      if (!ctx || !canvas) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      particlesRef.current = particlesRef.current.map((p) => {
        let x = p.x + p.vx;
        let y = p.y + p.vy;
        if (x < -2) x = 102;
        if (x > 102) x = -2;
        if (y < -2) y = 102;
        if (y > 102) y = -2;
        const phase = (p.phase + 0.015) % (Math.PI * 2);
        const opacity = 0.3 + (Math.sin(phase) * 0.3 + 0.3);
        const hex = Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc((x * w) / 100, (y * h) / 100, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${particleColor}${hex}`;
        ctx.fill();
        return { ...p, x, y, phase };
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [particleColor, minSize, maxSize, speed, particleDensity]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
