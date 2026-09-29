import React from 'react';

interface GeoBrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubTag?: boolean;
  theme?: 'dark' | 'light';
}

export const GeoBrandLogo: React.FC<GeoBrandLogoProps> = ({ 
  size = 'md', 
  showSubTag = true,
  theme = 'dark'
}) => {
  const iconSizes = {
    sm: 28,
    md: 36,
    lg: 44
  };

  const titleSizes = {
    sm: '1rem',
    md: '1.2rem',
    lg: '30px'
  };

  const dim = iconSizes[size];

  const titleColor = theme === 'light' ? '#0F172A' : '#F8FAFC';
  const subtitleColor = theme === 'light' ? '#475569' : 'var(--text-left-secondary)';
  const subtagColor = theme === 'light' ? 'var(--color-accent-600)' : 'var(--color-accent-300)';

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
        <rect width="40" height="40" rx="9" fill="#151D2F" />
        <path d="M20 8L30 14V26L20 32L10 26V14L20 8Z" stroke="var(--color-accent-500)" strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="3.5" fill="var(--color-accent-300)" />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span 
          style={{ 
            fontFamily: 'var(--font-sans)',
            fontSize: titleSizes[size], 
            fontWeight: 700, 
            letterSpacing: '-0.025em',
            color: titleColor,
            lineHeight: 1.1
          }}
        >
          Geo Designs <span style={{ color: subtitleColor, fontWeight: 400 }}>&amp; Research</span>
        </span>

        {showSubTag && (
          <span 
            style={{ 
              fontFamily: 'var(--font-sans)',
              fontSize: '0.62rem', 
              fontWeight: 600, 
              letterSpacing: '0.12em', 
              color: subtagColor,
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
