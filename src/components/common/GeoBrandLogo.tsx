import React from 'react';

interface GeoBrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const GeoBrandLogo: React.FC<GeoBrandLogoProps> = ({ size = 'md' }) => {
  const iconSizes = {
    sm: 26,
    md: 32,
    lg: 40
  };

  const titleSizes = {
    sm: '0.95rem',
    md: '1.1rem',
    lg: '1.35rem'
  };

  const dim = iconSizes[size];

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', userSelect: 'none' }}>
      <svg 
        width={dim} 
        height={dim} 
        viewBox="0 0 36 36" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      >
        <rect width="36" height="36" rx="8" fill="#121929" stroke="#232F48" />
        <path d="M18 7L28 12.5V23.5L18 29L8 23.5V12.5L18 7Z" stroke="#0284C7" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="18" cy="18" r="3" fill="#38BDF8" />
      </svg>

      <span 
        style={{ 
          fontFamily: 'var(--font-sans)',
          fontSize: titleSizes[size], 
          fontWeight: 700, 
          letterSpacing: '-0.02em',
          color: '#F8FAFC',
          lineHeight: 1
        }}
      >
        Geo Designs <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>&amp; Research</span>
      </span>
    </div>
  );
};
