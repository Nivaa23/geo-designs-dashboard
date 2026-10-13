import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  MOCK_EXPENSE_RECORDS,
  MOCK_EXPENSE_CATEGORIES,
  MOCK_EXPENSE_PROJECT_OPTIONS
} from '../../data/mockExpenseData';
import type {
  ExpenseRecord,
  ExpenseCategory,
  ExpenseStatus
} from '../../types/expenses';
import {
  CreditCard,
  Search,
  Plus,
  FileText,
  DollarSign,
  X,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Check,
  Paperclip,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

interface AccountExpensesViewProps {
  onReturnToOverview?: () => void;
}

export const AccountExpensesView: React.FC<AccountExpensesViewProps> = ({ onReturnToOverview }) => {
  // Main expenses list state
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(MOCK_EXPENSE_RECORDS);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<string>('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'status'>('date-desc');

  // Active Detail Modal item state
  const [activeExpense, setActiveExpense] = useState<ExpenseRecord | null>(null);

  // Log Expense Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProjectCode, setNewProjectCode] = useState('GEO-PRJ-2026-089');
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('Operational Site Expenses');
  const [newAmount, setNewAmount] = useState('₹1,25,000');
  const [newDate, setNewDate] = useState('13 Oct 2026');
  const [newEmployeeName, setNewEmployeeName] = useState('Er. A. Sharma');
  const [newEmployeeRole, setNewEmployeeRole] = useState('Senior Field Site Engineer');
  const [newDepartment, setNewDepartment] = useState('Field Operations');
  const [newDescription, setNewDescription] = useState('');
  const [newVoucherRef, setNewVoucherRef] = useState('VCH-OPS-2026-9045.pdf');

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorState, setShowErrorState] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Scroll locking when modal is active
  useEffect(() => {
    if (activeExpense || isAddModalOpen) {
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
  }, [activeExpense, isAddModalOpen]);

  // Filtered & Sorted Expenses computation
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          item.id.toLowerCase().includes(query) ||
          item.projectCode.toLowerCase().includes(query) ||
          item.projectName.toLowerCase().includes(query) ||
          item.client.toLowerCase().includes(query) ||
          item.employeeName.toLowerCase().includes(query) ||
          item.department.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.supportingDocument.toLowerCase().includes(query);

        const matchesCategory =
          selectedCategory === 'ALL' || item.category === selectedCategory;

        const matchesStatus =
          selectedStatus === 'ALL' || item.status === selectedStatus;

        const matchesProject =
          selectedProject === 'ALL' || item.projectCode === selectedProject;

        let matchesPeriod = true;
        if (selectedPeriod === 'OCT') {
          matchesPeriod = item.date.includes('Oct 2026');
        } else if (selectedPeriod === 'SEP') {
          matchesPeriod = item.date.includes('Sep 2026');
        }

        return (
          matchesSearch &&
          matchesCategory &&
          matchesStatus &&
          matchesProject &&
          matchesPeriod
        );
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return b.rawDate.localeCompare(a.rawDate);
        if (sortBy === 'date-asc') return a.rawDate.localeCompare(b.rawDate);
        if (sortBy === 'amount-desc') return b.numericalAmount - a.numericalAmount;
        if (sortBy === 'amount-asc') return a.numericalAmount - b.numericalAmount;
        if (sortBy === 'status') return a.status.localeCompare(b.status);
        return 0;
      });
  }, [expenses, searchQuery, selectedCategory, selectedStatus, selectedProject, selectedPeriod, sortBy]);

  // Overall KPI Metrics
  const totalExpensesNumerical = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + curr.numericalAmount, 0);
  }, [expenses]);

  const approvedExpensesNumerical = useMemo(() => {
    return expenses
      .filter((e) => e.status === 'Approved')
      .reduce((acc, curr) => acc + curr.numericalAmount, 0);
  }, [expenses]);

  const pendingReviewNumerical = useMemo(() => {
    return expenses
      .filter((e) => e.status === 'Under Review' || e.status === 'Submitted')
      .reduce((acc, curr) => acc + curr.numericalAmount, 0);
  }, [expenses]);

  const approvedCount = useMemo(() => {
    return expenses.filter((e) => e.status === 'Approved').length;
  }, [expenses]);

  const pendingCount = useMemo(() => {
    return expenses.filter((e) => e.status === 'Under Review' || e.status === 'Submitted').length;
  }, [expenses]);

  // Formatter for Indian Rupees
  const formatInr = (val: number) => {
    return '₹' + val.toLocaleString('en-IN');
  };

  // Helper for status badge styling
  const getStatusBadgeStyle = (status: ExpenseStatus) => {
    switch (status) {
      case 'Approved':
        return {
          bg: '#ECFDF5',
          border: '#A7F3D0',
          color: '#047857',
          icon: CheckCircle2
        };
      case 'Under Review':
        return {
          bg: '#FFFBEB',
          border: '#FDE68A',
          color: '#B45309',
          icon: Clock
        };
      case 'Submitted':
        return {
          bg: '#EFF6FF',
          border: '#BFDBFE',
          color: '#1D4ED8',
          icon: AlertCircle
        };
      case 'Rejected':
        return {
          bg: '#FEF2F2',
          border: '#FCA5A5',
          color: '#DC2626',
          icon: X
        };
    }
  };

  // Helper for category color
  const getCategoryColor = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'Operational Site Expenses':
        return { bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8' };
      case 'Laboratory Equipment & Testing':
        return { bg: '#ECFDF5', border: '#A7F3D0', text: '#047857' };
      case 'Field Disbursements':
        return { bg: '#F5F3FF', border: '#DDD6FE', text: 'var(--color-accent-600)' };
      case 'Travel & Site Logistics':
        return { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309' };
      case 'Survey Consumables & Spares':
        return { bg: '#FDF2F8', border: '#FBCFE8', text: '#BE185D' };
    }
  };

  // Handle Refresh simulation
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showSuccessNotification('Account expenses workspace refreshed with latest verified ledger records.');
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
    setSelectedProject('ALL');
    setSelectedPeriod('ALL');
    setSortBy('date-desc');
    setShowErrorState(false);
  };

  // Handle Log Expense Form submission
  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDescription.trim() || !newAmount.trim()) return;

    // Parse numerical value
    const numericStr = newAmount.replace(/[^0-9]/g, '');
    const numVal = parseInt(numericStr, 10) || 50000;

    const matchedProject = MOCK_EXPENSE_PROJECT_OPTIONS.find((p) => p.code === newProjectCode);
    const projectNameStr = matchedProject ? matchedProject.label.split(' — ')[1] || matchedProject.label : 'General Operations';

    const newRecord: ExpenseRecord = {
      id: `EXP-2026-${String(expenses.length + 1).padStart(3, '0')}`,
      projectCode: newProjectCode,
      projectName: projectNameStr,
      client: newProjectCode.startsWith('GEO-OPS') ? 'Geo Designs & Research Headquarters' : 'Authorized Infrastructure Authority',
      category: newCategory,
      amount: formatInr(numVal),
      numericalAmount: numVal,
      date: newDate,
      rawDate: '2026-10-13',
      employeeName: newEmployeeName.trim(),
      employeeRole: newEmployeeRole.trim(),
      department: newDepartment.trim(),
      description: newDescription.trim(),
      supportingDocument: newVoucherRef.trim() || 'VCH-OPS-2026-PENDING.pdf',
      documentSize: '1.8 MB',
      status: 'Submitted',
      paymentStatus: 'Pending Reimbursement',
      remarks: 'Newly submitted for departmental technical verification.',
      auditTrail: [
        {
          stage: 'Expense Incurred & Logged',
          timestamp: '13 Oct 2026, Just now',
          actor: newEmployeeName.trim(),
          status: 'completed',
          note: 'Submitted voucher for approval.'
        },
        {
          stage: 'Technical Verification',
          timestamp: 'Pending',
          actor: 'Technical Audit Desk',
          status: 'in-progress',
          note: 'Awaiting review.'
        },
        {
          stage: 'Accounts Clearance',
          timestamp: 'Pending',
          actor: 'Accounts Section',
          status: 'pending'
        }
      ]
    };

    setExpenses([newRecord, ...expenses]);
    setIsAddModalOpen(false);
    setNewDescription('');
    showSuccessNotification(`Expense voucher ${newRecord.id} logged successfully and forwarded for review.`);
  };

  // Handle Status Update in Detail Modal
  const handleUpdateStatus = (id: string, newStatus: ExpenseStatus) => {
    setExpenses((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated: ExpenseRecord = {
            ...item,
            status: newStatus,
            paymentStatus: newStatus === 'Approved' ? 'Disbursed' : item.paymentStatus,
            approvedBy: newStatus === 'Approved' ? 'Er. N. Patel (Operations Director)' : item.approvedBy,
            approvalDate: newStatus === 'Approved' ? '13 Oct 2026' : item.approvalDate
          };
          if (activeExpense && activeExpense.id === id) {
            setActiveExpense(updated);
          }
          return updated;
        }
        return item;
      })
    );
    showSuccessNotification(`Expense ${id} status updated to "${newStatus}".`);
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
        className="geo-expense-header"
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
        <div className="geo-expense-header-title-area" style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
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
              <CreditCard size={18} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 700, lineHeight: 1.2, margin: 0, textAlign: 'left' }}>
                Account Expenses
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px', lineHeight: 1.3, textAlign: 'left', maxWidth: '720px' }}>
                Operational site expenses, laboratory equipment testing, field disbursements, travel logistics, and survey consumable accounts tracking across active engineering projects.
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="geo-expense-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, whiteSpace: 'nowrap' }}>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
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
            Log New Expense
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

      {/* SECTION 2: EXPENSE SUMMARY / KPI CARDS GRID */}
      <div
        className="geo-expense-kpi-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.85rem',
          textAlign: 'left'
        }}
      >
        {/* KPI 1: Total Recorded Expenses */}
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
              TOTAL EXPENSES RECORDED
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
            {formatInr(totalExpensesNumerical)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
            <span>{expenses.length} Vouchers Logged</span>
            <span style={{ color: '#047857', fontWeight: 600 }}>Active Ledger</span>
          </div>
        </div>

        {/* KPI 2: Approved & Disbursed */}
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
              APPROVED & DISBURSED
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
            {formatInr(approvedExpensesNumerical)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
            <span>{approvedCount} Vouchers Cleared</span>
            <span style={{ color: '#047857', fontWeight: 600 }}>Settled via RTGS</span>
          </div>
        </div>

        {/* KPI 3: Pending Review / Verification */}
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
              PENDING VERIFICATION
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
            {formatInr(pendingReviewNumerical)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
            <span>{pendingCount} Under Technical Audit</span>
            <span style={{ color: '#B45309', fontWeight: 600 }}>Awaiting Clearance</span>
          </div>
        </div>

        {/* KPI 4: Lab & Site Allocation */}
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
              OPERATIONS & LAB SHARE
            </span>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#F5F3FF',
                color: 'var(--color-accent-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TrendingUp size={15} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 750, color: '#0F172A', lineHeight: 1.1, textAlign: 'left' }}>
            72%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
            <span>Direct Field + Lab Testing</span>
            <span style={{ color: 'var(--color-accent-600)', fontWeight: 600 }}>Within Target</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: EXPENSE CATEGORY BREAKDOWN VISUALIZATION CARDS */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
          textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', textAlign: 'left' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0, textAlign: 'left' }}>
              Expense Categorization & Commitment Allocation
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0', textAlign: 'left' }}>
              Click any category card below to filter the expense ledger records instantly.
            </p>
          </div>
          {selectedCategory !== 'ALL' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-accent-600)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              Clear Category Filter
              <X size={13} />
            </button>
          )}
        </div>

        <div
          className="geo-expense-categories-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '0.65rem',
            textAlign: 'left'
          }}
        >
          {MOCK_EXPENSE_CATEGORIES.map((item) => {
            const isSelected = selectedCategory === item.category;
            return (
              <div
                key={item.category}
                onClick={() => setSelectedCategory(isSelected ? 'ALL' : item.category)}
                style={{
                  backgroundColor: isSelected ? '#F0F9FF' : '#F8FAFC',
                  border: isSelected ? '1.5px solid var(--color-accent-500)' : '1px solid #E2E8F0',
                  borderRadius: '6px',
                  padding: '0.75rem 0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: isSelected ? 'var(--color-accent-600)' : '#0F172A',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.category.split(' ')[0]} {item.category.split(' ')[1] || ''}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      backgroundColor: '#E2E8F0',
                      color: '#475569',
                      fontWeight: 600
                    }}
                  >
                    {item.count}
                  </span>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', textAlign: 'left' }}>
                  {item.totalAmount}
                </div>

                {/* Progress track */}
                <div style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '2px', overflow: 'hidden', marginTop: '2px' }}>
                  <div
                    style={{
                      width: `${item.percentage * 2}%`,
                      maxWidth: '100%',
                      height: '100%',
                      backgroundColor: item.color,
                      borderRadius: '2px'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: SEARCH, FILTERS & SORT TOOLBAR */}
      <div
        className="geo-expense-toolbar"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '0.85rem 1.15rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.85rem',
          flexWrap: 'wrap',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
          textAlign: 'left'
        }}
      >
        {/* Search Input Box */}
        <div
          className="geo-expense-search-wrapper"
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
            placeholder="Search by ID, Project, Submitter, Description..."
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

        {/* Filters Group */}
        <div
          className="geo-expense-filter-group"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}
        >
          {/* Project Dropdown */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="geo-expense-filter-select"
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              fontSize: '12px',
              color: '#0F172A',
              fontWeight: 500,
              outline: 'none',
              cursor: 'pointer',
              maxWidth: '220px'
            }}
          >
            {MOCK_EXPENSE_PROJECT_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="geo-expense-filter-select"
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
            <option value="Operational Site Expenses">Operational Site Expenses</option>
            <option value="Laboratory Equipment & Testing">Laboratory Equipment & Testing</option>
            <option value="Field Disbursements">Field Disbursements</option>
            <option value="Travel & Site Logistics">Travel & Site Logistics</option>
            <option value="Survey Consumables & Spares">Survey Consumables & Spares</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="geo-expense-filter-select"
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
            <option value="Approved">Approved</option>
            <option value="Under Review">Under Review</option>
            <option value="Submitted">Submitted</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Period Dropdown */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="geo-expense-filter-select"
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
            <option value="ALL">All Dates</option>
            <option value="OCT">October 2026</option>
            <option value="SEP">September 2026</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="geo-expense-filter-select"
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
            <option value="amount-desc">Sort: Amount (High to Low)</option>
            <option value="amount-asc">Sort: Amount (Low to High)</option>
            <option value="status">Sort: Status</option>
          </select>

          {/* Reset Filters button if any filter is active */}
          {(searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || selectedProject !== 'ALL' || selectedPeriod !== 'ALL' || sortBy !== 'date-desc') && (
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
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* SECTION 5: EXPENSE RECORDS LISTING TABLE & MOBILE REFLOW */}
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '14px', fontWeight: 650, color: '#0F172A', textAlign: 'left' }}>
              Expense Vouchers & Operational Ledger
            </span>
            <span style={{ fontSize: '12px', color: '#64748B', marginLeft: '8px', fontWeight: 500 }}>
              Showing {filteredExpenses.length} of {expenses.length} entries
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {selectedCategory !== 'ALL' && (
              <span
                style={{
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  backgroundColor: '#F0F9FF',
                  border: '1px solid #BAE6FD',
                  color: 'var(--color-accent-600)',
                  fontWeight: 600
                }}
              >
                Category: {selectedCategory}
              </span>
            )}
            {selectedStatus !== 'ALL' && (
              <span
                style={{
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  color: '#0F172A',
                  fontWeight: 600
                }}
              >
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
                Unable to load account expense records
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#7F1D1D', margin: 0, textAlign: 'left' }}>
              A network or data connection error occurred while querying the financial expense ledger. Please verify connection credentials or retry.
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
              Loading Account Expenses Ledger...
            </div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              Fetching latest verified operational vouchers, testing disbursements, and logistics receipts.
            </div>
          </div>
        ) : filteredExpenses.length === 0 ? (
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
              No Expense Records Found
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0, textAlign: 'left', maxWidth: '600px' }}>
              No expense records match your current search query "{searchQuery}" or selected filter criteria. Try clearing search keywords or resetting project and category filters.
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
          /* CONDITION: ACTIVE DATA TABLE & MOBILE REFLOW CARDS */
          <>
            {/* Desktop Table View */}
            <div style={{ overflowX: 'auto', width: '100%' }} className="geo-expense-desktop-table">
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
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Voucher ID & Date</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Associated Project</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Expense Category</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Incurred By</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Description & Voucher</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Amount</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((item) => {
                    const statusStyle = getStatusBadgeStyle(item.status);
                    const categoryStyle = getCategoryColor(item.category);
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
                        {/* Voucher ID & Date */}
                        <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '12px', textAlign: 'left' }}>
                            {item.id}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', textAlign: 'left' }}>
                            {item.date}
                          </div>
                        </td>

                        {/* Associated Project */}
                        <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top', maxWidth: '240px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: 'var(--color-accent-600)',
                              backgroundColor: 'rgba(2, 132, 199, 0.08)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: '1px solid rgba(2, 132, 199, 0.2)',
                              display: 'inline-block',
                              marginBottom: '3px'
                            }}
                          >
                            {item.projectCode}
                          </span>
                          <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '12px', lineHeight: 1.3, textAlign: 'left' }}>
                            {item.projectName}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', textAlign: 'left' }}>
                            {item.client}
                          </div>
                        </td>

                        {/* Expense Category */}
                        <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '2px 7px',
                              borderRadius: '4px',
                              backgroundColor: categoryStyle.bg,
                              border: `1px solid ${categoryStyle.border}`,
                              color: categoryStyle.text,
                              display: 'inline-block',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {item.category}
                          </span>
                        </td>

                        {/* Incurred By */}
                        <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 650, color: '#0F172A', fontSize: '12px', textAlign: 'left' }}>
                            {item.employeeName}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', textAlign: 'left' }}>
                            {item.department}
                          </div>
                        </td>

                        {/* Description & Voucher */}
                        <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top', maxWidth: '260px' }}>
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#334155',
                              lineHeight: 1.35,
                              textAlign: 'left',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {item.description}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px', fontSize: '11px', color: '#0284C7' }}>
                            <Paperclip size={12} />
                            <span>{item.supportingDocument}</span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td style={{ padding: '0.75rem 0.85rem', textAlign: 'left', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 750, color: '#0F172A', fontSize: '13px', textAlign: 'left' }}>
                            {item.amount}
                          </div>
                          <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>
                            {item.paymentStatus}
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
                            onClick={() => setActiveExpense(item)}
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
                            View Details
                            <ChevronRight size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Reflow (Viewed on smaller screens) */}
            <div className="geo-expense-mobile-cards" style={{ display: 'none', flexDirection: 'column', gap: '0.85rem' }}>
              {filteredExpenses.map((item) => {
                const statusStyle = getStatusBadgeStyle(item.status);
                const categoryStyle = getCategoryColor(item.category);
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
                    {/* Row 1: ID, Date & Status */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '13px' }}>{item.id}</span>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>{item.date}</span>
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

                    {/* Row 2: Project & Amount */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            color: 'var(--color-accent-600)',
                            backgroundColor: 'rgba(2, 132, 199, 0.08)',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            border: '1px solid rgba(2, 132, 199, 0.2)',
                            display: 'inline-block',
                            marginBottom: '3px'
                          }}
                        >
                          {item.projectCode}
                        </span>
                        <div style={{ fontSize: '13px', fontWeight: 650, color: '#0F172A', lineHeight: 1.3 }}>
                          {item.projectName}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: 750, color: '#0F172A' }}>{item.amount}</div>
                        <div style={{ fontSize: '10px', color: '#64748B' }}>{item.paymentStatus}</div>
                      </div>
                    </div>

                    {/* Row 3: Category & Submitter */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: categoryStyle.bg,
                          border: `1px solid ${categoryStyle.border}`,
                          color: categoryStyle.text
                        }}
                      >
                        {item.category}
                      </span>
                      <span style={{ fontSize: '11px', color: '#475569' }}>
                        Incurred by: <strong>{item.employeeName}</strong>
                      </span>
                    </div>

                    {/* Row 4: Description preview */}
                    <p style={{ fontSize: '12px', color: '#334155', margin: 0, lineHeight: 1.35, textAlign: 'left' }}>
                      {item.description}
                    </p>

                    {/* Row 5: Action Button */}
                    <button
                      type="button"
                      onClick={() => setActiveExpense(item)}
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
                      View Expense Details
                      <ChevronRight size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* MODAL 1: VIEW EXPENSE DETAILS (VIEWPORT PORTAL) */}
      {activeExpense &&
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
              className="geo-expense-modal-content"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                width: '100%',
                maxWidth: '780px',
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
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
                      {activeExpense.id}
                    </span>
                    {(() => {
                      const stStyle = getStatusBadgeStyle(activeExpense.status);
                      const Icon = stStyle.icon;
                      return (
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: stStyle.bg,
                            border: `1px solid ${stStyle.border}`,
                            color: stStyle.color,
                            fontSize: '11px',
                            fontWeight: 650,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Icon size={12} />
                          {activeExpense.status}
                        </span>
                      );
                    })()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    Incurred on {activeExpense.date} • Reference ID: {activeExpense.supportingDocument}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveExpense(null)}
                  style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Amount & Status Highlights Box */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem',
                  backgroundColor: '#F8FAFC',
                  padding: '0.85rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0',
                  textAlign: 'left'
                }}
                className="geo-expense-modal-grid-3"
              >
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                    EXPENSE AMOUNT
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                    {activeExpense.amount}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                    PAYMENT DISBURSEMENT
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0284C7', marginTop: '4px' }}>
                    {activeExpense.paymentStatus}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                    EXPENSE CATEGORY
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
                    {activeExpense.category}
                  </div>
                </div>
              </div>

              {/* Project & Client Information */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                  Associated Engineering Assignment
                </div>
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.75rem 0.85rem', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent-600)', backgroundColor: 'rgba(2, 132, 199, 0.08)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(2, 132, 199, 0.2)' }}>
                      {activeExpense.projectCode}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                      {activeExpense.projectName}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                    Client: <strong>{activeExpense.client}</strong>
                  </div>
                </div>
              </div>

              {/* Incurred By & Department */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                  Submitting Employee & Technical Unit
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }} className="geo-expense-modal-grid-2">
                  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>Incurred By</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{activeExpense.employeeName}</div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '1px' }}>{activeExpense.employeeRole}</div>
                  </div>
                  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>Allocated Department</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{activeExpense.department}</div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '1px' }}>Site Operations & Field Testing</div>
                  </div>
                </div>
              </div>

              {/* Description & Technical Justification */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                  Technical Expenditure Description & Purpose
                </div>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.85rem', fontSize: '13px', color: '#1E293B', lineHeight: 1.45 }}>
                  {activeExpense.description}
                </div>
                {activeExpense.remarks && (
                  <div style={{ fontSize: '12px', color: activeExpense.status === 'Rejected' ? '#DC2626' : '#64748B', fontStyle: 'italic', marginTop: '2px' }}>
                    Note: {activeExpense.remarks}
                  </div>
                )}
              </div>

              {/* Supporting Document Voucher Box */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                  Supporting Document & Physical Receipt
                </div>
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={18} style={{ color: 'var(--color-accent-600)' }} />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>{activeExpense.supportingDocument}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>Verified PDF Receipt • {activeExpense.documentSize || '2.1 MB'}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => showSuccessNotification(`Voucher ${activeExpense.supportingDocument} downloaded for audit review.`)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '4px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      color: '#0F172A',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    View Voucher
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>

              {/* Audit Trail Progression */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                  Approval Workflow & Audit History
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {activeExpense.auditTrail.map((step, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '6px',
                        padding: '0.65rem 0.85rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.65rem',
                        textAlign: 'left'
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: step.status === 'completed' ? '#ECFDF5' : step.status === 'in-progress' ? '#FFFBEB' : '#F1F5F9',
                          color: step.status === 'completed' ? '#047857' : step.status === 'in-progress' ? '#B45309' : '#94A3B8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '2px',
                          flexShrink: 0
                        }}
                      >
                        {step.status === 'completed' ? <Check size={12} /> : <Clock size={12} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>{step.stage}</span>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>{step.timestamp}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#475569', marginTop: '1px' }}>
                          Actor: <strong>{step.actor}</strong>
                        </div>
                        {step.note && (
                          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', fontStyle: 'italic' }}>
                            {step.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Action Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #E2E8F0',
                  paddingTop: '1rem',
                  marginTop: '0.5rem',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Workflow Actions:</span>
                  {activeExpense.status !== 'Approved' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(activeExpense.id, 'Approved')}
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '6px',
                        backgroundColor: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        color: '#047857',
                        fontSize: '11px',
                        fontWeight: 650,
                        cursor: 'pointer'
                      }}
                    >
                      Approve Voucher
                    </button>
                  )}
                  {activeExpense.status !== 'Under Review' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(activeExpense.id, 'Under Review')}
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '6px',
                        backgroundColor: '#FFFBEB',
                        border: '1px solid #FDE68A',
                        color: '#B45309',
                        fontSize: '11px',
                        fontWeight: 650,
                        cursor: 'pointer'
                      }}
                    >
                      Hold for Review
                    </button>
                  )}
                  {activeExpense.status !== 'Rejected' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(activeExpense.id, 'Rejected')}
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '6px',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        color: '#DC2626',
                        fontSize: '11px',
                        fontWeight: 650,
                        cursor: 'pointer'
                      }}
                    >
                      Reject Voucher
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveExpense(null)}
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
                  Close View
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* MODAL 2: LOG NEW EXPENSE (VIEWPORT PORTAL) */}
      {isAddModalOpen &&
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
              className="geo-expense-modal-content"
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
                  <CreditCard size={18} style={{ color: 'var(--color-accent-600)' }} />
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
                    Log Operational Expense
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Expense Logging Form */}
              <form onSubmit={handleAddExpenseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                {/* Associated Project */}
                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                    Associated Engineering Project / Cost Center *
                  </label>
                  <select
                    value={newProjectCode}
                    onChange={(e) => setNewProjectCode(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
                  >
                    {MOCK_EXPENSE_PROJECT_OPTIONS.filter((p) => p.code !== 'ALL').map((opt) => (
                      <option key={opt.code} value={opt.code}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category & Amount */}
                <div className="geo-expense-modal-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', textAlign: 'left' }}>
                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                      Expense Category *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
                    >
                      <option value="Operational Site Expenses">Operational Site Expenses</option>
                      <option value="Laboratory Equipment & Testing">Laboratory Equipment & Testing</option>
                      <option value="Field Disbursements">Field Disbursements</option>
                      <option value="Travel & Site Logistics">Travel & Site Logistics</option>
                      <option value="Survey Consumables & Spares">Survey Consumables & Spares</option>
                    </select>
                  </div>

                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                      Expenditure Amount (INR) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹1,25,000"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Date & Submitting Employee */}
                <div className="geo-expense-modal-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', textAlign: 'left' }}>
                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                      Incurred Date *
                    </label>
                    <input
                      type="text"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                      Incurred By / Submitter Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Er. A. Sharma"
                      value={newEmployeeName}
                      onChange={(e) => setNewEmployeeName(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Role & Department */}
                <div className="geo-expense-modal-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', textAlign: 'left' }}>
                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                      Submitter Role
                    </label>
                    <input
                      type="text"
                      value={newEmployeeRole}
                      onChange={(e) => setNewEmployeeRole(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ textAlign: 'left' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                      Department
                    </label>
                    <input
                      type="text"
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Voucher File Reference */}
                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                    Supporting Document / Voucher Reference File *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VCH-OPS-2026-9045.pdf"
                    value={newVoucherRef}
                    onChange={(e) => setNewVoucherRef(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Description & Justification */}
                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                    Technical Description & Operational Justification *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide detailed breakdown of the site expenditure, testing consumable, or field disbursement..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>

                {/* Form Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '0.5rem', textAlign: 'left' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    style={{ padding: '0.45rem 1rem', borderRadius: '6px', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '0.45rem 1.15rem', borderRadius: '6px', backgroundColor: '#0F172A', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: 650, cursor: 'pointer' }}
                  >
                    Submit Expense Record
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
