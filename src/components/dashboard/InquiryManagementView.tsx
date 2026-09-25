import React, { useState, useMemo } from 'react';
import { DETAILED_INQUIRIES_LIST } from '../../data/mockInquiryData';
import type { InquiryChannel, InquiryStatus, DetailedInquiryItem } from '../../types/inquiry';
import {
  Inbox,
  Search,
  Filter,
  ArrowUpDown,
  FileText,
  Globe,
  Award,
  PhoneCall,
  Mail,
  X,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

interface InquiryManagementViewProps {
  onReturnToOverview?: () => void;
}

export const InquiryManagementView: React.FC<InquiryManagementViewProps> = () => {
  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'value-desc' | 'value-asc' | 'urgency'>('date-desc');

  // Selected Detail Modal / Drawer state
  const [activeDetailItem, setActiveDetailItem] = useState<DetailedInquiryItem | null>(null);

  // UI state for loading & error simulation
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorState, setShowErrorState] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Filtered & Sorted Inquiries computation
  const filteredInquiries = useMemo(() => {
    return DETAILED_INQUIRIES_LIST.filter((item) => {
      // Search query matching
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.code.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.clientName.toLowerCase().includes(query) ||
        (item.quotationRef && item.quotationRef.toLowerCase().includes(query)) ||
        item.contactPerson.toLowerCase().includes(query);

      // Channel filter matching
      const matchesChannel =
        selectedChannel === 'ALL' || item.channel === selectedChannel;

      // Status filter matching
      const matchesStatus =
        selectedStatus === 'ALL' || item.status === selectedStatus;

      return matchesSearch && matchesChannel && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return b.timestamp - a.timestamp;
      if (sortBy === 'date-asc') return a.timestamp - b.timestamp;
      if (sortBy === 'value-desc') return b.numericalValue - a.numericalValue;
      if (sortBy === 'value-asc') return a.numericalValue - b.numericalValue;
      if (sortBy === 'urgency') {
        const urgencyOrder = { High: 3, Medium: 2, Normal: 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      }
      return 0;
    });
  }, [searchQuery, selectedChannel, selectedStatus, sortBy]);

  // Handle Refresh simulation
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  // Copy code handler
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Reset all filters helper
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedChannel('ALL');
    setSelectedStatus('ALL');
    setSortBy('date-desc');
    setShowErrorState(false);
  };

  // Icon getter for confirmed Inquiry Channels
  const getChannelIcon = (channel: InquiryChannel) => {
    switch (channel) {
      case 'Online Quotations':
        return <FileText size={14} style={{ color: 'var(--color-accent-600)' }} />;
      case 'GEM / Website / Portal':
        return <Globe size={14} style={{ color: '#0284C7' }} />;
      case 'Tenders':
        return <Award size={14} style={{ color: '#D97706' }} />;
      case 'Verbal Inquiries':
        return <PhoneCall size={14} style={{ color: '#7C3AED' }} />;
      case 'Mail Inquiries':
        return <Mail size={14} style={{ color: '#059669' }} />;
    }
  };

  // Channel badge styling helper
  const getChannelBadgeStyle = (channel: InquiryChannel) => {
    switch (channel) {
      case 'Online Quotations':
        return { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE', color: '#6D28D9' };
      case 'GEM / Website / Portal':
        return { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD', color: '#0369A1' };
      case 'Tenders':
        return { backgroundColor: '#FFFBEB', borderColor: '#FDE68A', color: '#B45309' };
      case 'Verbal Inquiries':
        return { backgroundColor: '#F3E8FF', borderColor: '#E9D5FF', color: '#6B21A8' };
      case 'Mail Inquiries':
        return { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0', color: '#047857' };
    }
  };

  // Status badge styling helper
  const getStatusBadgeStyle = (status: InquiryStatus) => {
    switch (status) {
      case 'Pending Action':
        return { backgroundColor: '#FFFBEB', borderColor: '#FDE68A', color: '#B45309' };
      case 'Under Review':
        return { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', color: '#1D4ED8' };
      case 'Quotation Sent':
        return { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE', color: '#6D28D9' };
      case 'Converted':
        return { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0', color: '#047857' };
    }
  };

  // Channel counts breakdown
  const channelCounts = useMemo(() => {
    const counts = {
      'Online Quotations': 0,
      'GEM / Website / Portal': 0,
      Tenders: 0,
      'Verbal Inquiries': 0,
      'Mail Inquiries': 0
    };
    DETAILED_INQUIRIES_LIST.forEach((item) => {
      if (counts[item.channel] !== undefined) {
        counts[item.channel]++;
      }
    });
    return counts;
  }, []);

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
      {/* SECTION 1: HEADER & PAGE TITLE BAR */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
          textAlign: 'left'
        }}
      >
        <div style={{ textAlign: 'left' }}>
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
                paddingLeft: '9px'
              }}
            >
              <Inbox size={18} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 700, lineHeight: 1.2, margin: 0, textAlign: 'left' }}>
                Inquiry Management
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px', lineHeight: 1.3, textAlign: 'left' }}>
                Centralized workspace for online quotations, GEM/portal tenders, verbal requests, and direct mail inquiry tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls Header Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={handleRefresh}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '6px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: '#0F172A',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all var(--transition-fast)'
            }}
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setShowErrorState((prev) => !prev)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '6px',
              backgroundColor: showErrorState ? '#FEF2F2' : '#F8FAFC',
              border: showErrorState ? '1px solid #FCA5A5' : '1px solid #E2E8F0',
              color: showErrorState ? '#DC2626' : '#64748B',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <AlertCircle size={13} />
            {showErrorState ? 'Clear Error State' : 'Simulate Error State'}
          </button>
        </div>
      </div>

      {/* SECTION 2: 5 CONFIRMED INQUIRY CHANNELS CARDS */}
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
            { name: 'Online Quotations', icon: <FileText size={16} style={{ color: 'var(--color-accent-600)' }} /> },
            { name: 'GEM / Website / Portal', icon: <Globe size={16} style={{ color: '#0284C7' }} /> },
            { name: 'Tenders', icon: <Award size={16} style={{ color: '#D97706' }} /> },
            { name: 'Verbal Inquiries', icon: <PhoneCall size={16} style={{ color: '#7C3AED' }} /> },
            { name: 'Mail Inquiries', icon: <Mail size={16} style={{ color: '#059669' }} /> }
          ] as { name: InquiryChannel; icon: React.ReactNode }[]
        ).map((chan) => {
          const isSelected = selectedChannel === chan.name;
          const count = channelCounts[chan.name];

          return (
            <div
              key={chan.name}
              onClick={() => setSelectedChannel(isSelected ? 'ALL' : chan.name)}
              style={{
                backgroundColor: '#FFFFFF',
                border: isSelected ? '1.5px solid var(--color-accent-500)' : '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                textAlign: 'left',
                boxShadow: isSelected ? '0 2px 6px rgba(109, 40, 217, 0.08)' : '0 1px 3px rgba(15, 23, 42, 0.02)',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: 650, color: '#64748B', textAlign: 'left' }}>
                  {chan.name}
                </span>
                {chan.icon}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '2px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>
                  {count}
                </span>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
                  Records
                </span>
              </div>

              <div style={{ fontSize: '11px', color: isSelected ? 'var(--color-accent-600)' : '#94A3B8', fontWeight: 600, marginTop: '2px' }}>
                {isSelected ? '✓ Filtering active' : 'Click to filter'}
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 3: SEARCH, FILTER, AND SORT CONTROLS BAR */}
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
        {/* Search Input Box */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 300px',
            minWidth: '260px'
          }}
        >
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
            placeholder="Search by ID, Title, Client Name, or Quotation Ref..."
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

        {/* Filter Controls Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Channel Filter Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Filter size={13} style={{ color: '#64748B' }} />
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              style={{
                padding: '0.45rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                fontSize: '12px',
                color: '#0F172A',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Inquiry Channels</option>
              <option value="Online Quotations">Online Quotations</option>
              <option value="GEM / Website / Portal">GEM / Website / Portal</option>
              <option value="Tenders">Tenders</option>
              <option value="Verbal Inquiries">Verbal Inquiries</option>
              <option value="Mail Inquiries">Mail Inquiries</option>
            </select>
          </div>

          {/* Status Filter Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <SlidersHorizontal size={13} style={{ color: '#64748B' }} />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: '0.45rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                fontSize: '12px',
                color: '#0F172A',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending Action">Pending Action</option>
              <option value="Under Review">Under Review</option>
              <option value="Quotation Sent">Quotation Sent</option>
              <option value="Converted">Converted</option>
            </select>
          </div>

          {/* Sort Control Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowUpDown size={13} style={{ color: '#64748B' }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '0.45rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                fontSize: '12px',
                color: '#0F172A',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="date-desc">Sort: Newest First</option>
              <option value="date-asc">Sort: Oldest First</option>
              <option value="value-desc">Sort: Value (High to Low)</option>
              <option value="value-asc">Sort: Value (Low to High)</option>
              <option value="urgency">Sort: Priority Urgency</option>
            </select>
          </div>

          {/* Reset Filters button if any filter is active */}
          {(searchQuery || selectedChannel !== 'ALL' || selectedStatus !== 'ALL' || sortBy !== 'date-desc') && (
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

      {/* SECTION 4: MAIN INQUIRY LISTING TABLE AREA */}
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
        {/* Table Header Row Summary */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '14px', fontWeight: 650, color: '#0F172A', textAlign: 'left' }}>
              Inquiry Records List
            </span>
            <span style={{ fontSize: '12px', color: '#64748B', marginLeft: '8px', fontWeight: 500 }}>
              Showing {filteredInquiries.length} of {DETAILED_INQUIRIES_LIST.length} entries
            </span>
          </div>

          {selectedChannel !== 'ALL' && (
            <span
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '12px',
                backgroundColor: '#F5F3FF',
                border: '1px solid #DDD6FE',
                color: 'var(--color-accent-600)',
                fontWeight: 600
              }}
            >
              Filtered by: {selectedChannel}
            </span>
          )}
        </div>

        {/* CONDITION: SIMULATED ERROR STATE */}
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
                Unable to load inquiry records
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#7F1D1D', margin: 0, textAlign: 'left' }}>
              A network or data connection issue occurred while fetching the inquiry management list. Please verify your connection or try again.
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
                cursor: 'pointer',
                marginTop: '0.25rem'
              }}
            >
              Retry & Reset Filters
            </button>
          </div>
        ) : isLoading ? (
          /* CONDITION: SIMULATED LOADING STATE */
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
              Loading Inquiry Records...
            </div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              Fetching latest quotations, tenders, and direct inquiries.
            </div>
          </div>
        ) : filteredInquiries.length === 0 ? (
          /* CONDITION: EMPTY STATE */
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
            <Search size={24} style={{ color: '#94A3B8' }} />
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
              No Inquiries Found
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0, textAlign: 'left', maxWidth: '600px' }}>
              No inquiry records match your current search query "{searchQuery}" or selected filter criteria. Try clearing search keywords or selecting a different inquiry channel or status.
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
              Clear Search & Reset All Filters
            </button>
          </div>
        ) : (
          /* CONDITION: ACTIVE DATA TABLE */
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '13px'
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderBottom: '1.5px solid #E2E8F0',
                    color: '#64748B',
                    fontWeight: 650,
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>ID & Date</th>
                  <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Inquiry Title & Client Name</th>
                  <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Source / Channel</th>
                  <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Quotation Ref & Value</th>
                  <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Urgency</th>
                  <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((item) => {
                  const channelBadgeStyle = getChannelBadgeStyle(item.channel);
                  const statusBadgeStyle = getStatusBadgeStyle(item.status);

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background-color var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* ID & Date */}
                      <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '12px', textAlign: 'left' }}>
                          {item.code}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', textAlign: 'left' }}>
                          {item.dateReceived}
                        </div>
                      </td>

                      {/* Title & Client Name */}
                      <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top', maxWidth: '320px' }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: '#0F172A',
                            fontSize: '13px',
                            lineHeight: 1.3,
                            textAlign: 'left'
                          }}
                        >
                          {item.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px', fontWeight: 500, textAlign: 'left' }}>
                          Client: {item.clientName}
                        </div>
                      </td>

                      {/* Source / Channel */}
                      <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            border: `1px solid ${channelBadgeStyle.borderColor}`,
                            backgroundColor: channelBadgeStyle.backgroundColor,
                            color: channelBadgeStyle.color,
                            textAlign: 'left'
                          }}
                        >
                          {getChannelIcon(item.channel)}
                          {item.channel}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 650,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            border: `1px solid ${statusBadgeStyle.borderColor}`,
                            backgroundColor: statusBadgeStyle.backgroundColor,
                            color: statusBadgeStyle.color,
                            textAlign: 'left'
                          }}
                        >
                          {item.status === 'Converted' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                          {item.status}
                        </span>
                      </td>

                      {/* Quotation Ref & Value */}
                      <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '13px', textAlign: 'left' }}>
                          {item.estimatedValue}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', textAlign: 'left' }}>
                          {item.quotationRef ? `Ref: ${item.quotationRef}` : 'Quote pending'}
                        </div>
                      </td>

                      {/* Urgency */}
                      <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: item.urgency === 'High' ? '#DC2626' : item.urgency === 'Medium' ? '#D97706' : '#64748B',
                            textAlign: 'left'
                          }}
                        >
                          {item.urgency} Priority
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top' }}>
                        <button
                          type="button"
                          onClick={() => setActiveDetailItem(item)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            borderRadius: '6px',
                            backgroundColor: '#F8FAFC',
                            border: '1px solid #CBD5E1',
                            color: '#0F172A',
                            fontSize: '11px',
                            fontWeight: 650,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all var(--transition-fast)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-accent-500)';
                            e.currentTarget.style.color = 'var(--color-accent-600)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#CBD5E1';
                            e.currentTarget.style.color = '#0F172A';
                          }}
                        >
                          View Details
                          <ChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 5: INQUIRY DETAILS & QUOTATION INFO MODAL / DRAWER */}
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
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      border: `1px solid ${getChannelBadgeStyle(activeDetailItem.channel).borderColor}`,
                      backgroundColor: getChannelBadgeStyle(activeDetailItem.channel).backgroundColor,
                      color: getChannelBadgeStyle(activeDetailItem.channel).color
                    }}
                  >
                    {getChannelIcon(activeDetailItem.channel)}
                    {activeDetailItem.channel}
                  </span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 650,
                      border: `1px solid ${getStatusBadgeStyle(activeDetailItem.status).borderColor}`,
                      backgroundColor: getStatusBadgeStyle(activeDetailItem.status).backgroundColor,
                      color: getStatusBadgeStyle(activeDetailItem.status).color
                    }}
                  >
                    {activeDetailItem.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: 700, marginTop: '8px', lineHeight: 1.3, textAlign: 'left' }}>
                  {activeDetailItem.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveDetailItem(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              {/* Row 1: Key Metadata Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'left' }}>
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textAlign: 'left' }}>CLIENT / ORG</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: '2px', textAlign: 'left' }}>{activeDetailItem.clientName}</div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textAlign: 'left' }}>ESTIMATED VALUATION</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-accent-600)', marginTop: '2px', textAlign: 'left' }}>{activeDetailItem.estimatedValue}</div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textAlign: 'left' }}>QUOTATION REF</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: '2px', textAlign: 'left' }}>
                    {activeDetailItem.quotationRef || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Row 2: Contact Information */}
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.85rem 1rem', textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', textAlign: 'left' }}>
                  Contact Information
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '12px', color: '#334155', textAlign: 'left' }}>
                  <div><strong>Person:</strong> {activeDetailItem.contactPerson}</div>
                  <div><strong>Email:</strong> {activeDetailItem.contactEmail}</div>
                  <div><strong>Phone:</strong> {activeDetailItem.contactPhone}</div>
                </div>
              </div>

              {/* Row 3: Technical Scope Description */}
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '4px', textAlign: 'left' }}>
                  Technical Scope of Work
                </div>
                <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.75rem 0.85rem', textAlign: 'left' }}>
                  {activeDetailItem.scopeDescription}
                </div>
              </div>

              {/* Row 4: Status Remarks / Notes */}
              {activeDetailItem.remarks && (
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '4px', textAlign: 'left' }}>
                    Status Notes & Remarks
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4, backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '6px', padding: '0.65rem 0.85rem', textAlign: 'left' }}>
                    {activeDetailItem.remarks}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '0.5rem', textAlign: 'left' }}>
              <button
                type="button"
                onClick={() => handleCopyCode(activeDetailItem.code)}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '6px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  color: '#0F172A',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copiedCode ? <Check size={13} style={{ color: '#059669' }} /> : <Copy size={13} />}
                {copiedCode ? 'Code Copied!' : 'Copy Reference Code'}
              </button>

              <button
                type="button"
                onClick={() => setActiveDetailItem(null)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 650,
                  cursor: 'pointer'
                }}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
