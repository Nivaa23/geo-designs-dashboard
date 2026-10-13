import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  MOCK_FINANCE_RECOVERY_RECORDS,
  MOCK_RECOVERY_CATEGORY_SUMMARIES,
  MOCK_PROJECT_OPTIONS_FOR_COMMITMENT
} from '../../data/mockFinanceRecoveryData';
import type {
  FinanceRecoveryRecord,
  ContractCategory,
  RecoveryHealthStatus,
  MilestoneRecoverySchedule
} from '../../types/financeRecovery';
import {
  DollarSign,
  Search,
  Plus,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  Clock,
  X,
  AlertTriangle
} from 'lucide-react';

interface FinanceRecoveryViewProps {
  onReturnToOverview?: () => void;
}

export const FinanceRecoveryView: React.FC<FinanceRecoveryViewProps> = ({ onReturnToOverview }) => {
  // Main state
  const [records, setRecords] = useState<FinanceRecoveryRecord[]>(MOCK_FINANCE_RECOVERY_RECORDS);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'all' | 'overdue' | 'healthy'>('all');
  const [sortBy, setSortBy] = useState<'due-asc' | 'due-desc' | 'outstanding-desc' | 'outstanding-asc' | 'rate-desc' | 'valuation-desc'>('due-asc');

  // Active Detail Modal state
  const [activeRecord, setActiveRecord] = useState<FinanceRecoveryRecord | null>(null);

  // Record Commitment / Invoice Modal state
  const [isCommitmentModalOpen, setIsCommitmentModalOpen] = useState(false);
  const [newProjectCode, setNewProjectCode] = useState('GEO-PRJ-2026-089');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newAmount, setNewAmount] = useState('₹15,00,000');
  const [newDueDate, setNewDueDate] = useState('15 Nov 2026');
  const [newResponsiblePerson, setNewResponsiblePerson] = useState('Dr. V. Raman');

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorState, setShowErrorState] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Scroll locking when modal is open
  useEffect(() => {
    if (activeRecord || isCommitmentModalOpen) {
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
  }, [activeRecord, isCommitmentModalOpen]);

  // Filtered & Sorted Records
  const filteredRecords = useMemo(() => {
    return records
      .filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          item.projectCode.toLowerCase().includes(query) ||
          item.projectName.toLowerCase().includes(query) ||
          item.client.toLowerCase().includes(query) ||
          item.responsiblePerson.toLowerCase().includes(query) ||
          item.department.toLowerCase().includes(query) ||
          item.milestones.some((m) => m.milestoneTitle.toLowerCase().includes(query) || (m.invoiceRef && m.invoiceRef.toLowerCase().includes(query)));

        const matchesCategory =
          selectedCategory === 'ALL' || item.contractCategory === selectedCategory;

        const matchesStatus =
          selectedStatus === 'ALL' || item.status === selectedStatus;

        const matchesSector =
          selectedSector === 'ALL' || item.sector === selectedSector;

        let matchesTab = true;
        if (activeTab === 'overdue') {
          matchesTab = item.isOverdue || item.status === 'Attention Required' || item.status === 'Action Needed';
        } else if (activeTab === 'healthy') {
          matchesTab = item.status === 'Healthy' || item.status === 'Fully Recovered';
        }

        return (
          matchesSearch &&
          matchesCategory &&
          matchesStatus &&
          matchesSector &&
          matchesTab
        );
      })
      .sort((a, b) => {
        if (sortBy === 'due-asc') return a.dueDate.localeCompare(b.dueDate);
        if (sortBy === 'due-desc') return b.dueDate.localeCompare(a.dueDate);
        if (sortBy === 'outstanding-desc') return b.numericalOutstanding - a.numericalOutstanding;
        if (sortBy === 'outstanding-asc') return a.numericalOutstanding - b.numericalOutstanding;
        if (sortBy === 'rate-desc') return b.recoveryRate - a.recoveryRate;
        if (sortBy === 'valuation-desc') return b.numericalValuation - a.numericalValuation;
        return 0;
      });
  }, [records, searchQuery, selectedCategory, selectedStatus, selectedSector, activeTab, sortBy]);

  // Overall KPI Metrics
  const totalValuationSum = useMemo(() => {
    return records.reduce((acc, curr) => acc + curr.numericalValuation, 0);
  }, [records]);

  const totalRecoveredSum = useMemo(() => {
    return records.reduce((acc, curr) => acc + curr.numericalRecovered, 0);
  }, [records]);

  const totalOutstandingSum = useMemo(() => {
    return records.reduce((acc, curr) => acc + curr.numericalOutstanding, 0);
  }, [records]);

  const overdueAccountsCount = useMemo(() => {
    return records.filter((r) => r.isOverdue || r.status === 'Attention Required' || r.status === 'Action Needed').length;
  }, [records]);

  const overallRecoveryRate = useMemo(() => {
    if (totalValuationSum === 0) return 0;
    return Math.round((totalRecoveredSum / (totalRecoveredSum + totalOutstandingSum)) * 100);
  }, [totalValuationSum, totalRecoveredSum, totalOutstandingSum]);

  // Format INR currency
  const formatInr = (val: number) => {
    return '₹' + val.toLocaleString('en-IN');
  };

  // Helper for Status Badge styling
  const getStatusBadgeStyle = (status: RecoveryHealthStatus) => {
    switch (status) {
      case 'Healthy':
      case 'Fully Recovered':
        return {
          bg: '#ECFDF5',
          border: '#A7F3D0',
          color: '#047857',
          icon: CheckCircle2
        };
      case 'Attention Required':
        return {
          bg: '#FFFBEB',
          border: '#FDE68A',
          color: '#B45309',
          icon: Clock
        };
      case 'Action Needed':
        return {
          bg: '#FEF2F2',
          border: '#FCA5A5',
          color: '#DC2626',
          icon: AlertTriangle
        };
    }
  };

  // Handle Refresh simulation
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showSuccessNotification('Finance & Recovery ledger refreshed with latest client billing clearances.');
    }, 350);
  };

  // Success notification helper
  const showSuccessNotification = (msg: string) => {
    setSuccessBanner(msg);
    setTimeout(() => {
      setSuccessBanner(null);
    }, 3800);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSelectedSector('ALL');
    setActiveTab('all');
    setSortBy('due-asc');
    setShowErrorState(false);
  };

  // Handle Recording New Commitment Submit
  const handleCommitmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim() || !newAmount.trim()) return;

    const numericStr = newAmount.replace(/[^0-9]/g, '');
    const numVal = parseInt(numericStr, 10) || 1000000;

    const matchedProject = MOCK_PROJECT_OPTIONS_FOR_COMMITMENT.find((p) => p.code === newProjectCode);
    const projectNameStr = matchedProject ? matchedProject.title : 'Engineering Assignment';
    const clientStr = matchedProject ? matchedProject.client : 'Infrastructure Authority';
    const categoryStr = matchedProject ? (matchedProject.category as ContractCategory) : 'Government & PSU Contracts';

    const newMilestone: MilestoneRecoverySchedule = {
      id: `ms-new-${Date.now()}`,
      milestoneTitle: newMilestoneTitle.trim(),
      percentage: 20,
      amount: formatInr(numVal),
      numericalAmount: numVal,
      dueDate: newDueDate,
      recoveredAmount: '₹0',
      pendingAmount: formatInr(numVal),
      status: 'Pending',
      invoiceRef: `INV-GEO-${Date.now().toString().slice(-4)}`
    };

    // If project already exists in records, add milestone; else create record
    const existingIndex = records.findIndex((r) => r.projectCode === newProjectCode);
    if (existingIndex >= 0) {
      const updatedList = [...records];
      const target = updatedList[existingIndex];
      updatedList[existingIndex] = {
        ...target,
        numericalBilled: target.numericalBilled + numVal,
        billedAmount: formatInr(target.numericalBilled + numVal),
        numericalOutstanding: target.numericalOutstanding + numVal,
        outstandingRecovery: formatInr(target.numericalOutstanding + numVal),
        milestones: [...target.milestones, newMilestone]
      };
      setRecords(updatedList);
    } else {
      const newRecord: FinanceRecoveryRecord = {
        id: `REC-2026-${String(records.length + 1).padStart(3, '0')}`,
        projectCode: newProjectCode,
        projectName: projectNameStr,
        client: clientStr,
        contractCategory: categoryStr,
        sector: 'Geotechnical',
        totalValuation: formatInr(numVal * 2),
        numericalValuation: numVal * 2,
        billedAmount: formatInr(numVal),
        numericalBilled: numVal,
        recoveredAmount: '₹0',
        numericalRecovered: 0,
        outstandingRecovery: formatInr(numVal),
        numericalOutstanding: numVal,
        recoveryRate: 0,
        dueDate: newDueDate,
        isOverdue: false,
        responsiblePerson: newResponsiblePerson.trim(),
        responsibleRole: 'Project Manager',
        department: 'Operations & Advisory',
        status: 'Healthy',
        milestones: [newMilestone],
        recoveryNotes: 'Newly committed milestone invoice created.'
      };
      setRecords([newRecord, ...records]);
    }

    setIsCommitmentModalOpen(false);
    setNewMilestoneTitle('');
    showSuccessNotification(`Milestone invoice for ${newProjectCode} recorded successfully.`);
  };

  // Handle Mark Recovered in Detail Modal
  const handleRecordPayment = (recordId: string, milestoneId: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          const updatedMilestones = r.milestones.map((m) => {
            if (m.id === milestoneId && m.status !== 'Recovered') {
              return {
                ...m,
                status: 'Recovered' as const,
                recoveredAmount: m.amount,
                pendingAmount: '₹0'
              };
            }
            return m;
          });

          // Recompute recovered
          const newRecoveredNum = updatedMilestones.reduce((acc, curr) => {
            const num = parseInt(curr.recoveredAmount.replace(/[^0-9]/g, ''), 10) || 0;
            return acc + num;
          }, 0);
          const newOutstandingNum = Math.max(0, r.numericalBilled - newRecoveredNum);
          const newRate = r.numericalBilled > 0 ? Math.round((newRecoveredNum / r.numericalBilled) * 100) : 100;
          const newStatus: RecoveryHealthStatus = newOutstandingNum === 0 ? 'Fully Recovered' : r.status;

          const updatedRecord: FinanceRecoveryRecord = {
            ...r,
            numericalRecovered: newRecoveredNum,
            recoveredAmount: formatInr(newRecoveredNum),
            numericalOutstanding: newOutstandingNum,
            outstandingRecovery: formatInr(newOutstandingNum),
            recoveryRate: newRate,
            status: newStatus,
            milestones: updatedMilestones,
            lastPaymentDate: '13 Oct 2026',
            lastPaymentAmount: r.milestones.find((m) => m.id === milestoneId)?.amount || '₹10,00,000'
          };

          if (activeRecord && activeRecord.id === recordId) {
            setActiveRecord(updatedRecord);
          }
          return updatedRecord;
        }
        return r;
      })
    );
    showSuccessNotification(`Payment recovery recorded successfully for ${recordId}.`);
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
        className="geo-recovery-header"
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
        <div className="geo-recovery-header-title-area" style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: 'rgba(2, 132, 199, 0.08)',
                border: '1px solid rgba(2, 132, 199, 0.2)',
                color: 'var(--color-accent-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <DollarSign size={18} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 700, lineHeight: 1.2, margin: 0, textAlign: 'left' }}>
                Finance & Recovery
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px', lineHeight: 1.3, textAlign: 'left', maxWidth: '720px' }}>
                Commitment tracking, client billing recovery, milestone invoice clearances, and outstanding receivables monitoring across engineering contracts.
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="geo-recovery-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
          <button
            type="button"
            onClick={() => setIsCommitmentModalOpen(true)}
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
            Record Commitment / Invoice
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

          {onReturnToOverview && (
            <button
              type="button"
              onClick={onReturnToOverview}
              style={{
                padding: '0.45rem 0.65rem',
                borderRadius: '6px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                color: '#64748B',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                whiteSpace: 'nowrap'
              }}
            >
              <ArrowLeft size={13} />
              Overview
            </button>
          )}
        </div>
      </div>

      {/* SECTION 2: PORTFOLIO SUMMARY KPI CARDS GRID */}
      <div
        className="geo-recovery-kpi-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.85rem',
          textAlign: 'left'
        }}
      >
        {/* KPI 1: Total Contract Commitments */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              TOTAL CONTRACT COMMITMENTS
            </span>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: 'rgba(2, 132, 199, 0.08)',
                color: 'var(--color-accent-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DollarSign size={15} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 750, color: '#0F172A', lineHeight: 1.1, textAlign: 'left' }}>
            {formatInr(totalValuationSum)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
            <span>{records.length} Active Contracts</span>
            <span style={{ color: '#047857', fontWeight: 600 }}>Active Portfolio</span>
          </div>
        </div>

        {/* KPI 2: Total Recovered Amount */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              RECOVERED / COLLECTED AMOUNT
            </span>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#ECFDF5',
                color: '#047857',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 750, color: '#047857', lineHeight: 1.1, textAlign: 'left' }}>
            {formatInr(totalRecoveredSum)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
            <span>{overallRecoveryRate}% Overall Clearance</span>
            <span style={{ color: '#047857', fontWeight: 600 }}>Cleared via RTGS</span>
          </div>
        </div>

        {/* KPI 3: Outstanding Receivables */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              OUTSTANDING RECEIVABLES
            </span>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#FFFBEB',
                color: '#B45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock size={15} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 750, color: '#B45309', lineHeight: 1.1, textAlign: 'left' }}>
            {formatInr(totalOutstandingSum)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
            <span>Across Billed Milestones</span>
            <span style={{ color: '#B45309', fontWeight: 600 }}>Pending Inflow</span>
          </div>
        </div>

        {/* KPI 4: Overdue Accounts Escalation */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              OVERDUE CLIENT ACCOUNTS
            </span>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AlertTriangle size={15} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 750, color: '#DC2626', lineHeight: 1.1, textAlign: 'left' }}>
            {overdueAccountsCount} Accounts
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
            <span>Matching Sidebar Alert</span>
            <span style={{ color: '#DC2626', fontWeight: 600 }}>Action Required</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: CONTRACT CATEGORY OVERVIEW CARDS (REUSING DASHBOARD OVERVIEW CONCEPTS) */}
      <div
        className="geo-recovery-categories-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.85rem',
          textAlign: 'left'
        }}
      >
        {MOCK_RECOVERY_CATEGORY_SUMMARIES.map((catSummary) => {
          const isSelected = selectedCategory === catSummary.category;
          const statusStyle = getStatusBadgeStyle(catSummary.status);

          return (
            <div
              key={catSummary.category}
              onClick={() => setSelectedCategory(isSelected ? 'ALL' : catSummary.category)}
              style={{
                backgroundColor: '#FFFFFF',
                border: isSelected ? '1.5px solid var(--color-accent-500)' : '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '1rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = '#CBD5E1';
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0, textAlign: 'left' }}>
                    {catSummary.category}
                  </h4>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                    Click card to filter table records
                  </div>
                </div>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: statusStyle.bg,
                    border: `1px solid ${statusStyle.border}`,
                    color: statusStyle.color,
                    fontSize: '11px',
                    fontWeight: 650,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {catSummary.status}
                </span>
              </div>

              {/* Metric Box */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem',
                  backgroundColor: '#F8FAFC',
                  padding: '0.75rem 0.85rem',
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div>
                  <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                    COMMITTED EXPENSES
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                    {catSummary.committedExpenses}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                    OUTSTANDING RECOVERY
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#B45309', marginTop: '2px' }}>
                    {catSummary.outstandingRecovery}
                  </div>
                </div>
              </div>

              {/* Progress Bar & Details */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: '#475569', fontWeight: 600 }}>
                    RECOVERED AMOUNT: <strong style={{ color: '#047857' }}>{catSummary.recoveredAmount}</strong>
                  </span>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>
                    RECOVERY RATE: {catSummary.recoveryRate}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${catSummary.recoveryRate}%`,
                      height: '100%',
                      backgroundColor: '#047857',
                      borderRadius: '3px'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                  <span>Target Recovery: 100%</span>
                  <span style={{ color: catSummary.overdueAccounts > 0 ? '#DC2626' : '#64748B', fontWeight: 600 }}>
                    {catSummary.overdueAccounts} Overdue Account
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 4: LEDGER VIEW TABS & SEARCH/FILTERS TOOLBAR */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '0.85rem 1.15rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
          textAlign: 'left'
        }}
      >
        {/* Row 1: View Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                backgroundColor: activeTab === 'all' ? '#0F172A' : '#F8FAFC',
                border: activeTab === 'all' ? '1px solid #0F172A' : '1px solid #CBD5E1',
                color: activeTab === 'all' ? '#FFFFFF' : '#475569',
                fontSize: '12px',
                fontWeight: 650,
                cursor: 'pointer'
              }}
            >
              All Recovery Ledgers ({records.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('overdue')}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                backgroundColor: activeTab === 'overdue' ? '#FEF2F2' : '#F8FAFC',
                border: activeTab === 'overdue' ? '1px solid #FCA5A5' : '1px solid #CBD5E1',
                color: activeTab === 'overdue' ? '#DC2626' : '#475569',
                fontSize: '12px',
                fontWeight: 650,
                cursor: 'pointer'
              }}
            >
              Overdue & Action Needed ({overdueAccountsCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('healthy')}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                backgroundColor: activeTab === 'healthy' ? '#ECFDF5' : '#F8FAFC',
                border: activeTab === 'healthy' ? '1px solid #A7F3D0' : '1px solid #CBD5E1',
                color: activeTab === 'healthy' ? '#047857' : '#475569',
                fontSize: '12px',
                fontWeight: 650,
                cursor: 'pointer'
              }}
            >
              Cleared / On Schedule ({records.length - overdueAccountsCount})
            </button>
          </div>

          {(searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || selectedSector !== 'ALL' || activeTab !== 'all' || sortBy !== 'due-asc') && (
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                padding: '0.4rem 0.65rem',
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

        {/* Row 2: Search Box & Dropdown Controls */}
        <div
          className="geo-recovery-toolbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}
        >
          {/* Search Box */}
          <div
            className="geo-recovery-search-wrapper"
            style={{
              position: 'relative',
              flex: '1 1 260px',
              maxWidth: '380px'
            }}
          >
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94A3B8'
              }}
            />
            <input
              type="text"
              placeholder="Search by Project Code, Title, Client, Officer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 2rem 0.45rem 2.25rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '12px',
                outline: 'none',
                backgroundColor: '#FFFFFF',
                boxSizing: 'border-box'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div
            className="geo-recovery-filter-group"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}
          >
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="geo-recovery-filter-select"
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
              <option value="ALL">All Categories</option>
              <option value="Government & PSU Contracts">Government & PSU Contracts</option>
              <option value="Private Commercial & Infrastructure">Private Commercial & Infrastructure</option>
            </select>

            {/* Sector Filter */}
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="geo-recovery-filter-select"
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
              <option value="ALL">All Sectors</option>
              <option value="Geotechnical">Geotechnical Sector</option>
              <option value="Surveying">Surveying Sector</option>
              <option value="Structural">Structural Sector</option>
              <option value="Infrastructure">Infrastructure Sector</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="geo-recovery-filter-select"
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
              <option value="Healthy">Healthy</option>
              <option value="Attention Required">Attention Required</option>
              <option value="Action Needed">Action Needed</option>
              <option value="Fully Recovered">Fully Recovered</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="geo-recovery-filter-select"
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
              <option value="due-asc">Sort: Due Date (Earliest)</option>
              <option value="due-desc">Sort: Due Date (Latest)</option>
              <option value="outstanding-desc">Sort: Outstanding (High to Low)</option>
              <option value="outstanding-asc">Sort: Outstanding (Low to High)</option>
              <option value="rate-desc">Sort: Recovery Rate (%)</option>
              <option value="valuation-desc">Sort: Contract Valuation</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 5: RECOVERY LEDGER DATA TABLE & MOBILE CARDS */}
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
        {/* Table Header Summary */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 650, color: '#0F172A', textAlign: 'left' }}>
              Project Recovery Tracking Ledger
            </span>
            <span style={{ fontSize: '12px', color: '#64748B', marginLeft: '8px', fontWeight: 500 }}>
              Showing {filteredRecords.length} of {records.length} engineering projects
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {selectedCategory !== 'ALL' && (
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', color: 'var(--color-accent-600)', fontWeight: 600 }}>
                {selectedCategory}
              </span>
            )}
            {selectedStatus !== 'ALL' && (
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A', fontWeight: 600 }}>
                Status: {selectedStatus}
              </span>
            )}
          </div>
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
                Unable to load finance & recovery records
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#7F1D1D', margin: 0, textAlign: 'left' }}>
              A network or data query error occurred while fetching billing recovery balances. Please verify connection credentials or retry.
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
              Loading Finance & Recovery Workspace...
            </div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              Reconciling milestone commitments, client invoicing clearance, and receivables ledgers.
            </div>
          </div>
        ) : filteredRecords.length === 0 ? (
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
              No Recovery Records Found
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0, textAlign: 'left', maxWidth: '600px' }}>
              No project recovery records match your search query "{searchQuery}" or selected category and status filters. Try clearing keywords or switching tabs.
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
          /* CONDITION: DATA TABLE & MOBILE CARDS */
          <>
            {/* Desktop Table View */}
            <div style={{ overflowX: 'auto', width: '100%' }} className="geo-recovery-desktop-table">
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
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Project & Sector</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Client & Category</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Responsible Officer</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Valuation & Billed</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Recovered Amount</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Outstanding & Due</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((item) => {
                    const statusStyle = getStatusBadgeStyle(item.status);
                    const StatusIcon = statusStyle.icon;

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
                        {/* Project & Sector */}
                        <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top', maxWidth: '240px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '3px' }}>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                color: 'var(--color-accent-600)',
                                backgroundColor: 'rgba(2, 132, 199, 0.08)',
                                padding: '1px 5px',
                                borderRadius: '3px',
                                border: '1px solid rgba(2, 132, 199, 0.2)'
                              }}
                            >
                              {item.projectCode}
                            </span>
                            <span style={{ fontSize: '10px', color: '#64748B', backgroundColor: '#F1F5F9', padding: '1px 5px', borderRadius: '3px' }}>
                              {item.sector}
                            </span>
                          </div>
                          <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '12px', lineHeight: 1.35, textAlign: 'left' }}>
                            {item.projectName}
                          </div>
                        </td>

                        {/* Client & Category */}
                        <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top', maxWidth: '220px' }}>
                          <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '12px' }}>
                            {item.client}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                            {item.contractCategory}
                          </div>
                        </td>

                        {/* Responsible Officer */}
                        <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 650, color: '#0F172A', fontSize: '12px' }}>
                            {item.responsiblePerson}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
                            {item.department}
                          </div>
                        </td>

                        {/* Valuation & Billed */}
                        <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '13px' }}>
                            {item.totalValuation}
                          </div>
                          <div style={{ fontSize: '11px', color: '#0284C7', marginTop: '1px', fontWeight: 600 }}>
                            Billed: {item.billedAmount}
                          </div>
                        </td>

                        {/* Recovered Amount */}
                        <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top', minWidth: '130px' }}>
                          <div style={{ fontWeight: 700, color: '#047857', fontSize: '13px' }}>
                            {item.recoveredAmount}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '4px' }}>
                            <div style={{ flex: 1, height: '4px', backgroundColor: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  width: `${item.recoveryRate}%`,
                                  height: '100%',
                                  backgroundColor: '#047857',
                                  borderRadius: '2px'
                                }}
                              />
                            </div>
                            <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>{item.recoveryRate}%</span>
                          </div>
                        </td>

                        {/* Outstanding & Due */}
                        <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: item.numericalOutstanding > 0 ? '#B45309' : '#047857', fontSize: '13px' }}>
                            {item.outstandingRecovery}
                          </div>
                          <div style={{ fontSize: '11px', color: item.isOverdue ? '#DC2626' : '#64748B', marginTop: '2px', fontWeight: item.isOverdue ? 700 : 500 }}>
                            Due: {item.dueDate}
                            {item.isOverdue && item.overdueDays && (
                              <span style={{ marginLeft: '4px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '1px 4px', borderRadius: '3px', fontSize: '10px' }}>
                                +{item.overdueDays}d
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top' }}>
                          <span
                            style={{
                              padding: '2px 7px',
                              borderRadius: '4px',
                              backgroundColor: statusStyle.bg,
                              border: `1px solid ${statusStyle.border}`,
                              color: statusStyle.color,
                              fontSize: '11px',
                              fontWeight: 650,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <StatusIcon size={12} />
                            {item.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top' }}>
                          <button
                            type="button"
                            onClick={() => setActiveRecord(item)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '4px',
                              backgroundColor: '#F8FAFC',
                              border: '1px solid #CBD5E1',
                              color: '#0F172A',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Milestones
                            <ChevronRight size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Reflow (Viewed on screen width <= 768px) */}
            <div className="geo-recovery-mobile-cards" style={{ display: 'none', flexDirection: 'column', gap: '0.85rem' }}>
              {filteredRecords.map((item) => {
                const statusStyle = getStatusBadgeStyle(item.status);
                const StatusIcon = statusStyle.icon;

                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                      textAlign: 'left'
                    }}
                  >
                    {/* Header: Project code, sector & status */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'var(--color-accent-600)',
                            backgroundColor: 'rgba(2, 132, 199, 0.08)',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            border: '1px solid rgba(2, 132, 199, 0.2)'
                          }}
                        >
                          {item.projectCode}
                        </span>
                        <span style={{ fontSize: '10px', color: '#64748B', backgroundColor: '#F1F5F9', padding: '1px 5px', borderRadius: '3px' }}>
                          {item.sector}
                        </span>
                      </div>
                      <span
                        style={{
                          padding: '2px 7px',
                          borderRadius: '4px',
                          backgroundColor: statusStyle.bg,
                          border: `1px solid ${statusStyle.border}`,
                          color: statusStyle.color,
                          fontSize: '11px',
                          fontWeight: 650,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <StatusIcon size={12} />
                        {item.status}
                      </span>
                    </div>

                    {/* Title & Client */}
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 650, color: '#0F172A', lineHeight: 1.35 }}>
                        {item.projectName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                        Client: {item.client} • {item.contractCategory}
                      </div>
                    </div>

                    {/* Financial Figures Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.5rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '6px',
                        padding: '0.65rem',
                        textAlign: 'left'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>VALUATION</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: '1px' }}>{item.totalValuation}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>RECOVERED</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#047857', marginTop: '1px' }}>{item.recoveredAmount}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>OUTSTANDING</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: item.numericalOutstanding > 0 ? '#B45309' : '#047857', marginTop: '1px' }}>{item.outstandingRecovery}</div>
                      </div>
                    </div>

                    {/* Due Date & Officer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#475569', flexWrap: 'wrap', gap: '0.35rem' }}>
                      <span>Due: <strong>{item.dueDate}</strong> {item.isOverdue && <span style={{ color: '#DC2626' }}>(Overdue)</span>}</span>
                      <span>Officer: <strong>{item.responsiblePerson}</strong></span>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => setActiveRecord(item)}
                      style={{
                        padding: '0.45rem',
                        borderRadius: '6px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        color: '#0F172A',
                        fontSize: '12px',
                        fontWeight: 650,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        marginTop: '0.25rem'
                      }}
                    >
                      View Milestone Billing Schedule
                      <ChevronRight size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* MODAL 1: VIEW RECOVERY DETAILS & MILESTONES (VIEWPORT PORTAL) */}
      {activeRecord &&
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
              zIndex: 9999,
              boxSizing: 'border-box'
            }}
          >
            <div
              className="geo-recovery-modal-content"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                width: '100%',
                maxWidth: '820px',
                maxHeight: 'min(90vh, 780px)',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                padding: '1.5rem',
                gap: '1.25rem',
                textAlign: 'left'
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--color-accent-600)',
                        backgroundColor: 'rgba(2, 132, 199, 0.08)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: '1px solid rgba(2, 132, 199, 0.2)'
                      }}
                    >
                      {activeRecord.projectCode}
                    </span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
                      {activeRecord.projectName}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    Client: <strong>{activeRecord.client}</strong> • {activeRecord.contractCategory}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveRecord(null)}
                  style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Key Financial Metric Highlights Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.65rem',
                  backgroundColor: '#F8FAFC',
                  padding: '0.85rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0',
                  textAlign: 'left'
                }}
                className="geo-recovery-modal-grid-4"
              >
                <div>
                  <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    TOTAL VALUATION
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                    {activeRecord.totalValuation}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    BILLED AMOUNT
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284C7', marginTop: '2px' }}>
                    {activeRecord.billedAmount}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    RECOVERED AMOUNT
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#047857', marginTop: '2px' }}>
                    {activeRecord.recoveredAmount}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    OUTSTANDING BALANCE
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: activeRecord.numericalOutstanding > 0 ? '#B45309' : '#047857', marginTop: '2px' }}>
                    {activeRecord.outstandingRecovery}
                  </div>
                </div>
              </div>

              {/* Milestone Billing & Recovery Schedule List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                    Milestone Billing & Recovery Schedule
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    {activeRecord.milestones.length} Milestones Tracked
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {activeRecord.milestones.map((ms) => {
                    const isFullyRecovered = ms.status === 'Recovered';
                    const isOverdue = ms.status === 'Overdue';

                    return (
                      <div
                        key={ms.id}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '6px',
                          padding: '0.75rem 0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div style={{ flex: '1 1 240px', minWidth: 0, textAlign: 'left' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                              {ms.milestoneTitle}
                            </span>
                            {ms.invoiceRef && (
                              <span style={{ fontSize: '10px', color: '#64748B', backgroundColor: '#F1F5F9', padding: '1px 5px', borderRadius: '3px' }}>
                                {ms.invoiceRef}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                            Tranche Share: <strong>{ms.percentage}%</strong> • Due Date: <strong>{ms.dueDate}</strong>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{ms.amount}</div>
                            <div style={{ fontSize: '10px', color: isFullyRecovered ? '#047857' : '#B45309' }}>
                              {isFullyRecovered ? 'Recovered' : `Pending: ${ms.pendingAmount}`}
                            </div>
                          </div>

                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: isFullyRecovered ? '#ECFDF5' : isOverdue ? '#FEF2F2' : '#FFFBEB',
                              border: `1px solid ${isFullyRecovered ? '#A7F3D0' : isOverdue ? '#FCA5A5' : '#FDE68A'}`,
                              color: isFullyRecovered ? '#047857' : isOverdue ? '#DC2626' : '#B45309',
                              fontSize: '11px',
                              fontWeight: 650,
                              minWidth: '70px',
                              textAlign: 'center'
                            }}
                          >
                            {ms.status}
                          </span>

                          {!isFullyRecovered && (
                            <button
                              type="button"
                              onClick={() => handleRecordPayment(activeRecord.id, ms.id)}
                              style={{
                                padding: '0.35rem 0.65rem',
                                borderRadius: '4px',
                                backgroundColor: '#ECFDF5',
                                border: '1px solid #A7F3D0',
                                color: '#047857',
                                fontSize: '11px',
                                fontWeight: 650,
                                cursor: 'pointer'
                              }}
                            >
                              Mark Cleared
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Responsible Officer & Follow-up Notes */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem',
                  backgroundColor: '#F8FAFC',
                  padding: '0.75rem 0.85rem',
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0',
                  textAlign: 'left'
                }}
                className="geo-recovery-modal-grid-2"
              >
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>RESPONSIBLE ENGINEERING OFFICER</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{activeRecord.responsiblePerson}</div>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '1px' }}>{activeRecord.responsibleRole} • {activeRecord.department}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>RECOVERY STATUS & REMARKS</div>
                  <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px', lineHeight: 1.4 }}>
                    {activeRecord.recoveryNotes || 'Ongoing milestone follow-up with client accounts officer.'}
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => showSuccessNotification(`Client statement and ledger export generated for ${activeRecord.projectCode}.`)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '6px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    color: '#0F172A',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Export Project Ledger
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRecord(null)}
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
                  Close Monitoring View
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* MODAL 2: RECORD COMMITMENT / INVOICE (VIEWPORT PORTAL) */}
      {isCommitmentModalOpen &&
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
              zIndex: 9999,
              boxSizing: 'border-box'
            }}
          >
            <div
              className="geo-recovery-modal-content"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                width: '100%',
                maxWidth: '680px',
                maxHeight: 'min(90vh, 760px)',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                padding: '1.5rem',
                gap: '1.25rem',
                textAlign: 'left'
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <DollarSign size={18} style={{ color: 'var(--color-accent-600)' }} />
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
                    Record Financial Commitment / Milestone Invoice
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCommitmentModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCommitmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                    Associated Engineering Project *
                  </label>
                  <select
                    value={newProjectCode}
                    onChange={(e) => setNewProjectCode(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
                  >
                    {MOCK_PROJECT_OPTIONS_FOR_COMMITMENT.map((opt) => (
                      <option key={opt.code} value={opt.code}>
                        {opt.code} — {opt.title} ({opt.client})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                    Milestone Billing Deliverable / Tranche Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Milestone 3: Stratigraphy CAD Alignment & Lab Reports Sign-off"
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="geo-recovery-modal-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', textAlign: 'left' }}>
                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                      Billed / Commitment Amount (INR) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹15,00,000"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                      Expected Payment Recovery Due Date *
                    </label>
                    <input
                      type="text"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                    Responsible Engineering Officer / Account Lead *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. V. Raman"
                    value={newResponsiblePerson}
                    onChange={(e) => setNewResponsiblePerson(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Form Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '0.5rem', textAlign: 'left' }}>
                  <button
                    type="button"
                    onClick={() => setIsCommitmentModalOpen(false)}
                    style={{ padding: '0.45rem 1rem', borderRadius: '6px', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '0.45rem 1.15rem', borderRadius: '6px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: 650, cursor: 'pointer' }}
                  >
                    Record Commitment
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
