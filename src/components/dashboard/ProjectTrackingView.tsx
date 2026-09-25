import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { MOCK_DETAILED_PROJECTS } from '../../data/mockProjectTrackingData';
import type { DetailedProjectTrackingItem } from '../../types/projectTracking';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Users,
  Clock,
  FileText,
  DollarSign,
  Layers,
  X,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface ProjectTrackingViewProps {
  onReturnToOverview?: () => void;
}

export const ProjectTrackingView: React.FC<ProjectTrackingViewProps> = () => {
  // Main projects list state
  const [projects, setProjects] = useState<DetailedProjectTrackingItem[]>(MOCK_DETAILED_PROJECTS);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Active Detail Modal item state
  const [activeProject, setActiveProject] = useState<DetailedProjectTrackingItem | null>(null);
  const [activeTabInModal, setActiveTabInModal] = useState<'overview' | 'team' | 'timelines' | 'mom' | 'sop' | 'finance'>('overview');

  // Allocate Project Modal state
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('GEO-PRJ-2026-105');
  const [newName, setNewName] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newSector, setNewSector] = useState<'Geotechnical' | 'Surveying' | 'Structural' | 'Infrastructure'>('Geotechnical');
  const [newValuation, setNewValuation] = useState('₹75,00,000');
  const [newDivision, setNewDivision] = useState('Division 1 — Geotechnical & Soil Investigation');
  const [newDeadline, setNewDeadline] = useState('30 Nov 2026');

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorState, setShowErrorState] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Scroll locking when modal is active
  React.useEffect(() => {
    if (activeProject || isAllocateModalOpen) {
      const origBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Find and lock all scrollable containers in the dashboard shell
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
  }, [activeProject, isAllocateModalOpen]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.client.toLowerCase().includes(query) ||
        item.allocationDivision.toLowerCase().includes(query) ||
        item.assignedTeam.some((t) => t.name.toLowerCase().includes(query));

      const matchesSector = selectedSector === 'ALL' || item.sector === selectedSector;
      const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;

      return matchesSearch && matchesSector && matchesStatus;
    });
  }, [projects, searchQuery, selectedSector, selectedStatus]);

  // Handle Refresh simulation
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showSuccessNotification('Project tracking workspace refreshed.');
    }, 350);
  };

  // Success notification helper
  const showSuccessNotification = (msg: string) => {
    setSuccessBanner(msg);
    setTimeout(() => {
      setSuccessBanner(null);
    }, 3500);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSector('ALL');
    setSelectedStatus('ALL');
    setShowErrorState(false);
  };

  // Allocate Project Handler
  const handleAllocateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newClient.trim()) return;

    const newItem: DetailedProjectTrackingItem = {
      id: `proj-${Date.now()}`,
      code: newCode.trim(),
      name: newName.trim(),
      client: newClient.trim(),
      sector: newSector,
      progressPercentage: 10,
      status: 'On Schedule',
      deadline: newDeadline,
      totalValuation: newValuation,
      allocationDivision: newDivision,
      assignedTeam: [
        { id: 'tm-new-1', name: 'Dr. V. Raman', role: 'Principal Investigator', department: 'Research & Advisory' },
        { id: 'tm-new-2', name: 'Er. A. Sharma', role: 'Field Operations Manager', department: 'Field Operations' }
      ],
      timelineUpdates: [
        { date: '26 Sep 2026', note: 'Project allocated and initial site mobilization initiated.' }
      ],
      momRecords: [
        { id: 'mom-new', date: '26 Sep 2026', subject: 'Initial Project Kick-off Meeting', summary: 'Agreed on scope of work and field logistics charter.', attendees: 'Dr. V. Raman, Client Technical Team' }
      ],
      sopReferences: [
        { id: 'sop-new', code: 'SOP-GEO-001', title: 'Standard Soil Investigation & Core Drilling', category: 'General Engineering' }
      ],
      financeInfo: {
        totalValuation: newValuation,
        numericalValuation: 7500000,
        billedAmount: '₹15,00,000',
        receivedAmount: '₹10,00,000',
        pendingValuation: '₹65,00,000',
        status: 'Healthy'
      }
    };

    setProjects((prev) => [newItem, ...prev]);
    setIsAllocateModalOpen(false);
    setNewName('');
    setNewClient('');
    showSuccessNotification(`Project ${newItem.code} allocated successfully.`);
  };

  // Status Badge Styling helper
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'On Schedule':
        return { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD', color: '#0369A1' };
      case 'In Progress':
        return { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', color: '#1D4ED8' };
      case 'Milestone Review':
        return { backgroundColor: '#FFFBEB', borderColor: '#FDE68A', color: '#B45309' };
      case 'Pending Sign-off':
        return { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0', color: '#047857' };
      default:
        return { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', color: '#475569' };
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
      {/* SUCCESS BANNER TOAST */}
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
              <Briefcase size={18} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 700, lineHeight: 1.2, margin: 0, textAlign: 'left' }}>
                Project Tracking
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px', lineHeight: 1.3, textAlign: 'left', maxWidth: '680px' }}>
                Detailed tracking and monitoring for engineering assignments up to ₹50 crore — project overview, team allocation, timelines, progress, MOM, SOP, and project finance.
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
          <button
            type="button"
            onClick={() => setIsAllocateModalOpen(true)}
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
            Allocate New Project
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

      {/* SECTION 2: SECTOR SUMMARY CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
          width: '100%'
        }}
      >
        {(
          [
            { label: 'Geotechnical Contracts', sector: 'Geotechnical' },
            { label: 'Surveying & Drone Mapping', sector: 'Surveying' },
            { label: 'Structural Audits & NDT', sector: 'Structural' },
            { label: 'Infrastructure & Hydrology', sector: 'Infrastructure' }
          ]
        ).map((sec) => {
          const count = projects.filter((p) => p.sector === sec.sector).length;
          const isSelected = selectedSector === sec.sector;

          return (
            <div
              key={sec.sector}
              onClick={() => setSelectedSector(isSelected ? 'ALL' : sec.sector)}
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
                  {sec.label}
                </span>
                <Layers size={15} style={{ color: isSelected ? 'var(--color-accent-600)' : '#94A3B8' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '2px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>
                  {count}
                </span>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
                  Active Projects
                </span>
              </div>

              <div style={{ fontSize: '11px', color: isSelected ? 'var(--color-accent-600)' : '#94A3B8', fontWeight: 600, marginTop: '2px' }}>
                {isSelected ? '✓ Filter active' : 'Click to filter'}
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
        {/* Search Input */}
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
            placeholder="Search code, project title, client, division, team member..."
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

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
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

          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
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
            <option value="ALL">All Project Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Milestone Review">Milestone Review</option>
            <option value="On Schedule">On Schedule</option>
            <option value="Pending Sign-off">Pending Sign-off</option>
          </select>

          {/* Reset Filters */}
          {(searchQuery || selectedSector !== 'ALL' || selectedStatus !== 'ALL') && (
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
              Unable to load project tracking database
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#7F1D1D', margin: 0, textAlign: 'left' }}>
            A connection issue occurred while loading tracked engineering projects. Please verify your connection or retry.
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
            Loading Project Tracking Data...
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
          <Briefcase size={24} style={{ color: '#94A3B8' }} />
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
            No Projects Found
          </div>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0, textAlign: 'left', maxWidth: '600px' }}>
            No project records match your current search query "{searchQuery}" or selected filter criteria. Try clearing search keywords or selecting a different sector.
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
        /* SECTION 4: MAIN PROJECT TRACKING CARDS & TABLE */
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
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '14px', fontWeight: 650, color: '#0F172A', textAlign: 'left' }}>
                Tracked Projects List (Up to ₹50 Cr)
              </span>
              <span style={{ fontSize: '12px', color: '#64748B', marginLeft: '8px', fontWeight: 500 }}>
                Showing {filteredProjects.length} of {projects.length} entries
              </span>
            </div>
          </div>

          {/* Projects Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%' }}>
            {filteredProjects.map((item) => {
              const statusStyle = getStatusBadgeStyle(item.status);

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    padding: '1.1rem 1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    textAlign: 'left',
                    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.02)',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-500)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
                >
                  {/* Row 1: Code, Sector, Allocation Division & Status */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent-600)', backgroundColor: '#F5F3FF', padding: '2px 7px', borderRadius: '4px', border: '1px solid #DDD6FE' }}>
                        {item.code}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '2px 8px', borderRadius: '12px' }}>
                        {item.sector} Sector
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
                        &bull; {item.allocationDivision}
                      </span>
                    </div>

                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 650,
                        border: `1px solid ${statusStyle.borderColor}`,
                        backgroundColor: statusStyle.backgroundColor,
                        color: statusStyle.color
                      }}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Row 2: Title & Client */}
                  <div style={{ textAlign: 'left' }}>
                    <h4
                      onClick={() => {
                        setActiveProject(item);
                        setActiveTabInModal('overview');
                      }}
                      style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0, cursor: 'pointer', lineHeight: 1.3, textAlign: 'left' }}
                    >
                      {item.name}
                    </h4>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '3px', fontWeight: 500, textAlign: 'left' }}>
                      Client: <strong>{item.client}</strong>
                    </div>
                  </div>

                  {/* Row 3: Progress Bar & Key Financial Metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center', textAlign: 'left', backgroundColor: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #F1F5F9' }}>
                    {/* Progress Bar */}
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#475569', fontWeight: 600, marginBottom: '3px' }}>
                        <span>Progress: {item.progressPercentage}%</span>
                        <span>Deadline: {item.deadline}</span>
                      </div>
                      <div style={{ height: '6px', width: '100%', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${item.progressPercentage}%`, backgroundColor: 'var(--color-accent-500)', borderRadius: '3px' }} />
                      </div>
                    </div>

                    {/* Valuation */}
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>CONTRACT VALUATION</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '1px' }}>{item.totalValuation}</div>
                    </div>

                    {/* Billed */}
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>BILLED AMOUNT</div>
                      <div style={{ fontSize: '12px', fontWeight: 650, color: '#0284C7', marginTop: '1px' }}>{item.financeInfo.billedAmount}</div>
                    </div>

                    {/* Pending */}
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>PENDING VALUATION</div>
                      <div style={{ fontSize: '12px', fontWeight: 650, color: '#D97706', marginTop: '1px' }}>{item.financeInfo.pendingValuation}</div>
                    </div>
                  </div>

                  {/* Row 4: Team & Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '0.5rem', marginTop: '0.2rem', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '11px', color: '#64748B', textAlign: 'left' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: '#334155' }}>
                        <Users size={12} />
                        Team: {item.assignedTeam.map((t) => t.name.split(' ')[0]).join(', ')} ({item.assignedTeam.length} members)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveProject(item);
                        setActiveTabInModal('overview');
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
                      View Project Details & Monitoring
                      <ChevronRight size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAIL & MONITORING MODAL OVERLAY */}
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
                    <span style={{ fontSize: '11px', fontWeight: 650, padding: '2px 8px', borderRadius: '12px', border: `1px solid ${getStatusBadgeStyle(activeProject.status).borderColor}`, backgroundColor: getStatusBadgeStyle(activeProject.status).backgroundColor, color: getStatusBadgeStyle(activeProject.status).color }}>
                      {activeProject.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: 700, marginTop: '8px', lineHeight: 1.3, textAlign: 'left' }}>
                    {activeProject.name}
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

              {/* Modal Navigation Tabs across the 9 requirement areas */}
              <div style={{ display: 'flex', gap: '0.35rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', flexWrap: 'wrap', textAlign: 'left' }}>
                {(
                  [
                    { id: 'overview', label: 'Overview & Allocation', icon: <Briefcase size={13} /> },
                    { id: 'team', label: `Team (${activeProject.assignedTeam.length})`, icon: <Users size={13} /> },
                    { id: 'timelines', label: 'Timelines & Progress', icon: <Clock size={13} /> },
                    { id: 'mom', label: `MOM (${activeProject.momRecords.length})`, icon: <FileText size={13} /> },
                    { id: 'sop', label: `SOP (${activeProject.sopReferences.length})`, icon: <BookOpen size={13} /> },
                    { id: 'finance', label: 'Project Finance', icon: <DollarSign size={13} /> }
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTabInModal(tab.id)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: activeTabInModal === tab.id ? 'var(--color-accent-500)' : '#E2E8F0',
                      backgroundColor: activeTabInModal === tab.id ? '#F5F3FF' : '#F8FAFC',
                      color: activeTabInModal === tab.id ? 'var(--color-accent-600)' : '#475569',
                      fontSize: '11px',
                      fontWeight: activeTabInModal === tab.id ? 700 : 600,
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

              {/* Modal Body Tab Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                {/* TAB 1: OVERVIEW & ALLOCATION */}
                {activeTabInModal === 'overview' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'left' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'left' }}>
                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textAlign: 'left' }}>ALLOCATION DIVISION</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: '2px', textAlign: 'left' }}>{activeProject.allocationDivision}</div>
                      </div>

                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textAlign: 'left' }}>DEADLINE</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: '2px', textAlign: 'left' }}>{activeProject.deadline}</div>
                      </div>

                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textAlign: 'left' }}>CONTRACT VALUATION</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-accent-600)', marginTop: '2px', textAlign: 'left' }}>{activeProject.totalValuation}</div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.85rem', textAlign: 'left' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', textAlign: 'left' }}>
                        Overall Progress Monitoring: {activeProject.progressPercentage}%
                      </div>
                      <div style={{ height: '8px', width: '100%', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${activeProject.progressPercentage}%`, backgroundColor: 'var(--color-accent-500)', borderRadius: '4px' }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: TEAM ASSIGNMENT & MANAGEMENT */}
                {activeTabInModal === 'team' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', textAlign: 'left' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', textAlign: 'left' }}>
                      Assigned Project Team Members
                    </div>
                    {activeProject.assignedTeam.map((member) => (
                      <div key={member.id} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', textAlign: 'left' }}>{member.name}</div>
                          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', textAlign: 'left' }}>{member.role}</div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-accent-600)', backgroundColor: '#F5F3FF', padding: '2px 8px', borderRadius: '4px', border: '1px solid #DDD6FE' }}>
                          {member.department}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 3: TIMELINES & PROGRESS UPDATES */}
                {activeTabInModal === 'timelines' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', textAlign: 'left' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', textAlign: 'left' }}>
                      Timeline & Progress Update Log
                    </div>
                    {activeProject.timelineUpdates.map((log, idx) => (
                      <div key={idx} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent-600)', textAlign: 'left' }}>{log.date}</div>
                        <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px', lineHeight: 1.4, textAlign: 'left' }}>{log.note}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 4: MINUTES OF MEETING (MOM) */}
                {activeTabInModal === 'mom' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', textAlign: 'left' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', textAlign: 'left' }}>
                      Project Minutes of Meeting (MOM) Records
                    </div>
                    {activeProject.momRecords.map((mom) => (
                      <div key={mom.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.75rem 0.85rem', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', textAlign: 'left' }}>{mom.subject}</span>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>{mom.date}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px', marginBottom: 0, lineHeight: 1.4, textAlign: 'left' }}>{mom.summary}</p>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', fontStyle: 'italic', textAlign: 'left' }}>Attendees: {mom.attendees}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 5: STANDARD OPERATING PROCEDURES (SOP) */}
                {activeTabInModal === 'sop' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', textAlign: 'left' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', textAlign: 'left' }}>
                      Referenced Standard Operating Procedures (SOP)
                    </div>
                    {activeProject.sopReferences.map((sop) => (
                      <div key={sop.id} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}>
                        <div style={{ textAlign: 'left' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent-600)', backgroundColor: '#F5F3FF', padding: '2px 6px', borderRadius: '4px', border: '1px solid #DDD6FE' }}>{sop.code}</span>
                          <div style={{ fontSize: '12px', fontWeight: 650, color: '#0F172A', marginTop: '4px', textAlign: 'left' }}>{sop.title}</div>
                        </div>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>{sop.category}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 6: PROJECT FINANCE INFORMATION */}
                {activeTabInModal === 'finance' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'left' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.65rem', textAlign: 'left' }}>
                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>TOTAL CONTRACT</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{activeProject.financeInfo.totalValuation}</div>
                      </div>
                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>BILLED AMOUNT</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0284C7', marginTop: '2px' }}>{activeProject.financeInfo.billedAmount}</div>
                      </div>
                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>RECEIVED AMOUNT</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#059669', marginTop: '2px' }}>{activeProject.financeInfo.receivedAmount}</div>
                      </div>
                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem', textAlign: 'left' }}>
                        <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>PENDING VALUATION</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#D97706', marginTop: '2px' }}>{activeProject.financeInfo.pendingValuation}</div>
                      </div>
                    </div>
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

      {/* ALLOCATE NEW PROJECT FORM MODAL */}
      {isAllocateModalOpen &&
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
            onClick={() => setIsAllocateModalOpen(false)}
            onWheel={(e) => {
              if (e.target === e.currentTarget) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <div
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
                    Allocate New Project (Up to ₹50 Cr)
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', textAlign: 'left' }}>
                    Register engineering project code, sector, division allocation, and financial valuation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAllocateModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleAllocateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', textAlign: 'left' }}>
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

                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                    Project Name / Assignment Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Metro Expressway Extension Sub-surface Soil Investigation"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
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
                    placeholder="e.g. State Public Works & Transit Authority"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', textAlign: 'left' }}>
                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                      Contract Valuation (Max ₹50 Cr)
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
                    <option value="Division 1 — Geotechnical & Soil Investigation">Division 1 — Geotechnical & Soil Investigation</option>
                    <option value="Division 2 — Topographic & UAV Aerial Surveying">Division 2 — Topographic & UAV Aerial Surveying</option>
                    <option value="Division 3 — Structural Audit & NDT Testing">Division 3 — Structural Audit & NDT Testing</option>
                    <option value="Division 4 — Hydrology & Environmental Engineering">Division 4 — Hydrology & Environmental Engineering</option>
                  </select>
                </div>

                {/* Form Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '0.5rem', textAlign: 'left' }}>
                  <button
                    type="button"
                    onClick={() => setIsAllocateModalOpen(false)}
                    style={{ padding: '0.45rem 1rem', borderRadius: '6px', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '0.45rem 1.15rem', borderRadius: '6px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: 650, cursor: 'pointer' }}
                  >
                    Allocate Project
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
