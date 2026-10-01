/**
 * AnimatedTabs — Inspira UI-inspired tabs with animated underline (React re-impl).
 */
import React, { useRef, useState, useEffect } from 'react';

export function AnimatedTabs({ tabs, activeTab, onChange, className = '' }) {
  const tabsRef = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    const el = tabsRef.current[activeTab];
    if (el) {
      setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [activeTab]);

  return (
    <div className={`relative flex gap-1 bg-surface-card rounded-xl p-1 ${className}`} role="tablist">
      {/* Sliding indicator */}
      <span
        aria-hidden
        className="absolute bottom-1 h-0.5 bg-primary-400 rounded-full transition-all duration-200"
        style={{ left: indicatorStyle.left ?? 0, width: indicatorStyle.width ?? 0 }}
      />
      {tabs.map(tab => (
        <button
          key={tab.key}
          ref={el => { tabsRef.current[tab.key] = el; }}
          role="tab"
          aria-selected={activeTab === tab.key}
          onClick={() => onChange(tab.key)}
          className={`relative z-10 px-4 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-400
            ${activeTab === tab.key
              ? 'text-primary-300 bg-primary-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
