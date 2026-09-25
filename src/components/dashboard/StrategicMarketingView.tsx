import React, { useState, useMemo } from 'react';
import { MOCK_STRATEGIC_ACTIVITIES } from '../../data/mockStrategicData';
import type { StrategicActivityItem, StrategicArea, StrategicCategory } from '../../types/strategic';
import {
  TrendingUp,
  Search,
  Filter,
  Plus,
  Building2,
  Target,
  Layers,
  X,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  Compass,
  Briefcase
} from 'lucide-react';

interface StrategicMarketingViewProps {
  onReturnToOverview?: () => void;
}

export const StrategicMarketingView: React.FC<StrategicMarketingViewProps> = () => {
  // Main items list state
  const [activities, setActivities] = useState<StrategicActivityItem[]>(MOCK_STRATEGIC_ACTIVITIES);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Active Detail Modal item state
  const [activeDetailItem, setActiveDetailItem] = useState<StrategicActivityItem | null>(null);

  // Create Activity Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArea, setNewArea] = useState<StrategicArea>('Organizational Betterment & Updates');
  const [newCategory, setNewCategory] = useState<StrategicCategory>('Level 1 Organizational Updates');
  const [newScope, setNewScope] = useState('All Engineering Divisions');
  const [newDescription, setNewDescription] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorState, setShowErrorState] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      // Search matching
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.code.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.targetScope && item.targetScope.toLowerCase().includes(query));

      // Area matching
      const matchesArea = selectedArea === 'ALL' || item.area === selectedArea;

      // Category matching
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;

      return matchesSearch && matchesArea && matchesCategory;
    });
  }, [activities, searchQuery, selectedArea, selectedCategory]);

  // Grouped activities for section view
  const orgActivities = useMemo(() => {
    return filteredActivities.filter((a) => a.area === 'Organizational Betterment & Updates');
  }, [filteredActivities]);

  const mktActivities = useMemo(() => {
    return filteredActivities.filter((a) => a.area === 'Marketing Vision & New-Work Planning');
  }, [filteredActivities]);

  // Handle Refresh simulation
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showSuccessNotification('Strategic activities workspace refreshed.');
    }, 350);
  };

  // Helper for success notifications
  const showSuccessNotification = (msg: string) => {
    setSuccessBanner(msg);
    setTimeout(() => {
      setSuccessBanner(null);
    }, 3500);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedArea('ALL');
    setSelectedCategory('ALL');
    setShowErrorState(false);
  };

  // Create Activity Handler
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCodeNum = Math.floor(10 + Math.random() * 90);
    const codePrefix =
      newCategory === 'New-Work Planning'
        ? 'STRAT-NWP'
        : newCategory.includes('Organizational')
        ? 'STRAT-ORG'
        : 'STRAT-MKT';

    const newItem: StrategicActivityItem = {
      id: `strat-${Date.now()}`,
      code: `${codePrefix}-${newCodeNum}`,
      title: newTitle.trim(),
      description: newDescription.trim() || 'Strategic plan item logged via dashboard workspace.',
      area: newArea,
      category: newCategory,
      dateLogged: '26 Sep 2026',
      targetScope: newScope,
      notes: newNotes.trim() || 'New strategic activity entry recorded.'
    };

    setActivities((prev) => [newItem, ...prev]);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewNotes('');
    showSuccessNotification(`New strategic item ${newItem.code} created successfully.`);
  };

  // Category Icon helper
  const getCategoryIcon = (category: StrategicCategory) => {
    switch (category) {
      case 'Level 1 Organizational Updates':
        return <Building2 size={14} style={{ color: 'var(--color-accent-600)' }} />;
      case 'Level 2 Organizational Updates':
        return <Layers size={14} style={{ color: '#0284C7' }} />;
      case 'Level 1 Marketing Vision & Planning':
        return <Compass size={14} style={{ color: '#7C3AED' }} />;
      case 'Level 2 Marketing Vision & Planning':
        return <Target size={14} style={{ color: '#D97706' }} />;
      case 'New-Work Planning':
        return <Briefcase size={14} style={{ color: '#059669' }} />;
    }
  };

  // Category badge styling helper
  const getCategoryBadgeStyle = (category: StrategicCategory) => {
    switch (category) {
      case 'Level 1 Organizational Updates':
        return { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE', color: '#6D28D9' };
      case 'Level 2 Organizational Updates':
        return { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD', color: '#0369A1' };
      case 'Level 1 Marketing Vision & Planning':
        return { backgroundColor: '#F3E8FF', borderColor: '#E9D5FF', color: '#6B21A8' };
      case 'Level 2 Marketing Vision & Planning':
        return { backgroundColor: '#FFFBEB', borderColor: '#FDE68A', color: '#B45309' };
      case 'New-Work Planning':
        return { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0', color: '#047857' };
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        width: '100%',
        boxSizing: 'border-box',
        textAlign: 'left'
      }}
      className="animate-fade-in"
    >
      {/* SUCCESS NOTIFICATION TOAST BANNER */}
      {successBanner && (
        <div
          style={{
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: '6px',
            padding: '0.65rem 1rem',
            color: '#047857',
            fontSize: '12px',
            fontWeight: 650,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 5px rgba(4, 120, 87, 0.08)',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left' }}>
            <CheckCircle2 size={16} />
            <span>{successBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            style={{ background: 'none', border: 'none', color: '#047857', cursor: 'pointer' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* SECTION 1: PAGE HEADER */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
          textAlign: 'left'
        }}
      >
        <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: 'rgba(109, 40, 217, 0.08)',
                border: '1px solid rgba(109, 40, 217, 0.2)',
                color: 'var(--color-accent-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: '9px',
                flexShrink: 0
              }}
            >
              <TrendingUp size={18} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 700, lineHeight: 1.2, margin: 0, textAlign: 'left' }}>
                Strategic & Marketing Activities
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px', lineHeight: 1.3, textAlign: 'left', maxWidth: '680px' }}>
                Workspace for Level 1 & Level 2 organizational updates, Level 1 & Level 2 marketing vision and planning, and dedicated new-work acquisition planning.
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12px',
              fontWeight: 650,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Plus size={14} />
            New Strategic Item
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: '6px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: '#0F172A',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              whiteSpace: 'nowrap'
            }}
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setShowErrorState((prev) => !prev)}
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: '6px',
              backgroundColor: showErrorState ? '#FEF2F2' : '#F8FAFC',
              border: showErrorState ? '1px solid #FCA5A5' : '1px solid #E2E8F0',
              color: showErrorState ? '#DC2626' : '#64748B',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {showErrorState ? 'Clear Error' : 'Simulate Error'}
          </button>
        </div>
      </div>

      {/* SECTION 2: 5 CONFIRMED CATEGORY FILTER CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '0.75rem',
          width: '100%'
        }}
      >
        {(
          [
            { label: 'Level 1 Org Updates', category: 'Level 1 Organizational Updates' as StrategicCategory },
            { label: 'Level 2 Org Updates', category: 'Level 2 Organizational Updates' as StrategicCategory },
            { label: 'Level 1 Marketing Vision', category: 'Level 1 Marketing Vision & Planning' as StrategicCategory },
            { label: 'Level 2 Marketing Vision', category: 'Level 2 Marketing Vision & Planning' as StrategicCategory },
            { label: 'New-Work Planning', category: 'New-Work Planning' as StrategicCategory }
          ]
        ).map((item) => {
          const count = activities.filter((a) => a.category === item.category).length;
          const isSelected = selectedCategory === item.category;

          return (
            <div
              key={item.category}
              onClick={() => setSelectedCategory(isSelected ? 'ALL' : item.category)}
              style={{
                backgroundColor: '#FFFFFF',
                border: isSelected ? '1.5px solid var(--color-accent-500)' : '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                textAlign: 'left',
                boxShadow: isSelected ? '0 2px 6px rgba(109, 40, 217, 0.08)' : '0 1px 3px rgba(15, 23, 42, 0.02)',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 650, color: '#64748B', textAlign: 'left' }}>
                  {item.label}
                </span>
                {getCategoryIcon(item.category)}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '2px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>
                  {count}
                </span>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
                  Items
                </span>
              </div>

              <div style={{ fontSize: '11px', color: isSelected ? 'var(--color-accent-600)' : '#94A3B8', fontWeight: 600, marginTop: '2px' }}>
                {isSelected ? '✓ Filtered' : 'Click to filter'}
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 3: SEARCH & FILTER TOOLBAR */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.85rem',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
          textAlign: 'left'
        }}
      >
        {/* Search Bar */}
        <div style={{ position: 'relative', flex: '1 1 300px', minWidth: '240px' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94A3B8'
            }}
          />
          <input
            type="text"
            placeholder="Search strategic items, codes, descriptions, target scope..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 2rem 0.45rem 2.1rem',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8FAFC',
              fontSize: '12px',
              color: '#0F172A',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter Selects */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Area Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Filter size={13} style={{ color: '#64748B' }} />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              style={{
                padding: '0.45rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                fontSize: '12px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Strategic Areas</option>
              <option value="Organizational Betterment & Updates">Organizational Betterment & Updates</option>
              <option value="Marketing Vision & New-Work Planning">Marketing Vision & New-Work Planning</option>
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontSize: '12px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Requirement Categories</option>
            <option value="Level 1 Organizational Updates">Level 1 Organizational Updates</option>
            <option value="Level 2 Organizational Updates">Level 2 Organizational Updates</option>
            <option value="Level 1 Marketing Vision & Planning">Level 1 Marketing Vision & Planning</option>
            <option value="Level 2 Marketing Vision & Planning">Level 2 Marketing Vision & Planning</option>
            <option value="New-Work Planning">New-Work Planning</option>
          </select>

          {/* Reset Filters button */}
          {(searchQuery || selectedArea !== 'ALL' || selectedCategory !== 'ALL') && (
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                padding: '0.45rem 0.65rem',
                borderRadius: '6px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#DC2626',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ERROR STATE */}
      {showErrorState ? (
        <div
          style={{
            padding: '2.5rem 1.5rem',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#DC2626' }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: '15px', fontWeight: 700 }}>
              Unable to load strategic activities
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#7F1D1D', margin: 0, textAlign: 'left' }}>
            A data connection error occurred while loading strategic & marketing activities. Please verify connection or retry.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12px',
              fontWeight: 650,
              cursor: 'pointer'
            }}
          >
            Retry Connection
          </button>
        </div>
      ) : isLoading ? (
        /* LOADING STATE */
        <div
          style={{
            padding: '3rem 1.5rem',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}
        >
          <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--color-accent-600)' }} />
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
            Loading Strategic & Marketing Activities...
          </div>
        </div>
      ) : filteredActivities.length === 0 ? (
        /* EMPTY STATE */
        <div
          style={{
            padding: '3rem 1.5rem',
            backgroundColor: '#F8FAFC',
            border: '1px dashed #CBD5E1',
            borderRadius: '8px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            alignItems: 'flex-start'
          }}
        >
          <TrendingUp size={24} style={{ color: '#94A3B8' }} />
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
            No Strategic Activities Found
          </div>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0, textAlign: 'left', maxWidth: '600px' }}>
            No activities match your current search query "{searchQuery}" or selected category filter. Try clearing filters or logging a new strategic item.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '0.5rem'
            }}
          >
            Clear Search & Reset Filters
          </button>
        </div>
      ) : (
        /* MAIN CONTENT DISPLAY: AREA A & AREA B */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', boxSizing: 'border-box' }}>
          {/* AREA A: ORGANIZATIONAL BETTERMENT & UPDATES */}
          {(selectedArea === 'ALL' || selectedArea === 'Organizational Betterment & Updates') && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '1.25rem',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                width: '100%',
                boxSizing: 'border-box',
                textAlign: 'left'
              }}
            >
              {/* Area A Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem', textAlign: 'left' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent-600)', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'left' }}>
                    STRATEGIC AREA A
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginTop: '2px', margin: 0, textAlign: 'left' }}>
                    Organizational Betterment & Updates
                  </h3>
                </div>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                  {orgActivities.length} Record{orgActivities.length === 1 ? '' : 's'}
                </span>
              </div>

              {orgActivities.length === 0 ? (
                <div style={{ fontSize: '12px', color: '#64748B', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '6px', textAlign: 'left' }}>
                  No organizational update records match current filters.
                </div>
              ) : (
                /* Activity Cards for Area A */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                  {orgActivities.map((item) => {
                    const badgeStyle = getCategoryBadgeStyle(item.category);

                    return (
                      <div
                        key={item.id}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '6px',
                          padding: '1rem 1.15rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                          textAlign: 'left',
                          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.02)',
                          transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-500)')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
                      >
                        {/* Row 1: Code & Category */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', textAlign: 'left' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent-600)', backgroundColor: '#F5F3FF', padding: '2px 7px', borderRadius: '4px', border: '1px solid #DDD6FE' }}>
                              {item.code}
                            </span>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 650,
                                padding: '2px 8px',
                                borderRadius: '12px',
                                border: `1px solid ${badgeStyle.borderColor}`,
                                backgroundColor: badgeStyle.backgroundColor,
                                color: badgeStyle.color,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              {getCategoryIcon(item.category)}
                              {item.category}
                            </span>
                          </div>

                          <span style={{ fontSize: '11px', color: '#64748B' }}>
                            Logged: {item.dateLogged}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div style={{ textAlign: 'left' }}>
                          <h4
                            onClick={() => setActiveDetailItem(item)}
                            style={{
                              fontSize: '14px',
                              fontWeight: 700,
                              color: '#0F172A',
                              margin: 0,
                              cursor: 'pointer',
                              lineHeight: 1.3,
                              textAlign: 'left'
                            }}
                          >
                            {item.title}
                          </h4>
                          <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px', marginBottom: 0, lineHeight: 1.4, textAlign: 'left' }}>
                            {item.description}
                          </p>
                        </div>

                        {/* Footer Context */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '0.5rem', marginTop: '0.2rem', textAlign: 'left' }}>
                          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500, textAlign: 'left' }}>
                            Target Scope: <strong>{item.targetScope || 'All Engineering Divisions'}</strong>
                          </div>

                          <button
                            type="button"
                            onClick={() => setActiveDetailItem(item)}
                            style={{
                              padding: '0.25rem 0.55rem',
                              borderRadius: '4px',
                              backgroundColor: '#0F172A',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '11px',
                              fontWeight: 650,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                          >
                            View Details
                            <ChevronRight size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* AREA B: MARKETING VISION & NEW-WORK PLANNING */}
          {(selectedArea === 'ALL' || selectedArea === 'Marketing Vision & New-Work Planning') && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '1.25rem',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                width: '100%',
                boxSizing: 'border-box',
                textAlign: 'left'
              }}
            >
              {/* Area B Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem', textAlign: 'left' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#059669', letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'left' }}>
                    STRATEGIC AREA B
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginTop: '2px', margin: 0, textAlign: 'left' }}>
                    Marketing Vision & New-Work Planning
                  </h3>
                </div>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                  {mktActivities.length} Record{mktActivities.length === 1 ? '' : 's'}
                </span>
              </div>

              {mktActivities.length === 0 ? (
                <div style={{ fontSize: '12px', color: '#64748B', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '6px', textAlign: 'left' }}>
                  No marketing vision or new-work planning records match current filters.
                </div>
              ) : (
                /* Sub-sections: Marketing Vision (Level 1 & 2) AND Dedicated New-Work Planning Area */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
                  {/* SUB-SECTION B1: MARKETING VISION (LEVEL 1 & LEVEL 2) */}
                  {mktActivities.filter((a) => a.category !== 'New-Work Planning').length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'left' }}>
                        Level 1 & Level 2 Marketing Vision & Planning
                      </div>

                      {mktActivities
                        .filter((a) => a.category !== 'New-Work Planning')
                        .map((item) => {
                          const badgeStyle = getCategoryBadgeStyle(item.category);

                          return (
                            <div
                              key={item.id}
                              style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                borderRadius: '6px',
                                padding: '1rem 1.15rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                textAlign: 'left',
                                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.02)',
                                transition: 'all var(--transition-fast)'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-500)')}
                              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', textAlign: 'left' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left' }}>
                                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent-600)', backgroundColor: '#F5F3FF', padding: '2px 7px', borderRadius: '4px', border: '1px solid #DDD6FE' }}>
                                    {item.code}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: 650,
                                      padding: '2px 8px',
                                      borderRadius: '12px',
                                      border: `1px solid ${badgeStyle.borderColor}`,
                                      backgroundColor: badgeStyle.backgroundColor,
                                      color: badgeStyle.color,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    {getCategoryIcon(item.category)}
                                    {item.category}
                                  </span>
                                </div>
                                <span style={{ fontSize: '11px', color: '#64748B' }}>
                                  Logged: {item.dateLogged}
                                </span>
                              </div>

                              <div style={{ textAlign: 'left' }}>
                                <h4
                                  onClick={() => setActiveDetailItem(item)}
                                  style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0, cursor: 'pointer', lineHeight: 1.3, textAlign: 'left' }}
                                >
                                  {item.title}
                                </h4>
                                <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px', marginBottom: 0, lineHeight: 1.4, textAlign: 'left' }}>
                                  {item.description}
                                </p>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '0.5rem', marginTop: '0.2rem', textAlign: 'left' }}>
                                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500, textAlign: 'left' }}>
                                  Target Scope: <strong>{item.targetScope || 'Corporate Communications'}</strong>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setActiveDetailItem(item)}
                                  style={{ padding: '0.25rem 0.55rem', borderRadius: '4px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', fontSize: '11px', fontWeight: 650, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                >
                                  View Details
                                  <ChevronRight size={11} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* SUB-SECTION B2: DEDICATED NEW-WORK PLANNING AREA */}
                  {mktActivities.filter((a) => a.category === 'New-Work Planning').length > 0 && (
                    <div
                      style={{
                        backgroundColor: '#ECFDF5',
                        border: '1.5px solid #A7F3D0',
                        borderRadius: '8px',
                        padding: '1.15rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left' }}>
                        <Briefcase size={18} style={{ color: '#047857' }} />
                        <div style={{ textAlign: 'left' }}>
                          <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#065F46', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'left' }}>
                            DEDICATED AREA: PLANNING FOR ACQUIRING NEW WORK
                          </h4>
                          <p style={{ fontSize: '12px', color: '#047857', marginTop: '2px', margin: 0, textAlign: 'left' }}>
                            Strategic initiatives and client outreach plans specifically focused on securing new engineering contracts.
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                        {mktActivities
                          .filter((a) => a.category === 'New-Work Planning')
                          .map((item) => (
                            <div
                              key={item.id}
                              style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #A7F3D0',
                                borderRadius: '6px',
                                padding: '1rem 1.15rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                textAlign: 'left',
                                boxShadow: '0 1px 3px rgba(4, 120, 87, 0.05)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', textAlign: 'left' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left' }}>
                                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#047857', backgroundColor: '#ECFDF5', padding: '2px 7px', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
                                    {item.code}
                                  </span>
                                  <span style={{ fontSize: '11px', fontWeight: 650, padding: '2px 8px', borderRadius: '12px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <Briefcase size={13} />
                                    New-Work Planning
                                  </span>
                                </div>
                                <span style={{ fontSize: '11px', color: '#64748B' }}>
                                  Logged: {item.dateLogged}
                                </span>
                              </div>

                              <div style={{ textAlign: 'left' }}>
                                <h4
                                  onClick={() => setActiveDetailItem(item)}
                                  style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0, cursor: 'pointer', lineHeight: 1.3, textAlign: 'left' }}
                                >
                                  {item.title}
                                </h4>
                                <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px', marginBottom: 0, lineHeight: 1.4, textAlign: 'left' }}>
                                  {item.description}
                                </p>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '0.5rem', marginTop: '0.2rem', textAlign: 'left' }}>
                                <div style={{ fontSize: '11px', color: '#047857', fontWeight: 600, textAlign: 'left' }}>
                                  Acquisition Division: <strong>{item.targetScope}</strong>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setActiveDetailItem(item)}
                                  style={{ padding: '0.25rem 0.55rem', borderRadius: '4px', backgroundColor: '#047857', color: '#FFFFFF', border: 'none', fontSize: '11px', fontWeight: 650, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                >
                                  View Details
                                  <ChevronRight size={11} />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* DETAIL MODAL OVERLAY */}
      {activeDetailItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 9999,
            textAlign: 'left'
          }}
          onClick={() => setActiveDetailItem(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '10px',
              width: '100%',
              maxWidth: '680px',
              maxHeight: 'calc(100vh - 3rem)',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxSizing: 'border-box',
              textAlign: 'left'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', textAlign: 'left' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent-600)', backgroundColor: '#F5F3FF', padding: '2px 8px', borderRadius: '4px', border: '1px solid #DDD6FE' }}>
                    {activeDetailItem.code}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 650, padding: '2px 8px', borderRadius: '12px', border: `1px solid ${getCategoryBadgeStyle(activeDetailItem.category).borderColor}`, backgroundColor: getCategoryBadgeStyle(activeDetailItem.category).backgroundColor, color: getCategoryBadgeStyle(activeDetailItem.category).color }}>
                    {activeDetailItem.category}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: 700, marginTop: '8px', lineHeight: 1.3, textAlign: 'left' }}>
                  {activeDetailItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveDetailItem(null)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', textAlign: 'left' }}>
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textAlign: 'left' }}>PRIMARY STRATEGIC AREA</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: '2px', textAlign: 'left' }}>{activeDetailItem.area}</div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textAlign: 'left' }}>TARGET SCOPE / DIVISION</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: '2px', textAlign: 'left' }}>{activeDetailItem.targetScope || 'Corporate Divisions'}</div>
                </div>
              </div>

              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '4px', textAlign: 'left' }}>
                  Strategic Description & Objectives
                </div>
                <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.75rem 0.85rem', textAlign: 'left' }}>
                  {activeDetailItem.description}
                </div>
              </div>

              {activeDetailItem.notes && (
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '4px', textAlign: 'left' }}>
                    Activity Log Notes
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4, backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', textAlign: 'left' }}>
                    {activeDetailItem.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '0.5rem', textAlign: 'left' }}>
              <button
                type="button"
                onClick={() => setActiveDetailItem(null)}
                style={{ padding: '0.45rem 1rem', borderRadius: '6px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: 650, cursor: 'pointer' }}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW STRATEGIC ITEM FORM MODAL */}
      {isCreateModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 9999,
            textAlign: 'left'
          }}
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '10px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: 'calc(100vh - 3rem)',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxSizing: 'border-box',
              textAlign: 'left'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Form Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem', textAlign: 'left' }}>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: 700, margin: 0, textAlign: 'left' }}>
                  Log New Strategic & Marketing Item
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', textAlign: 'left' }}>
                  Record an organizational update, marketing vision item, or new-work acquisition plan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                  Activity Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Level 1 Organizational Update: Technical Quality Charter"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', textAlign: 'left' }}>
                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                    Primary Area *
                  </label>
                  <select
                    value={newArea}
                    onChange={(e) => {
                      const val = e.target.value as StrategicArea;
                      setNewArea(val);
                      if (val === 'Organizational Betterment & Updates') {
                        setNewCategory('Level 1 Organizational Updates');
                      } else {
                        setNewCategory('Level 1 Marketing Vision & Planning');
                      }
                    }}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
                  >
                    <option value="Organizational Betterment & Updates">Organizational Betterment & Updates</option>
                    <option value="Marketing Vision & New-Work Planning">Marketing Vision & New-Work Planning</option>
                  </select>
                </div>

                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as StrategicCategory)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
                  >
                    {newArea === 'Organizational Betterment & Updates' ? (
                      <>
                        <option value="Level 1 Organizational Updates">Level 1 Organizational Updates</option>
                        <option value="Level 2 Organizational Updates">Level 2 Organizational Updates</option>
                      </>
                    ) : (
                      <>
                        <option value="Level 1 Marketing Vision & Planning">Level 1 Marketing Vision & Planning</option>
                        <option value="Level 2 Marketing Vision & Planning">Level 2 Marketing Vision & Planning</option>
                        <option value="New-Work Planning">New-Work Planning</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                  Target Scope / Division
                </label>
                <input
                  type="text"
                  placeholder="e.g. All Engineering Divisions"
                  value={newScope}
                  onChange={(e) => setNewScope(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                  Description Overview
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of strategic initiative..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '0.5rem', textAlign: 'left' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  style={{ padding: '0.45rem 1rem', borderRadius: '6px', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.45rem 1.15rem', borderRadius: '6px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: 650, cursor: 'pointer' }}
                >
                  Save & Log Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
