/**
 * TypewriterText — animated typewriter effect with cursor blink.
 * Inspired by Inspira UI typewriter-text component.
 */
import React, { useEffect, useState } from 'react';

export function TypewriterText({
  words = ['Hello', 'World'],
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseMs = 1500,
  className = '',
  cursorColor = '#3b82f6',
}) {
  const [displayed, setDisplayed] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const blink = setInterval(() => setShowCursor(c => !c), 530);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    let timeout;

    if (!isDeleting && displayed === current) {
      timeout = setTimeout(() => setIsDeleting(true), pauseMs);
    } else if (isDeleting && displayed === '') {
      setIsDeleting(false);
      setWordIndex(i => (i + 1) % words.length);
    } else {
      timeout = setTimeout(() => {
        setDisplayed(isDeleting
          ? current.slice(0, displayed.length - 1)
          : current.slice(0, displayed.length + 1)
        );
      }, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseMs]);

  return (
    <span className={className}>
      {displayed}
      <span
        style={{ color: cursorColor, opacity: showCursor ? 1 : 0, transition: 'opacity 0.1s' }}
        aria-hidden
      >|</span>
    </span>
  );
}
