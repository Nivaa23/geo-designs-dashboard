import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'absolute' | 'inline';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'absolute' }) => {
  const { theme, toggleTheme } = useAuth();
  const isDark = theme === 'dark';

  const isInline = variant === 'inline';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      style={{
        position: isInline ? 'relative' : 'absolute',
        top: isInline ? 'auto' : '1.5rem',
        right: isInline ? 'auto' : '1.5rem',
        zIndex: 10,
        width: '36px',
        height: '36px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : '#CBD5E1'}`,
        color: isDark ? '#F8FAFC' : '#0F172A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        outline: 'none',
        flexShrink: 0
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.12)' : '#E2E8F0';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9';
      }}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};
