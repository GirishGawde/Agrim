import React from 'react';
import { CardSpotlight } from '../inspira/CardSpotlight.jsx';

/**
 * SpotlightCard — Bridge to Inspira UI's CardSpotlight.
 */
export function SpotlightCard({ children, color, className = '', ...props }) {
  return (
    <CardSpotlight
      gradientColor={color || 'rgba(59, 130, 246, 0.18)'}
      gradientSize={260}
      className={className}
      {...props}
    >
      {children}
    </CardSpotlight>
  );
}
