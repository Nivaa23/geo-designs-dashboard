import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { MOCK_MAJOR_PROJECTS } from '../../data/mockMajorProjectsData';
import type {
  MajorProjectItem,
  MajorProjectSector,
  MajorProjectCategory,
  MajorProjectHealth
} from '../../types/majorProjects';
import {
  Layers,
  Search,
  Filter,
  Plus,
  Users,
  Clock,
  DollarSign,
  X,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  CircleDot,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Briefcase,
  TrendingUp,
  Activity
} from 'lucide-react';

interface MajorProjectsViewProps {
  onReturnToOverview?: () => void;
}

export const MajorProjectsView: React.FC<MajorProjectsViewProps> = () => {
  // Main projects list state
  const [projects, setProjects] = useState<MajorProjectItem[]>(MOCK_MAJOR_PROJECTS);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedHealth, setSelectedHealth] = useState<string>('ALL');

  // Active Detail Modal item state
  const [activeProject, setActiveProject] = useState<MajorProjectItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'timeline' | 'finance' | 'risks' | 'team'>('overview');

  // Create Project Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('GEO-MP-2026-08');
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newSector, setNewSector] = useState<MajorProjectSector>('Geotechnical');
  const [newCategory, setNewCategory] = useState<MajorProjectCategory>('Mega Infrastructure');
  const [newLocation, setNewLocation] = useState('Central Engineering Corridor, New Delhi');
  const [newValuation, setNewValuation] = useState('₹9,50,00,000');
  const [newDeadline, setNewDeadline] = useState('15 Dec 2026');
  const [newDivision, setNewDivision] = useState('Division 1 — Geotechnical & Sub-surface Engineering');
  const [newDescription, setNewDescription] = useState('');

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorState, setShowErrorState] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Scroll locking when modal is active
  React.useEffect(() => {
    if (activeProject || isCreateModalOpen) {
      const origBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const scrollableElements = Array.from(document.querySelectorAll<HTMLElement>('*')).filter((el) => {
        const style = window.getComputedStyle(el);
        return (
          (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
          el.scrollHeight >= el.clientHeight
        );
      });

      const savedContainerStates = scrollableElements.map((el) => ({
        el,
        overflowY: el.style.overflowY
      }));

      scrollableElements.forEach((el) => {
        el.style.overflowY = 'hidden';
      });

      return () => {
        document.body.style.overflow = origBodyOverflow;
        savedContainerStates.forEach(({ el, overflowY }) => {
          el.style.overflowY = overflowY;
        });
      };
    }
  }, [activeProject, isCreateModalOpen]);

  // Filtered Projects calculation
  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.code.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.client.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.division.toLowerCase().includes(query) ||
        item.team.some((t) => t.name.toLowerCase().includes(query));

      const matchesSector = selectedSector === 'ALL' || item.sector === selectedSector;
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesHealth = selectedHealth === 'ALL' || item.health === selectedHealth;

      return matchesSearch && matchesSector && matchesCategory && matchesHealth;
    });
  }, [projects, searchQuery, selectedSector, selectedCategory, selectedHealth]);

  // Portfolio total valuation calculation
  const totalValuationDisplay = useMemo(() => {
    const totalVal = projects.reduce((acc, curr) => acc + curr.finance.numericalValuation, 0);
    return `₹${(totalVal / 10000000).toFixed(1)} Cr`;
  }, [projects]);

  // Handle Refresh simulation
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showSuccessNotification('Major projects workspace refreshed with latest phase & milestone data.');
    }, 350);
  };

  // Helper for success notifications
  const showSuccessNotification = (msg: string) => {
    setSuccessBanner(msg);
    setTimeout(() => {
      setSuccessBanner(null);
    }, 3500);
  };

  // Reset filters helper
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSector('ALL');
    setSelectedCategory('ALL');
    setSelectedHealth('ALL');
    setShowErrorState(false);
  };

  // Create Project Submit Handler
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newClient.trim()) return;

    const numVal = parseInt(newValuation.replace(/[^0-9]/g, '')) || 95000000;

    const newItem: MajorProjectItem = {
      id: `mp-${Date.now()}`,
      code: newCode.trim(),
      title: newTitle.trim(),
      client: newClient.trim(),
      sector: newSector,
      category: newCategory,
      location: newLocation.trim(),
      division: newDivision,
      currentPhase: 'Phase 1: Mobilization & Site Reconnaissance',
      currentMilestone: 'Initial Site Setup & DGPS Alignment Verification',
      progressPercentage: 15,
      health: 'On Track',
      startDate: '30 Sep 2026',
      targetCompletionDate: newDeadline.trim(),
      qualityAuditStatus: 'Certified',
      safetyCompliance: '100% Safety Verified',
      description: newDescription.trim() || 'Major engineering contract logged into dashboard workspace.',
      keyObjectives: [
        'Initial site mobilization & Ground Control Point DGPS setup',
        'Sub-surface geotechnical & structural audit execution',
        'Regulatory environmental clearance and quality report sign-off'
      ],
      finance: {
        totalValuation: newValuation.trim(),
        numericalValuation: numVal,
        billedAmount: '₹1,50,00,000',
        receivedAmount: '₹1,20,00,000',
        pendingValuation: `₹${((numVal - 15000000) / 100000).toFixed(0)}L`,
        financialHealth: 'Healthy'
      },
      weeklyPhases: [
        { week: 'W36', label: 'Site Mobilization', deliverable: 'Field team & DGPS equipment deployed to site', status: 'completed', targetDate: '28 Sep 2026' },
        { week: 'W37', label: 'Initial Field Audit', deliverable: 'Preliminary borehole & contour data recorded', status: 'in-progress', targetDate: '05 Oct 2026' },
        { week: 'W38', label: 'Lab Sample Analysis', deliverable: 'HQ Laboratory soil shear & density testing', status: 'scheduled', targetDate: '12 Oct 2026' },
        { week: 'W39', label: 'Milestone Sign-off', deliverable: 'Interim technical report submitted to Client', status: 'scheduled', targetDate: '19 Oct 2026' }
      ],
      risksAndDecisions: [],
      team: [
        { id: 'tm-new-1', name: 'Dr. V. Raman', role: 'Principal Investigator', department: 'Geotechnical Research Lab' },
        { id: 'tm-new-2', name: 'Er. A. Sharma', role: 'Field Operations Director', department: 'Field Operations Division' }
      ]
    };

    setProjects((prev) => [newItem, ...prev]);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewClient('');
    setNewDescription('');
    showSuccessNotification(`New Major Project ${newItem.code} logged successfully.`);
  };

  // Health Badge Styling Helper
  const getHealthBadgeStyle = (health: MajorProjectHealth) => {
    switch (health) {
      case 'On Track':
        return { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD', color: '#0369A1' };
      case 'Milestone Review':
        return { backgroundColor: '#FFFBEB', borderColor: '#FDE68A', color: '#B45309' };
      case 'Attention Required':
        return { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5', color: '#DC2626' };
      case 'Completed':
        return { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0', color: '#047857' };
    }
  };

  // Sector Icon Helper
  const getSectorIcon = (sector: MajorProjectSector) => {
    switch (sector) {
      case 'Geotechnical':
        return <Briefcase size={14} style={{ color: 'var(--color-accent-600)' }} />;
      case 'Surveying':
        return <Layers size={14} style={{ color: '#0284C7' }} />;
      case 'Structural':
        return <Building2 size={14} style={{ color: '#7C3AED' }} />;
      case 'Infrastructure':
        return <TrendingUp size={14} style={{ color: '#059669' }} />;
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
      {/* SUCCESS TOAST BANNER */}
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

      {/* SECTION 1: PAGE HEADER / HERO */}
      <div
        className="geo-major-header"
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
        <div className="geo-major-header-title-area" style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
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
              <Layers size={18} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 700, lineHeight: 1.2, margin: 0, textAlign: 'left' }}>
                Major Projects
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px', lineHeight: 1.3, textAlign: 'left', maxWidth: '720px' }}>
                Executive tracking and operational monitoring for high-valuation infrastructure contracts — weekly phase progression, milestone health, financial status, risk log, and engineering approvals.
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="geo-major-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
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
            Log Major Project
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

      {/* SECTION 2: PORTFOLIO SUMMARY KPI CARDS GRID */}
      <div
        className="geo-major-kpi-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
          width: '100%'
        }}
      >
        {/* KPI 1 */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            textAlign: 'left',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              TOTAL PORTFOLIO
            </span>
            <Briefcase size={15} style={{ color: 'var(--color-accent-600)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '2px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>
              {projects.length}
            </span>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
              Projects ({totalValuationDisplay})
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
            Multi-phase engineering portfolio
          </div>
        </div>

        {/* KPI 2 */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            textAlign: 'left',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              ON TRACK
            </span>
            <CheckCircle2 size={15} style={{ color: '#0369A1' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '2px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>
              {projects.filter((p) => p.health === 'On Track' || p.health === 'Completed').length}
            </span>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
              On Schedule
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#0369A1', fontWeight: 600, marginTop: '2px' }}>
            Smooth field & lab execution
          </div>
        </div>

        {/* KPI 3 */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            textAlign: 'left',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              MILESTONE REVIEWS
            </span>
            <Activity size={15} style={{ color: '#B45309' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '2px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>
              {projects.filter((p) => p.health === 'Milestone Review' || p.health === 'Attention Required').length}
            </span>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
              Reviews Active
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#B45309', fontWeight: 600, marginTop: '2px' }}>
            Pending client / lab sign-off
          </div>
        </div>

        {/* KPI 4 */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            textAlign: 'left',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              UPCOMING MILESTONES
            </span>
            <Clock size={15} style={{ color: '#7C3AED' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '2px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>
              3
            </span>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
              Due This Week
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 600, marginTop: '2px' }}>
            W38-W39 Core Drilling & CAD
          </div>
        </div>
      </div>

      {/* SECTION 3: 5 CATEGORY QUICK FILTER CARDS */}
      <div
        className="geo-major-categories-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '0.75rem',
          width: '100%'
        }}
      >
        {(
          [
            { label: 'All Major Projects', category: 'ALL' },
            { label: 'Mega Infrastructure', category: 'Mega Infrastructure' },
            { label: 'Highways & Expressways', category: 'Highways & Expressways' },
            { label: 'Structural & IT Parks', category: 'Structural & Urban IT Parks' },
            { label: 'Hydrology & Energy', category: 'Hydrology & Energy' }
          ]
        ).map((item) => {
          const count =
            item.category === 'ALL'
              ? projects.length
              : projects.filter((p) => p.category === item.category).length;
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
                <Layers size={14} style={{ color: isSelected ? 'var(--color-accent-600)' : '#94A3B8' }} />
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

      {/* SECTION 4: SEARCH & FILTER TOOLBAR */}
      <div
        className="geo-major-toolbar"
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
        <div className="geo-major-search-wrapper" style={{ position: 'relative', flex: '1 1 300px', minWidth: '240px' }}>
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
            placeholder="Search code, title, client, location, division, team lead..."
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
        <div className="geo-major-filter-group" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Sector Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Filter size={13} style={{ color: '#64748B' }} />
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
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
              <option value="ALL">All Engineering Sectors</option>
              <option value="Geotechnical">Geotechnical Sector</option>
              <option value="Surveying">Surveying Sector</option>
              <option value="Structural">Structural Sector</option>
              <option value="Infrastructure">Infrastructure Sector</option>
            </select>
          </div>

          {/* Health Filter */}
          <select
            value={selectedHealth}
            onChange={(e) => setSelectedHealth(e.target.value)}
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
            <option value="ALL">All Health Statuses</option>
            <option value="On Track">On Track</option>
            <option value="Milestone Review">Milestone Review</option>
            <option value="Attention Required">Attention Required</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Reset Filters button */}
          {(searchQuery || selectedSector !== 'ALL' || selectedCategory !== 'ALL' || selectedHealth !== 'ALL') && (
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
              Unable to load major projects database
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#7F1D1D', margin: 0, textAlign: 'left' }}>
            A connection issue occurred while synchronizing major project timelines and financial records. Please check connection or retry.
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
            Loading Major Projects & Timelines...
          </div>
        </div>
      ) : filteredProjects.length === 0 ? (
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
          <Layers size={24} style={{ color: '#94A3B8' }} />
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
            No Major Projects Found
          </div>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0, textAlign: 'left', maxWidth: '600px' }}>
            No major project records match your search query "{searchQuery}" or selected filters. Clear search or log a new major project.
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
        /* SECTION 5: MAIN MAJOR PROJECTS CARDS LISTING */
        <div
          className="geo-major-list-container"
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
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '14px', fontWeight: 650, color: '#0F172A', textAlign: 'left' }}>
                Major Projects Portfolio & Weekly Phase Timelines
              </span>
              <span style={{ fontSize: '12px', color: '#64748B', marginLeft: '8px', fontWeight: 500 }}>
                Showing {filteredProjects.length} of {projects.length} major contracts
              </span>
            </div>
          </div>

          {/* Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            {filteredProjects.map((item) => {
              const healthStyle = getHealthBadgeStyle(item.health);

              return (
                <div
                  key={item.id}
                  className="geo-major-card"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    padding: '1.15rem 1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                    textAlign: 'left',
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.02)',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-500)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
                >
                  {/* Row 1: Code, Sector, Location & Health Badge */}
                  <div className="geo-major-card-row1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', textAlign: 'left' }}>
                    <div className="geo-major-card-tags" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent-600)', backgroundColor: '#F5F3FF', padding: '2px 7px', borderRadius: '4px', border: '1px solid #DDD6FE' }}>
                        {item.code}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '2px 8px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {getSectorIcon(item.sector)}
                        {item.sector} Sector
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} />
                        {item.location}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                        {item.finance.totalValuation}
                      </span>
                      <span
                        className="geo-major-card-health"
                        style={{
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 650,
                          border: `1px solid ${healthStyle.borderColor}`,
                          backgroundColor: healthStyle.backgroundColor,
                          color: healthStyle.color
                        }}
                      >
                        {item.health}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Title & Division Scope */}
                  <div className="geo-major-card-content" style={{ textAlign: 'left' }}>
                    <h4
                      className="geo-major-card-title"
                      onClick={() => {
                        setActiveProject(item);
                        setActiveModalTab('overview');
                      }}
                      style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0, cursor: 'pointer', lineHeight: 1.35, textAlign: 'left' }}
                    >
                      {item.title}
                    </h4>
                    <div className="geo-major-card-client" style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', fontWeight: 500, textAlign: 'left' }}>
                      Client: <strong>{item.client}</strong> &bull; <span style={{ color: 'var(--color-accent-600)', fontWeight: 600 }}>{item.division}</span>
                    </div>
                  </div>

                  {/* Row 3: Multi-Week Phase Progression Timeline */}
                  <div
                    className="geo-major-timeline-row"
                    style={{
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      padding: '0.75rem 0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#475569', fontWeight: 600 }}>
                      <span>CURRENT PHASE: <strong style={{ color: 'var(--color-accent-600)' }}>{item.currentPhase}</strong></span>
                      <span>Milestone: {item.currentMilestone}</span>
                    </div>

                    <div
                      className="geo-major-timeline-grid"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '0.5rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '6px',
                        padding: '0.65rem'
                      }}
                    >
                      {item.weeklyPhases.map((wp, idx) => {
                        let stepColor = '#94A3B8';
                        let icon = <Clock size={12} style={{ color: '#94A3B8' }} />;

                        if (wp.status === 'completed') {
                          stepColor = '#047857';
                          icon = <CheckCircle2 size={12} style={{ color: '#047857' }} />;
                        } else if (wp.status === 'in-progress') {
                          stepColor = 'var(--color-accent-600)';
                          icon = <CircleDot size={12} style={{ color: 'var(--color-accent-500)' }} />;
                        }

                        return (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: 650, color: stepColor }}>
                              {icon}
                              {wp.week}
                            </div>
                            <div style={{ fontSize: '11px', color: wp.status === 'in-progress' ? '#0F172A' : '#475569', fontWeight: wp.status === 'in-progress' ? 700 : 500, lineHeight: 1.25 }}>
                              {wp.label}
                            </div>
                            <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '1px' }}>
                              {wp.deliverable.slice(0, 32)}...
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Row 4: Key Progress & Financial Indicators */}
                  <div
                    className="geo-major-card-metrics"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
                      gap: '0.75rem',
                      alignItems: 'center',
                      textAlign: 'left',
                      backgroundColor: '#FFFFFF',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    {/* Progress Bar */}
                    <div className="geo-major-metric-progress" style={{ textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#475569', fontWeight: 600, marginBottom: '3px' }}>
                        <span>Progress: {item.progressPercentage}%</span>
                        <span>Target: {item.targetCompletionDate}</span>
                      </div>
                      <div style={{ height: '6px', width: '100%', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${item.progressPercentage}%`, backgroundColor: 'var(--color-accent-500)', borderRadius: '3px' }} />
                      </div>
                    </div>

                    {/* Billed */}
                    <div className="geo-major-metric-box" style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>BILLED AMOUNT</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0284C7', marginTop: '1px' }}>{item.finance.billedAmount}</div>
                    </div>

                    {/* Pending */}
                    <div className="geo-major-metric-box" style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>PENDING VALUATION</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#D97706', marginTop: '1px' }}>{item.finance.pendingValuation}</div>
                    </div>

                    {/* Quality Audit */}
                    <div className="geo-major-metric-box" style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>QUALITY CERTIFICATION</div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#047857', marginTop: '1px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <ShieldCheck size={12} />
                        {item.qualityAuditStatus}
                      </div>
                    </div>
                  </div>

                  {/* Row 5: Open Risks & Pending Decisions (if any) */}
                  {item.risksAndDecisions.length > 0 && (
                    <div
                      className="geo-major-card-risks"
                      style={{
                        backgroundColor: '#FFFBEB',
                        border: '1px solid #FDE68A',
                        borderRadius: '6px',
                        padding: '0.5rem 0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#B45309', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={12} />
                        Action Required &amp; Pending Decisions ({item.risksAndDecisions.length})
                      </div>
                      {item.risksAndDecisions.map((rd) => (
                        <div key={rd.id} style={{ fontSize: '11px', color: '#92400E', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                          <span>&bull; {rd.title}</span>
                          <span style={{ fontWeight: 600 }}>Owner: {rd.actionOwner} (Due {rd.dueDate})</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Row 6: Footer (Team & Action Button) */}
                  <div className="geo-major-card-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '0.5rem', marginTop: '0.1rem', textAlign: 'left' }}>
                    <div className="geo-major-card-team" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '11px', color: '#64748B', textAlign: 'left' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: '#334155' }}>
                        <Users size={12} />
                        Team: {item.team.map((t) => t.name.split(' ')[0]).join(', ')} ({item.team.length} members)
                      </span>
                    </div>

                    <button
                      type="button"
                      className="geo-major-card-action-btn"
                      onClick={() => {
                        setActiveProject(item);
                        setActiveModalTab('overview');
                      }}
                      style={{
                        padding: '0.3rem 0.65rem',
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
                      View Project Details &amp; Monitoring
                      <ChevronRight size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAIL & MONITORING VIEWPORT PORTAL OVERLAY */}
      {activeProject &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(2px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              zIndex: 999999,
              overflow: 'hidden',
              boxSizing: 'border-box',
              textAlign: 'left'
            }}
            onClick={() => setActiveProject(null)}
            onWheel={(e) => {
              if (e.target === e.currentTarget) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <div
              className="geo-major-modal-content"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '10px',
                width: '100%',
                maxWidth: '780px',
                maxHeight: 'min(85vh, calc(100vh - 3rem))',
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.15rem',
                boxSizing: 'border-box',
                margin: 'auto',
                textAlign: 'left'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', textAlign: 'left' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent-600)', backgroundColor: '#F5F3FF', padding: '2px 8px', borderRadius: '4px', border: '1px solid #DDD6FE' }}>
                      {activeProject.code}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '2px 8px', borderRadius: '12px' }}>
                      {activeProject.sector} Sector
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 650, padding: '2px 8px', borderRadius: '12px', border: `1px solid ${getHealthBadgeStyle(activeProject.health).borderColor}`, backgroundColor: getHealthBadgeStyle(activeProject.health).backgroundColor, color: getHealthBadgeStyle(activeProject.health).color }}>
                      {activeProject.health}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: 700, marginTop: '8px', lineHeight: 1.3, textAlign: 'left' }}>
                    {activeProject.title}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', textAlign: 'left' }}>
                    Client: <strong>{activeProject.client}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Navigation Tabs */}
              <div style={{ display: 'flex', gap: '0.35rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', flexWrap: 'wrap', textAlign: 'left' }}>
                {(
                  [
                    { id: 'overview', label: 'Scope & Overview', icon: <Briefcase size={13} /> },
                    { id: 'timeline', label: 'Phase Timeline', icon: <Clock size={13} /> },
                    { id: 'finance', label: 'Financial Health', icon: <DollarSign size={13} /> },
                    { id: 'risks', label: `Risks & Log (${activeProject.risksAndDecisions.length})`, icon: <AlertTriangle size={13} /> },
                    { id: 'team', label: `Team (${activeProject.team.length})`, icon: <Users size={13} /> }
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveModalTab(tab.id)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: activeModalTab === tab.id ? 'var(--color-accent-500)' : '#E2E8F0',
                      backgroundColor: activeModalTab === tab.id ? '#F5F3FF' : '#F8FAFC',
                      color: activeModalTab === tab.id ? 'var(--color-accent-600)' : '#475569',
                      fontSize: '11px',
                      fontWeight: activeModalTab === tab.id ? 700 : 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Modal Body Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                {/* TAB 1: OVERVIEW */}
                {activeModalTab === 'overview' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'left' }}>
                    <div className="geo-major-modal-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'left' }}>
                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textAlign: 'left' }}>ALLOCATION DIVISION</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: '2px', textAlign: 'left' }}>{activeProject.division}</div>
                      </div>

                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textAlign: 'left' }}>TARGET COMPLETION</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: '2px', textAlign: 'left' }}>{activeProject.targetCompletionDate}</div>
                      </div>

                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textAlign: 'left' }}>CONTRACT VALUATION</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-accent-600)', marginTop: '2px', textAlign: 'left' }}>{activeProject.finance.totalValuation}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Engineering Scope & Description</div>
                      <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.75rem 0.85rem' }}>
                        {activeProject.description}
                      </div>
                    </div>

                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>Key Technical Deliverables</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {activeProject.keyObjectives.map((obj, idx) => (
                          <div key={idx} style={{ fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle2 size={13} style={{ color: '#059669', flexShrink: 0 }} />
                            <span>{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: TIMELINE */}
                {activeModalTab === 'timeline' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'left' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                      Multi-Week Milestone & Phase Progression Log
                    </div>
                    {activeProject.weeklyPhases.map((wp, idx) => (
                      <div key={idx} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.75rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: wp.status === 'completed' ? '#047857' : wp.status === 'in-progress' ? 'var(--color-accent-600)' : '#64748B' }}>
                            {wp.week} — {wp.label}
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>Target: {wp.targetDate}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#334155' }}>
                          Deliverable: {wp.deliverable}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 3: FINANCE */}
                {activeModalTab === 'finance' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'left' }}>
                    <div className="geo-major-modal-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.65rem', textAlign: 'left' }}>
                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>CONTRACT TOTAL</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{activeProject.finance.totalValuation}</div>
                      </div>
                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>BILLED AMOUNT</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0284C7', marginTop: '2px' }}>{activeProject.finance.billedAmount}</div>
                      </div>
                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>RECEIVED AMOUNT</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#059669', marginTop: '2px' }}>{activeProject.finance.receivedAmount}</div>
                      </div>
                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>PENDING VALUATION</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#D97706', marginTop: '2px' }}>{activeProject.finance.pendingValuation}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: RISKS & LOG */}
                {activeModalTab === 'risks' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', textAlign: 'left' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                      Open Risks, Action Items & Pending Decisions
                    </div>
                    {activeProject.risksAndDecisions.length === 0 ? (
                      <div style={{ fontSize: '12px', color: '#64748B', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '6px' }}>
                        No open risks or pending decisions reported for this project.
                      </div>
                    ) : (
                      activeProject.risksAndDecisions.map((rd) => (
                        <div key={rd.id} style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '6px', padding: '0.75rem 0.85rem' }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#92400E' }}>{rd.title}</div>
                          <div style={{ fontSize: '11px', color: '#B45309', marginTop: '3px' }}>
                            Type: {rd.type} &bull; Action Owner: {rd.actionOwner} &bull; Due: {rd.dueDate}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* TAB 5: TEAM */}
                {activeModalTab === 'team' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', textAlign: 'left' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                      Assigned Engineering Team Leads
                    </div>
                    {activeProject.team.map((t) => (
                      <div key={t.id} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{t.name}</div>
                          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{t.role}</div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-accent-600)', backgroundColor: '#F5F3FF', padding: '2px 8px', borderRadius: '4px', border: '1px solid #DDD6FE' }}>
                          {t.department}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '0.5rem', textAlign: 'left' }}>
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  style={{ padding: '0.45rem 1rem', borderRadius: '6px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: 650, cursor: 'pointer' }}
                >
                  Close Monitoring View
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* CREATE NEW MAJOR PROJECT FORM MODAL */}
      {isCreateModalOpen &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(2px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              zIndex: 999999,
              overflow: 'hidden',
              boxSizing: 'border-box',
              textAlign: 'left'
            }}
            onClick={() => setIsCreateModalOpen(false)}
            onWheel={(e) => {
              if (e.target === e.currentTarget) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <div
              className="geo-major-modal-content"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '10px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: 'min(85vh, calc(100vh - 3rem))',
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                boxSizing: 'border-box',
                margin: 'auto',
                textAlign: 'left'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Form Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem', textAlign: 'left' }}>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: 700, margin: 0, textAlign: 'left' }}>
                    Log New Major Project
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', textAlign: 'left' }}>
                    Register high-valuation infrastructure contract code, division, client, and project timeline.
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
                <div className="geo-major-modal-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', textAlign: 'left' }}>
                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                      Project Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                      Engineering Sector *
                    </label>
                    <select
                      value={newSector}
                      onChange={(e) => setNewSector(e.target.value as any)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
                    >
                      <option value="Geotechnical">Geotechnical Sector</option>
                      <option value="Surveying">Surveying Sector</option>
                      <option value="Structural">Structural Sector</option>
                      <option value="Infrastructure">Infrastructure Sector</option>
                    </select>
                  </div>
                </div>

                <div className="geo-major-modal-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', textAlign: 'left' }}>
                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                      Contract Category *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
                    >
                      <option value="Mega Infrastructure">Mega Infrastructure</option>
                      <option value="Expressway & Highways">Expressway & Highways</option>
                      <option value="High-Speed Rail">High-Speed Rail</option>
                      <option value="Industrial Corridors">Industrial Corridors</option>
                      <option value="Urban Transit & Metro">Urban Transit & Metro</option>
                    </select>
                  </div>

                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                      Project Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Central Engineering Corridor, New Delhi"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                    Project Name / Assignment Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deepwater Port Container Terminal Geotechnical Audit"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                    Client / Authority Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. National Maritime & Port Logistics Authority"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="geo-major-modal-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', textAlign: 'left' }}>
                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                      Contract Valuation
                    </label>
                    <input
                      type="text"
                      value={newValuation}
                      onChange={(e) => setNewValuation(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                      Target Completion Date
                    </label>
                    <input
                      type="text"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                    Allocation Division
                  </label>
                  <select
                    value={newDivision}
                    onChange={(e) => setNewDivision(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
                  >
                    <option value="Division 1 — Geotechnical & Sub-surface Engineering">Division 1 — Geotechnical & Sub-surface Engineering</option>
                    <option value="Division 2 — Topographic & Aerial Surveying Division">Division 2 — Topographic & Aerial Surveying Division</option>
                    <option value="Division 3 — Structural Audit & NDT Testing Division">Division 3 — Structural Audit & NDT Testing Division</option>
                    <option value="Division 4 — Hydrology & Environmental Engineering">Division 4 — Hydrology & Environmental Engineering</option>
                  </select>
                </div>

                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                    Technical Overview & Scope
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide overview of contract deliverables..."
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
                    Log Major Project
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
