import React, { useState, useMemo } from 'react';
import { MOCK_TODO_ITEMS, INITIAL_CHAT_MESSAGES } from '../../data/mockToDoData';
import type { ToDoItem, ToDoCategory, ToDoStatus, ToDoPriority, ChatMessage } from '../../types/todo';
import {
  CheckSquare,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  X,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Send,
  User,
  Building2,
  Edit3,
  Layers
} from 'lucide-react';

interface ToDoListViewProps {
  onReturnToOverview?: () => void;
}

export const ToDoListView: React.FC<ToDoListViewProps> = () => {
  // Main items list state
  const [tasks, setTasks] = useState<ToDoItem[]>(MOCK_TODO_ITEMS);

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'time-asc' | 'time-desc' | 'priority' | 'status'>('time-asc');

  // Active Detail Modal item state
  const [activeDetailItem, setActiveDetailItem] = useState<ToDoItem | null>(null);

  // Create Task Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<ToDoCategory>('Daily Activities');
  const [newTaskPriority, setNewTaskPriority] = useState<ToDoPriority>('Normal');
  const [newTaskTimeline, setNewTaskTimeline] = useState('15:00 Today');
  const [newTaskProject, setNewTaskProject] = useState('GEO-PRJ-2026-089');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('Dr. V. Raman');
  const [newTaskDepartment, setNewTaskDepartment] = useState('Geotechnical Research Lab');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  // UI Chat Panel state
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [newChatMessageText, setNewChatMessageText] = useState('');
  const [selectedChatTaskFilter, setSelectedChatTaskFilter] = useState<string>('ALL');

  // Simulated UI states
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorState, setShowErrorState] = useState(false);
  const [successBannerMessage, setSuccessBannerMessage] = useState<string | null>(null);

  // Filtered & Sorted Tasks calculation
  const filteredTasks = useMemo(() => {
    return tasks.filter((item) => {
      // Search matching
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.code.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.projectContext && item.projectContext.toLowerCase().includes(query)) ||
        item.assignedTo.toLowerCase().includes(query);

      // Category filter matching
      const matchesCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;

      // Status filter matching
      const matchesStatus =
        selectedStatus === 'ALL' || item.status === selectedStatus;

      // Priority filter matching
      const matchesPriority =
        selectedPriority === 'ALL' || item.priority === selectedPriority;

      return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
    }).sort((a, b) => {
      if (sortBy === 'time-asc') return a.timestamp - b.timestamp;
      if (sortBy === 'time-desc') return b.timestamp - a.timestamp;
      if (sortBy === 'priority') {
        const priorityOrder = { Critical: 3, High: 2, Normal: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'status') {
        const statusOrder = { Pending: 1, 'In Progress': 2, 'In Review': 3, Completed: 4 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return 0;
    });
  }, [tasks, searchQuery, selectedCategory, selectedStatus, selectedPriority, sortBy]);

  // Handle Refresh simulation
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showSuccessNotification('Workspace refreshed with latest daily tasks.');
    }, 350);
  };

  // Helper for success notifications
  const showSuccessNotification = (msg: string) => {
    setSuccessBannerMessage(msg);
    setTimeout(() => {
      setSuccessBannerMessage(null);
    }, 3500);
  };

  // Reset filters helper
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSelectedPriority('ALL');
    setSortBy('time-asc');
    setShowErrorState(false);
  };

  // Update Task Status helper
  const handleUpdateTaskStatus = (taskId: string, newStatus: ToDoStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    if (activeDetailItem && activeDetailItem.id === taskId) {
      setActiveDetailItem((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showSuccessNotification(`Task status updated to ${newStatus}.`);
  };

  // Create Task Form Handler
  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newCodeNumber = Math.floor(100 + Math.random() * 900);
    const createdItem: ToDoItem = {
      id: `todo-${Date.now()}`,
      code: `ACT-2026-${newCodeNumber}`,
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || 'New daily activity logged via workspace.',
      category: newTaskCategory,
      priority: newTaskPriority,
      status: 'Pending',
      assignedTo: newTaskAssignedTo,
      department: newTaskDepartment,
      projectContext: newTaskProject,
      targetTime: newTaskTimeline,
      date: '25 Sep 2026',
      timestamp: Date.now(),
      timelineAllocation: `${newTaskTimeline} (Allocated)`,
      commentsCount: 0
    };

    setTasks((prev) => [createdItem, ...prev]);
    setIsCreateModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
    showSuccessNotification(`New task ${createdItem.code} created successfully.`);
  };

  // Send Chat Message Handler
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessageText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      taskId: activeDetailItem ? activeDetailItem.id : undefined,
      taskCode: activeDetailItem ? activeDetailItem.code : 'ACT-2026-041',
      senderName: 'Dr. V. Raman',
      senderRole: 'Principal Director & Chief Consultant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messageText: newChatMessageText.trim(),
      isCurrentUser: true,
      priorityTag: 'Normal'
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setNewChatMessageText('');
    showSuccessNotification('Message posted to communication timeline.');
  };

  // Category Icon helper
  const getCategoryIcon = (category: ToDoCategory) => {
    switch (category) {
      case 'Daily Activities':
        return <CheckSquare size={13} style={{ color: 'var(--color-accent-600)' }} />;
      case 'Minor Corrections':
        return <Edit3 size={13} style={{ color: '#D97706' }} />;
      case 'Project Requirement Updates':
        return <Layers size={13} style={{ color: '#0284C7' }} />;
      case 'Important Communications':
        return <MessageSquare size={13} style={{ color: '#7C3AED' }} />;
      case 'Critical Timeline Allocation':
        return <Clock size={13} style={{ color: '#DC2626' }} />;
    }
  };

  // Priority Badge Styling helper
  const getPriorityBadgeStyle = (priority: ToDoPriority) => {
    switch (priority) {
      case 'Critical':
        return { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5', color: '#DC2626' };
      case 'High':
        return { backgroundColor: '#FFFBEB', borderColor: '#FDE68A', color: '#B45309' };
      case 'Normal':
        return { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', color: '#475569' };
    }
  };

  // Status Badge Styling helper
  const getStatusBadgeStyle = (status: ToDoStatus) => {
    switch (status) {
      case 'Pending':
        return { backgroundColor: '#FFFBEB', borderColor: '#FDE68A', color: '#B45309' };
      case 'In Progress':
        return { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', color: '#1D4ED8' };
      case 'In Review':
        return { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE', color: '#6D28D9' };
      case 'Completed':
        return { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0', color: '#047857' };
    }
  };

  // Filtered Chat Messages
  const visibleChatMessages = useMemo(() => {
    if (selectedChatTaskFilter === 'ALL') return chatMessages;
    return chatMessages.filter((m) => m.taskCode === selectedChatTaskFilter);
  }, [chatMessages, selectedChatTaskFilter]);

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
      {successBannerMessage && (
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
            <span>{successBannerMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessBannerMessage(null)}
            style={{ background: 'none', border: 'none', color: '#047857', cursor: 'pointer' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* SECTION 1: HEADER & PAGE TITLE BAR */}
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
              <CheckSquare size={18} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 700, lineHeight: 1.2, margin: 0, textAlign: 'left' }}>
                To-Do List
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px', lineHeight: 1.3, textAlign: 'left', maxWidth: '620px' }}>
                Employee workspace for daily activities, minor corrections, project requirement updates, important communications, and critical timeline allocations.
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Controls — 1 Single Row on Desktop/Tablet */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'nowrap',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
          className="geo-todo-header-actions"
        >
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
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <Plus size={14} />
            New Activity / Task
          </button>

          <button
            type="button"
            onClick={() => setIsChatPanelOpen((prev) => !prev)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '6px',
              backgroundColor: isChatPanelOpen ? '#F5F3FF' : '#F8FAFC',
              border: isChatPanelOpen ? '1px solid #DDD6FE' : '1px solid #E2E8F0',
              color: isChatPanelOpen ? 'var(--color-accent-600)' : '#0F172A',
              fontSize: '12px',
              fontWeight: 650,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <MessageSquare size={14} />
            {isChatPanelOpen ? 'Close Chat Panel' : 'Communication Chat'}
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
              whiteSpace: 'nowrap',
              flexShrink: 0
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
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {showErrorState ? 'Clear Error' : 'Simulate Error'}
          </button>
        </div>
      </div>

      {/* SECTION 2: 5 CONFIRMED CATEGORIES QUICK FILTER CARDS */}
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
            { label: 'Daily Activities', category: 'Daily Activities' as ToDoCategory },
            { label: 'Minor Corrections', category: 'Minor Corrections' as ToDoCategory },
            { label: 'Project Updates', category: 'Project Requirement Updates' as ToDoCategory },
            { label: 'Important Comms', category: 'Important Communications' as ToDoCategory },
            { label: 'Critical Timelines', category: 'Critical Timeline Allocation' as ToDoCategory }
          ]
        ).map((item) => {
          const count = tasks.filter((t) => t.category === item.category).length;
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

      {/* MAIN TWO-COLUMN WORKSPACE: LEFT = TASKS WORKSPACE, RIGHT = OPTIONAL CHAT PANEL */}
      <div style={{ display: 'flex', gap: '1.25rem', width: '100%', boxSizing: 'border-box' }}>
        {/* LEFT COLUMN: CONTROLS & TASK LIST TABLE */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
          {/* SEARCH, FILTER, AND SORT CONTROLS TOOLBAR */}
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
            <div style={{ position: 'relative', flex: '1 1 260px', minWidth: '220px' }}>
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
                placeholder="Search task title, code, project, assigned staff..."
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

            {/* Filters & Sorting Dropdowns */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              {/* Category Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Filter size={13} style={{ color: '#64748B' }} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    padding: '0.45rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    fontSize: '12px',
                    color: '#0F172A',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="ALL">All Categories</option>
                  <option value="Daily Activities">Daily Activities</option>
                  <option value="Minor Corrections">Minor Corrections</option>
                  <option value="Project Requirement Updates">Project Requirement Updates</option>
                  <option value="Important Communications">Important Communications</option>
                  <option value="Critical Timeline Allocation">Critical Timeline Allocation</option>
                </select>
              </div>

              {/* Status Filter */}
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
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Completed">Completed</option>
              </select>

              {/* Priority Filter */}
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '12px',
                  color: '#0F172A',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">All Priorities</option>
                <option value="Critical">Critical Priority</option>
                <option value="High">High Priority</option>
                <option value="Normal">Normal Priority</option>
              </select>

              {/* Sort Dropdown */}
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
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="time-asc">Sort: Target Time (Earliest)</option>
                  <option value="time-desc">Sort: Target Time (Latest)</option>
                  <option value="priority">Sort: Priority Urgency</option>
                  <option value="status">Sort: Task Status</option>
                </select>
              </div>

              {/* Reset Filters button */}
              {(searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || selectedPriority !== 'ALL' || sortBy !== 'time-asc') && (
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

          {/* MAIN TASK CARDS & TABLE LISTING CONTAINER */}
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
            {/* List Header Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '14px', fontWeight: 650, color: '#0F172A', textAlign: 'left' }}>
                  Daily Activity & Task Items
                </span>
                <span style={{ fontSize: '12px', color: '#64748B', marginLeft: '8px', fontWeight: 500 }}>
                  Showing {filteredTasks.length} of {tasks.length} entries
                </span>
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
                    Unable to load daily task records
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#7F1D1D', margin: 0, textAlign: 'left' }}>
                  A connection error occurred while synchronizing your daily activities list. Please check network connectivity or retry.
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
                  Loading Daily Activity Tasks...
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  Fetching latest task updates, corrections, and timeline allocations.
                </div>
              </div>
            ) : filteredTasks.length === 0 ? (
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
                <CheckSquare size={24} style={{ color: '#94A3B8' }} />
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                  No Activity Tasks Found
                </div>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0, textAlign: 'left', maxWidth: '600px' }}>
                  No tasks match your current search query "{searchQuery}" or selected category filter. Try clearing filters or creating a new task item.
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
              /* POPULATED TASK CARDS LIST */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                {filteredTasks.map((item) => {
                  const priorityStyle = getPriorityBadgeStyle(item.priority);
                  const statusStyle = getStatusBadgeStyle(item.status);

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
                        gap: '0.65rem',
                        textAlign: 'left',
                        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.02)',
                        transition: 'all var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent-500)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
                    >
                      {/* Row 1: Code, Category, Priority, Timeline & Status */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent-600)', backgroundColor: '#F5F3FF', padding: '2px 7px', borderRadius: '4px', border: '1px solid #DDD6FE' }}>
                            {item.code}
                          </span>

                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: '#475569',
                              backgroundColor: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {getCategoryIcon(item.category)}
                            {item.category}
                          </span>

                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 650,
                              padding: '2px 7px',
                              borderRadius: '4px',
                              border: `1px solid ${priorityStyle.borderColor}`,
                              backgroundColor: priorityStyle.backgroundColor,
                              color: priorityStyle.color
                            }}
                          >
                            {item.priority} Priority
                          </span>
                        </div>

                        {/* Status Switcher Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left' }}>
                          <span style={{ fontSize: '11px', color: '#64748B', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} />
                            {item.targetTime}
                          </span>

                          <select
                            value={item.status}
                            onChange={(e) => handleUpdateTaskStatus(item.id, e.target.value as ToDoStatus)}
                            style={{
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: 650,
                              border: `1px solid ${statusStyle.borderColor}`,
                              backgroundColor: statusStyle.backgroundColor,
                              color: statusStyle.color,
                              cursor: 'pointer',
                              outline: 'none'
                            }}
                          >
                            <option value="Pending">Status: Pending</option>
                            <option value="In Progress">Status: In Progress</option>
                            <option value="In Review">Status: In Review</option>
                            <option value="Completed">Status: Completed</option>
                          </select>
                        </div>
                      </div>

                      {/* Row 2: Title & Description */}
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

                      {/* Row 3: Special Category Note if present */}
                      {item.correctionDetails && (
                        <div style={{ fontSize: '11px', color: '#92400E', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '4px', padding: '0.4rem 0.65rem', textAlign: 'left' }}>
                          <strong>Correction Note:</strong> {item.correctionDetails}
                        </div>
                      )}
                      {item.requirementUpdateNote && (
                        <div style={{ fontSize: '11px', color: '#0369A1', backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '4px', padding: '0.4rem 0.65rem', textAlign: 'left' }}>
                          <strong>Requirement Update:</strong> {item.requirementUpdateNote}
                        </div>
                      )}

                      {/* Row 4: Footer Context (Project, Assigned To, Timeline, Actions) */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '0.5rem', marginTop: '0.2rem', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '11px', color: '#64748B', flexWrap: 'wrap', textAlign: 'left' }}>
                          {item.projectContext && (
                            <span style={{ fontWeight: 600, color: '#334155', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Building2 size={12} />
                              {item.projectContext}
                            </span>
                          )}
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <User size={12} />
                            Assigned: {item.assignedTo} ({item.department})
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedChatTaskFilter(item.code);
                              setIsChatPanelOpen(true);
                            }}
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              backgroundColor: '#F8FAFC',
                              border: '1px solid #CBD5E1',
                              color: '#0F172A',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <MessageSquare size={11} />
                            Discuss ({item.commentsCount})
                          </button>

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
                            Details
                            <ChevronRight size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: UI-LEVEL COMMUNICATION & CHAT PANEL (SIDE PANEL) */}
        {isChatPanelOpen && (
          <div
            style={{
              width: '360px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
              textAlign: 'left',
              maxHeight: 'calc(100vh - 140px)',
              boxSizing: 'border-box'
            }}
          >
            {/* Chat Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.65rem', textAlign: 'left' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', textAlign: 'left' }}>
                  Communication Timeline
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', textAlign: 'left' }}>
                  Important & critical timeline discussions
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChatPanelOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Task Filter Selector */}
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                Filter Discussions by Task Code:
              </label>
              <select
                value={selectedChatTaskFilter}
                onChange={(e) => setSelectedChatTaskFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.35rem 0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '11px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL" style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}>Show All Critical Communications</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.code} style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}>
                    {t.code} — {t.title.slice(0, 32)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Messages Stream Container */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                paddingRight: '4px'
              }}
            >
              {visibleChatMessages.length === 0 ? (
                <div style={{ fontSize: '12px', color: '#64748B', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '6px', textAlign: 'left' }}>
                  No communication logs for this task code yet. Start the conversation below.
                </div>
              ) : (
                visibleChatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      backgroundColor: msg.isCurrentUser ? '#F5F3FF' : '#F8FAFC',
                      border: msg.isCurrentUser ? '1px solid #DDD6FE' : '1px solid #E2E8F0',
                      borderRadius: '6px',
                      padding: '0.65rem 0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', textAlign: 'left' }}>
                        {msg.senderName}
                      </span>
                      <span style={{ fontSize: '10px', color: '#64748B' }}>
                        {msg.timestamp}
                      </span>
                    </div>

                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500, textAlign: 'left' }}>
                      {msg.senderRole} {msg.taskCode && `• ${msg.taskCode}`}
                    </div>

                    <p style={{ fontSize: '12px', color: '#334155', margin: '4px 0 0 0', lineHeight: 1.4, textAlign: 'left' }}>
                      {msg.messageText}
                    </p>

                    {msg.priorityTag && (
                      <span style={{ fontSize: '9px', fontWeight: 700, color: msg.priorityTag === 'Critical' ? '#DC2626' : 'var(--color-accent-600)', marginTop: '2px', textAlign: 'left' }}>
                        [{msg.priorityTag.toUpperCase()} ALLOCATION NOTE]
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '0.5rem', textAlign: 'left' }}>
              <input
                type="text"
                placeholder="Post communication note..."
                value={newChatMessageText}
                onChange={(e) => setNewChatMessageText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#F8FAFC',
                  color: '#0F172A',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-accent-600)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 650,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Send size={12} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* MODAL 1: TASK DETAIL MODAL */}
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
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '2px 8px', borderRadius: '12px' }}>
                    {activeDetailItem.category}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 650, padding: '2px 8px', borderRadius: '4px', border: `1px solid ${getPriorityBadgeStyle(activeDetailItem.priority).borderColor}`, backgroundColor: getPriorityBadgeStyle(activeDetailItem.priority).backgroundColor, color: getPriorityBadgeStyle(activeDetailItem.priority).color }}>
                    {activeDetailItem.priority} Priority
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

            {/* Modal Body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              {/* Metadata Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'left' }}>
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textAlign: 'left' }}>TARGET TIMELINE</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: '2px', textAlign: 'left' }}>{activeDetailItem.targetTime}</div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textAlign: 'left' }}>ASSIGNED STAFF</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: '2px', textAlign: 'left' }}>{activeDetailItem.assignedTo}</div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.65rem 0.85rem', textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textAlign: 'left' }}>DEPARTMENT</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: '2px', textAlign: 'left' }}>{activeDetailItem.department}</div>
                </div>
              </div>

              {/* Project Context */}
              {activeDetailItem.projectContext && (
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.75rem 0.85rem', textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textAlign: 'left' }}>PROJECT ASSIGNMENT CONTEXT</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-accent-600)', marginTop: '2px', textAlign: 'left' }}>
                    {activeDetailItem.projectContext}
                  </div>
                </div>
              )}

              {/* Task Description */}
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '4px', textAlign: 'left' }}>
                  Activity Scope & Technical Overview
                </div>
                <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.75rem 0.85rem', textAlign: 'left' }}>
                  {activeDetailItem.description}
                </div>
              </div>

              {/* Category-Specific Notes */}
              {activeDetailItem.correctionDetails && (
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#92400E', marginBottom: '4px', textAlign: 'left' }}>
                    Minor Correction Details Log
                  </div>
                  <div style={{ fontSize: '12px', color: '#92400E', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '6px', padding: '0.65rem 0.85rem', textAlign: 'left' }}>
                    {activeDetailItem.correctionDetails}
                  </div>
                </div>
              )}

              {/* Timeline Allocation Bar */}
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.75rem 0.85rem', textAlign: 'left' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textAlign: 'left' }}>CRITICAL TIMELINE ALLOCATION</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: '2px', textAlign: 'left' }}>
                  {activeDetailItem.timelineAllocation}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '0.5rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Change Status:</span>
                <select
                  value={activeDetailItem.status}
                  onChange={(e) => handleUpdateTaskStatus(activeDetailItem.id, e.target.value as ToDoStatus)}
                  style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 600 }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

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

      {/* MODAL 2: CREATE NEW TASK FORM MODAL */}
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
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem', textAlign: 'left' }}>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: 700, margin: 0, textAlign: 'left' }}>
                  Log New Activity / Task
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', textAlign: 'left' }}>
                  Add a daily task, minor correction, project update, or timeline allocation.
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

            {/* Form */}
            <form onSubmit={handleCreateTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Geotechnical Borehole Soil Strata Audit Report Sign-off"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', textAlign: 'left' }}>
                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                    Category Area *
                  </label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as ToDoCategory)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
                  >
                    <option value="Daily Activities">Daily Activities</option>
                    <option value="Minor Corrections">Minor Corrections</option>
                    <option value="Project Requirement Updates">Project Requirement Updates</option>
                    <option value="Important Communications">Important Communications</option>
                    <option value="Critical Timeline Allocation">Critical Timeline Allocation</option>
                  </select>
                </div>

                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                    Priority *
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as ToDoPriority)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
                  >
                    <option value="Normal">Normal Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Critical">Critical Priority</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', textAlign: 'left' }}>
                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                    Target Time / Timeline
                  </label>
                  <input
                    type="text"
                    value={newTaskTimeline}
                    onChange={(e) => setNewTaskTimeline(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                    Project Assignment
                  </label>
                  <input
                    type="text"
                    value={newTaskProject}
                    onChange={(e) => setNewTaskProject(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', textAlign: 'left' }}>
                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                    Assigned Staff
                  </label>
                  <input
                    type="text"
                    value={newTaskAssignedTo}
                    onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                    Department
                  </label>
                  <input
                    type="text"
                    value={newTaskDepartment}
                    onChange={(e) => setNewTaskDepartment(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ textAlign: 'left' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px', textAlign: 'left' }}>
                  Task Description & Scope Overview
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide technical scope overview..."
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
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
                  Save & Log Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
