/**
 * AnimatedList — React port of Inspira UI AnimatedList.vue
 * Cycles through notification items with smooth entrance/exit animations.
 */
import React, { useEffect, useState, useRef } from 'react';

export function AnimatedList({ items = [], delay = 1200, maxVisible = 5, className = '' }) {
  const [displayed, setDisplayed] = useState([]);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!items.length) return;

    const add = () => {
      const item = items[indexRef.current % items.length];
      const id = `${indexRef.current}-${Date.now()}`;
      indexRef.current++;
      setDisplayed(prev => {
        const next = [{ ...item, _id: id }, ...prev];
        return next.slice(0, maxVisible);
      });
    };

    add();
    const interval = setInterval(add, delay);
    return () => clearInterval(interval);
  }, [items, delay, maxVisible]);

  return (
    <div className={`flex flex-col gap-2 overflow-hidden ${className}`}>
      {displayed.map((item, i) => (
        <div
          key={item._id}
          className="animate-slide-up"
          style={{
            opacity: Math.max(0.3, 1 - i * 0.15),
            transform: `scale(${Math.max(0.94, 1 - i * 0.015)})`,
            transformOrigin: 'top',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {typeof item.render === 'function' ? item.render() : (
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/70 border border-surface-border/60">
              {item.icon && <span className="mt-0.5 shrink-0">{item.icon}</span>}
              <div className="flex-1 min-w-0">
                {item.title && <p className="text-xs font-semibold text-slate-200 truncate">{item.title}</p>}
                {item.text && <p className="text-[11px] text-slate-400 leading-relaxed">{item.text}</p>}
              </div>
              {item.time && <span className="text-[10px] text-slate-500 shrink-0">{item.time}</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
