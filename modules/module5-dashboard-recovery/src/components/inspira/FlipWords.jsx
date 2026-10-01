/**
 * FlipWords — animated word flip/cycle component.
 * Inspired by Inspira UI flip-words component.
 */
import React, { useEffect, useState } from 'react';

export function FlipWords({
  words = [],
  duration = 3000,
  className = '',
}) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (words.length < 2) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % words.length);
        setVisible(true);
      }, 300);
    }, duration);
    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-8px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
    >
      {words[index]}
    </span>
  );
}
