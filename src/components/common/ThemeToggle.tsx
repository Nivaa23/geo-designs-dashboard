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
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#F8FAFC',
          border: `1px solid ${isOpen ? activeOption.color : '#E2E8F0'}`,
          color: activeOption.color,
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#FFFFFF';
          e.currentTarget.style.borderColor = activeOption.color;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#F8FAFC';
          e.currentTarget.style.borderColor = isOpen ? activeOption.color : '#E2E8F0';
        }}
      >
        <Palette size={16} />
      </button>

      {/* Light Theme Popover Surface */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-label="Color Theme Options"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '250px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.1)',
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
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#0F172A',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                COLOR ACCENT
              </span>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 650,
                color: activeOption.color,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              {activeOption.name}
            </span>
          </div>

          <p
            style={{
              fontSize: '12px',
              color: '#64748B',
              fontFamily: 'var(--font-sans)',
              marginBottom: '8px'
            }}
          >
            Select workspace accent theme
          </p>

          <div
            style={{
              height: '1px',
              backgroundColor: '#F1F5F9',
              marginBottom: '8px'
            }}
          />

          {/* 2-Column Grid of Swatch Cards */}
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
                    height: '32px',
                    padding: '0 8px',
                    borderRadius: '6px',
                    border: isSelected
                      ? `1px solid ${item.color}`
                      : '1px solid #E2E8F0',
                    backgroundColor: isSelected
                      ? '#F0F9FF'
                      : '#F8FAFC',
                    color: isSelected ? '#0F172A' : '#475569',
                    fontSize: '12px',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: isSelected ? 650 : 500,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#CBD5E1';
                      e.currentTarget.style.color = '#0F172A';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.color = '#475569';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '3px',
                        backgroundColor: item.color,
                        flexShrink: 0
                      }}
                    />
                    <span>{item.name}</span>
                  </div>
                  {isSelected && <Check size={12} style={{ color: item.color }} />}
                </button>
              );
            })}
          </div>

          {/* Footer Status Bar */}
          <div
            style={{
              marginTop: '8px',
              paddingTop: '6px',
              borderTop: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#64748B',
              fontFamily: 'var(--font-sans)'
            }}
          >
            <span>Geo Theme Engine</span>
            <span style={{ color: activeOption.color, fontWeight: 650 }}>{activeOption.description}</span>
          </div>
        </div>
      )}
    </div>
  );
};
