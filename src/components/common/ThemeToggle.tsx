import React, { useState, useRef, useEffect } from 'react';
import { useAuth, type ColorTheme } from '../../context/AuthContext';
import { Palette, Check, Sliders } from 'lucide-react';

interface ColorThemeOption {
  id: ColorTheme;
  name: string;
  color: string;
  description: string;
}

const COLOR_THEMES: ColorThemeOption[] = [
  { id: 'blue', name: 'Blue', color: '#0284C7', description: 'Geo Standard' },
  { id: 'green', name: 'Green', color: '#10B981', description: 'Field Emerald' },
  { id: 'neutral', name: 'Neutral', color: '#64748B', description: 'Slate Steel' },
  { id: 'orange', name: 'Orange', color: '#F97316', description: 'Safety Amber' },
  { id: 'red', name: 'Red', color: '#EF4444', description: 'Signal Red' },
  { id: 'rose', name: 'Rose', color: '#F43F5E', description: 'Research Magenta' },
  { id: 'violet', name: 'Violet', color: '#8B5CF6', description: 'Deep Indigo' },
  { id: 'yellow', name: 'Yellow', color: '#EAB308', description: 'Cadastral Gold' }
];

interface ThemeToggleProps {
  variant?: 'absolute' | 'inline';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'absolute' }) => {
  const { colorTheme, setColorTheme } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isInline = variant === 'inline';
  const activeOption = COLOR_THEMES.find((t) => t.id === colorTheme) || COLOR_THEMES[0];

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTheme = (selectedId: ColorTheme) => {
    setColorTheme(selectedId);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: isInline ? 'relative' : 'fixed',
        top: isInline ? 'auto' : '1.25rem',
        right: isInline ? 'auto' : '1.25rem',
        zIndex: 9999,
        display: 'inline-flex',
        alignItems: 'center'
      }}
    >
      {/* Icon-Only Palette Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Color Theme Selector (Active: ${activeOption.name})`}
        title={`Color Theme Selector (Active: ${activeOption.name})`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '38px',
          height: '38px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#0B101D',
          border: `1px solid ${isOpen ? activeOption.color : 'rgba(255, 255, 255, 0.16)'}`,
          color: activeOption.color,
          cursor: 'pointer',
          boxShadow: isOpen
            ? `0 0 14px ${activeOption.color}40, 0 2px 8px rgba(0, 0, 0, 0.5)`
            : '0 2px 8px rgba(0, 0, 0, 0.4)',
          transition: 'all var(--transition-fast)',
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#151D2F';
          e.currentTarget.style.borderColor = activeOption.color;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#0B101D';
          e.currentTarget.style.borderColor = isOpen ? activeOption.color : 'rgba(255, 255, 255, 0.16)';
        }}
      >
        <Palette size={18} />
      </button>

      {/* Structured Engineering Popover Surface */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-label="Color Theme Options"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '260px',
            backgroundColor: '#0B101D',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '10px',
            boxShadow: '0 16px 36px -4px rgba(0, 0, 0, 0.75), 0 4px 12px -2px rgba(0, 0, 0, 0.5)',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10000,
            animation: 'fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header Lockup */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sliders size={13} style={{ color: activeOption.color }} />
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#F8FAFC',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                COLOR THEME
              </span>
            </div>
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 600,
                color: activeOption.color,
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
            >
              {activeOption.name}
            </span>
          </div>

          <p
            style={{
              fontSize: '0.72rem',
              color: '#94A3B8',
              fontFamily: 'var(--font-sans)',
              marginBottom: '10px'
            }}
          >
            Select workspace accent palette
          </p>

          <div
            style={{
              height: '1px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              marginBottom: '10px'
            }}
          />

          {/* 2-Column Grid of Micro Theme Swatch Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px'
            }}
          >
            {COLOR_THEMES.map((item) => {
              const isSelected = item.id === colorTheme;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelectTheme(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '34px',
                    padding: '0 8px',
                    borderRadius: '6px',
                    border: isSelected
                      ? `1px solid ${item.color}`
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: isSelected
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(255, 255, 255, 0.02)',
                    color: isSelected ? '#F8FAFC' : '#94A3B8',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                    boxShadow: isSelected ? `0 0 8px ${item.color}25` : 'none',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.currentTarget.style.color = '#F8FAFC';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.color = '#94A3B8';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '3px',
                        backgroundColor: item.color,
                        flexShrink: 0,
                        boxShadow: isSelected ? `0 0 6px ${item.color}` : 'none'
                      }}
                    />
                    <span>{item.name}</span>
                  </div>
                  {isSelected && <Check size={13} style={{ color: item.color }} />}
                </button>
              );
            })}
          </div>

          {/* Footer Status Bar */}
          <div
            style={{
              marginTop: '10px',
              paddingTop: '8px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.66rem',
              color: '#64748B',
              fontFamily: 'var(--font-sans)'
            }}
          >
            <span>Geo Design System</span>
            <span style={{ color: activeOption.color, fontWeight: 600 }}>{activeOption.description}</span>
          </div>
        </div>
      )}
    </div>
  );
};


