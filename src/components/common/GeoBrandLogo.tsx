import React from 'react';

interface GeoBrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
  showSubTag?: boolean;
}

export const GeoBrandLogo: React.FC<GeoBrandLogoProps> = ({ 
  size = 'md', 
  theme = 'dark',
  showSubTag = true 
}) => {
  const iconSizes = {
    sm: 28,
    md: 36,
    lg: 44
  };

  const titleSizes = {
    sm: '1rem',
    md: '1.2rem',
    lg: '1.45rem'
  };

  const dim = iconSizes[size];
  const isDarkTheme = theme === 'dark';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.85rem', userSelect: 'none' }}>
      {/* Brand SVG Mark */}
      <svg 
        width={dim} 
        height={dim} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="9" fill={isDarkTheme ? '#151D2F' : '#0F172A'} />
        <path d="M20 8L30 14V26L20 32L10 26V14L20 8Z" stroke="#0284C7" strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="3.5" fill="#38BDF8" />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span 
          style={{ 
            fontFamily: 'var(--font-sans)',
            fontSize: titleSizes[size], 
            fontWeight: 700, 
            letterSpacing: '-0.025em',
            color: isDarkTheme ? '#F8FAFC' : '#0F172A',
            lineHeight: 1.1
          }}
        >
          Geo Designs <span style={{ color: isDarkTheme ? 'var(--text-left-secondary)' : '#64748B', fontWeight: 400 }}>&amp; Research</span>
        </span>

        {showSubTag && (
          <span 
            style={{ 
              fontFamily: 'var(--font-sans)',
              fontSize: '0.62rem', 
              fontWeight: 600, 
              letterSpacing: '0.12em', 
              color: isDarkTheme ? '#38BDF8' : '#0284C7',
              textTransform: 'uppercase',
              marginTop: '3px'
            }}
          >
            ENGINEERING &bull; SURVEYING &bull; RESEARCH
          </span>
        )}
      </div>
    </div>
  );
};
