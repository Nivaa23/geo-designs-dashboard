import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_CHAT_EMPLOYEES, INITIAL_CONVERSATIONS } from '../../data/mockChatData';
import type {
  ChatEmployee,
  ChatMessage,
  ChatAttachment,
  AttachmentCategory
} from '../../types/chat';
import { ATTACHMENT_CONFIG } from '../../types/chat';
import {
  X,
  Send,
  ArrowLeft,
  MessageSquare,
  Users,
  Search,
  CheckCheck,
  Plus,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Layers,
  FolderArchive,
  File,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

interface InternalChatViewProps {
  onReturnToOverview?: () => void;
}

// Helper to format file sizes nicely
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Helper to categorize files
const getFileCategory = (filename: string, mimeType: string): AttachmentCategory => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  if (mimeType.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) {
    return 'image';
  }
  if (mimeType.startsWith('video/') || ['mp4', 'mov', 'webm', 'avi', 'mkv'].includes(ext)) {
    return 'video';
  }
  if (
    mimeType.includes('pdf') ||
    mimeType.includes('word') ||
    mimeType.includes('excel') ||
    mimeType.includes('presentation') ||
    mimeType.includes('text') ||
    ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'].includes(ext)
  ) {
    return 'document';
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return 'archive';
  }
  if (ATTACHMENT_CONFIG.engineeringExtensions.includes(ext)) {
    return 'engineering';
  }
  return 'file';
};

// Helper to render appropriate file-type icon
const renderFileIcon = (category: AttachmentCategory, ext: string, size = 16, isUser = false) => {
  const lowerExt = ext.toLowerCase();

  if (category === 'image') {
    return <ImageIcon size={size} style={{ color: isUser ? '#FFFFFF' : '#0284C7' }} />;
  }
  if (category === 'video') {
    return <VideoIcon size={size} style={{ color: isUser ? '#FFFFFF' : '#8B5CF6' }} />;
  }
  if (category === 'document') {
    if (lowerExt === 'pdf') {
      return <FileText size={size} style={{ color: isUser ? '#FFFFFF' : '#EF4444' }} />;
    }
    if (['xls', 'xlsx', 'csv'].includes(lowerExt)) {
      return <FileSpreadsheet size={size} style={{ color: isUser ? '#FFFFFF' : '#10B981' }} />;
    }
    return <FileText size={size} style={{ color: isUser ? '#FFFFFF' : '#0284C7' }} />;
  }
  if (category === 'engineering') {
    return <Layers size={size} style={{ color: isUser ? '#FFFFFF' : '#0EA5E9' }} />;
  }
  if (category === 'archive') {
    return <FolderArchive size={size} style={{ color: isUser ? '#FFFFFF' : '#D97706' }} />;
  }
  return <File size={size} style={{ color: isUser ? '#FFFFFF' : '#64748B' }} />;
};

export const InternalChatView: React.FC<InternalChatViewProps> = () => {
  const { currentUser } = useAuth();
  const currentUserName = currentUser?.name || 'Sarah Jenkins';

  // Selected employee ID - defaults to Om Parikh ('emp-om-parikh')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>('emp-om-parikh');

  // Conversations dictionary mapped by employee ID
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>(INITIAL_CONVERSATIONS);

  // Message text input state
  const [messageInput, setMessageInput] = useState('');

  // Selected file attachments pending send in composer
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);

  // Attachment drawer visibility state
  const [isAttachmentDrawerOpen, setIsAttachmentDrawerOpen] = useState(false);

  // Client-side validation error message
  const [attachmentError, setAttachmentError] = useState<string | null>(null);

  // Search query for employees list
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');

  // Mobile active panel state: 'list' | 'chat'
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('chat');

  // Refs for scrolling and inputs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const attachmentButtonRef = useRef<HTMLButtonElement>(null);

  // Category file input refs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const engineeringInputRef = useRef<HTMLInputElement>(null);
  const allFilesInputRef = useRef<HTMLInputElement>(null);

  // Selected employee data
  const selectedEmployee: ChatEmployee | undefined = MOCK_CHAT_EMPLOYEES.find(
    (emp) => emp.id === selectedEmployeeId
  );

  // Active messages list
  const activeMessages: ChatMessage[] = selectedEmployeeId
    ? conversations[selectedEmployeeId] || []
    : [];

  // Filtered employees list
  const filteredEmployees = MOCK_CHAT_EMPLOYEES.filter(
    (emp) =>
      emp.name.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
      emp.title.toLowerCase().includes(employeeSearchQuery.toLowerCase())
  );

  // Check if composer has sendable content
  const isSendable = messageInput.trim().length > 0 || pendingAttachments.length > 0;

  // Auto-scroll to bottom
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (selectedEmployeeId) {
      scrollToBottom('auto');
    }
  }, [selectedEmployeeId]);

  // Click outside and Escape key listener to close drawer
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isAttachmentDrawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node) &&
        attachmentButtonRef.current &&
        !attachmentButtonRef.current.contains(e.target as Node)
      ) {
        setIsAttachmentDrawerOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAttachmentDrawerOpen) {
        setIsAttachmentDrawerOpen(false);
        attachmentButtonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAttachmentDrawerOpen]);

  // Handle select employee
  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setMobileView('chat');
  };

  // Handle close (X) button in chat header
  const handleCloseConversation = () => {
    setSelectedEmployeeId(null);
    setMobileView('list');
  };

  // Adjust textarea height up to 130px max
  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    const newHeight = Math.min(element.scrollHeight, 130);
    element.style.height = `${newHeight}px`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    adjustTextareaHeight(e.target);
  };

  // File selection validation & ingestion
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsAttachmentDrawerOpen(false);
    setAttachmentError(null);

    const fileArray = Array.from(files);

    // Limit validation: max attachments
    if (pendingAttachments.length + fileArray.length > ATTACHMENT_CONFIG.maxAttachmentsPerMessage) {
      setAttachmentError(
        `Maximum ${ATTACHMENT_CONFIG.maxAttachmentsPerMessage} attachments allowed per message. Selected ${fileArray.length} file(s) would exceed the limit.`
      );
      return;
    }

    const newAttachments: ChatAttachment[] = [];
    let sizeError: string | null = null;

    for (const file of fileArray) {
      // Limit validation: max file size
      if (file.size > ATTACHMENT_CONFIG.maxFileSizeBytes) {
        sizeError = `File "${file.name}" exceeds the ${ATTACHMENT_CONFIG.maxFileSizeMB} MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`;
        continue;
      }

      const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      const category = getFileCategory(file.name, file.type);
      const isImg = category === 'image';

      newAttachments.push({
        id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: file.size,
        formattedSize: formatFileSize(file.size),
        type: file.type,
        category,
        extension: ext,
        previewUrl: isImg ? URL.createObjectURL(file) : undefined,
        file
      });
    }

    if (sizeError) {
      setAttachmentError(sizeError);
    }

    if (newAttachments.length > 0) {
      setPendingAttachments((prev) => [...prev, ...newAttachments]);
    }
  };

  // Remove individual attachment from composer
  const handleRemoveAttachment = (attachmentId: string) => {
    setPendingAttachments((prev) => {
      const target = prev.find((a) => a.id === attachmentId);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((a) => a.id !== attachmentId);
    });
  };

  // Handle send message
  const handleSendMessage = () => {
    const trimmed = messageInput.trim();
    if ((!trimmed && pendingAttachments.length === 0) || !selectedEmployeeId) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'usr-current',
      senderName: currentUserName,
      text: trimmed,
      timestamp: 'Just now',
      isCurrentUser: true,
      attachments: pendingAttachments.length > 0 ? [...pendingAttachments] : undefined
    };

    setConversations((prev) => ({
      ...prev,
      [selectedEmployeeId]: [...(prev[selectedEmployeeId] || []), newMessage]
    }));

    // Clear composer state while preserving selection
    setMessageInput('');
    setPendingAttachments([]);
    setAttachmentError(null);
    setIsAttachmentDrawerOpen(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setTimeout(() => {
      scrollToBottom('smooth');
      textareaRef.current?.focus();
    }, 50);
  };

  // Keyboard Enter handler (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '620px',
        maxHeight: 'calc(100vh - 120px)',
        width: '100%',
        boxSizing: 'border-box'
      }}
      className="geo-internal-chat-wrapper"
    >
      {/* 3-Panel Main Communication Layout Container */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
          overflow: 'hidden',
          position: 'relative'
        }}
        className="geo-internal-chat-container"
      >
        {/* PANEL A: Middle Panel — Employee Conversation List */}
        <section
          aria-label="Employees list"
          style={{
            width: '320px',
            minWidth: '280px',
            maxWidth: '360px',
            borderRight: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            boxSizing: 'border-box',
            flexShrink: 0
          }}
          className={`geo-chat-panel-employees ${mobileView === 'chat' ? 'geo-hide-mobile' : ''}`}
        >
          {/* Header for Employees Section */}
          <div
            style={{
              padding: '1rem 1.15rem 0.75rem',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} style={{ color: 'var(--color-accent-500)' }} />
                <h2
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    letterSpacing: '-0.01em',
                    margin: 0
                  }}
                >
                  Employees
                </h2>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 650,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: '#F1F5F9',
                  color: '#475569'
                }}
              >
                {MOCK_CHAT_EMPLOYEES.length}
              </span>
            </div>

            {/* Employee Search Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                padding: '0.4rem 0.65rem'
              }}
            >
              <Search size={14} style={{ color: '#94A3B8', flexShrink: 0 }} />
              <input
                type="text"
                value={employeeSearchQuery}
                onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                placeholder="Search employees..."
                aria-label="Search employees"
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.8125rem',
                  color: '#0F172A',
                  width: '100%',
                  fontFamily: 'inherit'
                }}
              />
              {employeeSearchQuery && (
                <button
                  type="button"
                  onClick={() => setEmployeeSearchQuery('')}
                  aria-label="Clear employee search"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Vertically Stacked Employees List */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0.5rem 0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}
            className="geo-chat-employee-scroll"
            role="list"
          >
            {filteredEmployees.length === 0 ? (
              <div
                style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  color: '#64748B',
                  fontSize: '0.8125rem'
                }}
              >
                No employees found matching &quot;{employeeSearchQuery}&quot;
              </div>
            ) : (
              filteredEmployees.map((emp) => {
                const isSelected = selectedEmployeeId === emp.id;
                const conversation = conversations[emp.id] || [];
                const lastMessage = conversation[conversation.length - 1];

                return (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => handleSelectEmployee(emp.id)}
                    aria-label={`Open chat with ${emp.name}`}
                    role="listitem"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
                      border: isSelected ? '1px solid rgba(2, 132, 199, 0.25)' : '1px solid transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      position: 'relative',
                      transition: 'background-color var(--transition-fast), border-color var(--transition-fast)'
                    }}
                    className={`geo-chat-employee-row ${isSelected ? 'geo-chat-employee-active' : ''}`}
                  >
                    {/* Employee Profile Picture / Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: emp.avatarBg || 'var(--color-accent-500)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          letterSpacing: '0.02em',
                          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.1)'
                        }}
                      >
                        {emp.avatarText}
                      </div>

                      {/* Status dot */}
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor:
                            emp.status === 'online'
                              ? '#10B981'
                              : emp.status === 'away'
                              ? '#F59E0B'
                              : '#94A3B8',
                          border: '2px solid #FFFFFF'
                        }}
                        title={`Status: ${emp.status}`}
                      />
                    </div>

                    {/* Employee Info & Last Message Snippet */}
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.15rem'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem'
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: isSelected ? 700 : 600,
                            color: isSelected ? 'var(--color-accent-600)' : '#0F172A',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {emp.name}
                        </span>

                        {emp.unreadCount && emp.unreadCount > 0 ? (
                          <span
                            style={{
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              backgroundColor: 'var(--color-accent-500)',
                              color: '#FFFFFF',
                              borderRadius: '10px',
                              padding: '1px 6px',
                              minWidth: '16px',
                              textAlign: 'center',
                              lineHeight: 1.3
                            }}
                          >
                            {emp.unreadCount}
                          </span>
                        ) : null}
                      </div>

                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748B',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {emp.title}
                      </div>

                      {lastMessage && (
                        <div
                          style={{
                            fontSize: '0.71875rem',
                            color: '#94A3B8',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginTop: '1px'
                          }}
                        >
                          {lastMessage.isCurrentUser ? 'You: ' : ''}
                          {lastMessage.text || (lastMessage.attachments ? `[Attachment: ${lastMessage.attachments[0].name}]` : '')}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* PANEL B & C & D: Right Panel — Active Chat Conversation */}
        <section
          aria-label="Active conversation"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minWidth: 0,
            backgroundColor: '#FFFFFF',
            position: 'relative'
          }}
          className={`geo-chat-panel-main ${mobileView === 'list' ? 'geo-hide-mobile' : ''}`}
        >
          {selectedEmployee ? (
            <>
              {/* PANEL B — Active Chat Header (Fixed at Top) */}
              <header
                style={{
                  height: '68px',
                  minHeight: '68px',
                  padding: '0.75rem 1.25rem',
                  borderBottom: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#FFFFFF',
                  boxSizing: 'border-box',
                  zIndex: 10
                }}
              >
                {/* Left: Mobile back button + Employee Avatar & Exact Title / Subtitle */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    minWidth: 0,
                    textAlign: 'left'
                  }}
                  className="geo-chat-identity-block"
                >
                  {/* Mobile Back Button to return to Employee List */}
                  <button
                    type="button"
                    onClick={() => setMobileView('list')}
                    aria-label="Back to employees list"
                    title="Back to employees list"
                    style={{
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#F8FAFC',
                      color: '#475569',
                      borderRadius: '6px',
                      padding: '0.4rem',
                      display: 'none',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    className="geo-chat-mobile-back"
                  >
                    <ArrowLeft size={16} />
                  </button>

                  {/* Employee Avatar */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: selectedEmployee.avatarBg || 'var(--color-accent-500)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}
                    >
                      {selectedEmployee.avatarText}
                    </div>
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        backgroundColor:
                          selectedEmployee.status === 'online'
                            ? '#10B981'
                            : selectedEmployee.status === 'away'
                            ? '#F59E0B'
                            : '#94A3B8',
                        border: '2px solid #FFFFFF'
                      }}
                    />
                  </div>

                  {/* Header Title & Subtitle */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      minWidth: 0
                    }}
                  >
                    <h1
                      id="geo-chat-employee-name"
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        color: '#0F172A',
                        lineHeight: 1.25,
                        margin: 0,
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {selectedEmployee.name}
                    </h1>
                    <span
                      id="geo-chat-employee-subtitle"
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748B',
                        lineHeight: 1.2,
                        marginTop: '2px',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {selectedEmployee.title}
                    </span>
                  </div>
                </div>

                {/* Right: Close (X) Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={handleCloseConversation}
                    aria-label="Close conversation"
                    title="Close conversation"
                    id="geo-chat-close-button"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                      color: '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F1F5F9';
                      e.currentTarget.style.color = '#0F172A';
                      e.currentTarget.style.borderColor = '#CBD5E1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.color = '#64748B';
                      e.currentTarget.style.borderColor = '#E2E8F0';
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </header>

              {/* PANEL C — Conversation Messages (Independently Scrollable) */}
              <div
                ref={messagesContainerRef}
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  backgroundColor: '#F8FAFC'
                }}
                className="geo-chat-messages-scroll"
              >
                {/* Date separator divider */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0.5rem 0'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: '#64748B',
                      backgroundColor: '#FFFFFF',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    Today
                  </span>
                </div>

                {activeMessages.map((msg) => {
                  const isUser = msg.isCurrentUser;
                  const hasAttachments = msg.attachments && msg.attachments.length > 0;

                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isUser ? 'flex-end' : 'flex-start',
                        textAlign: isUser ? 'right' : 'left',
                        gap: '0.25rem',
                        maxWidth: '100%'
                      }}
                      className="geo-chat-message-row"
                    >
                      {/* Sender Name & Timestamp Header */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: isUser ? 'flex-end' : 'flex-start',
                          textAlign: isUser ? 'right' : 'left',
                          gap: '0.45rem',
                          fontSize: '0.6875rem',
                          color: '#64748B',
                          padding: isUser ? '0 0.35rem 0 0' : '0 0 0 0.35rem'
                        }}
                      >
                        <span style={{ fontWeight: 650, color: '#475569', textAlign: isUser ? 'right' : 'left' }}>
                          {isUser ? 'You' : msg.senderName}
                        </span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Bubble with Text Content & Attachments */}
                      <div
                        style={{
                          maxWidth: '78%',
                          padding: '0.75rem 1rem',
                          borderRadius: isUser ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                          backgroundColor: isUser ? 'var(--color-accent-500)' : '#FFFFFF',
                          color: isUser ? '#FFFFFF' : '#0F172A',
                          border: isUser ? 'none' : '1px solid #E2E8F0',
                          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                          fontSize: '0.84375rem',
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                          whiteSpace: 'pre-wrap',
                          textAlign: 'left'
                        }}
                        className={isUser ? 'geo-chat-bubble-user' : 'geo-chat-bubble-peer'}
                      >
                        {/* Attachments inside message bubble */}
                        {hasAttachments && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.45rem',
                              marginBottom: msg.text ? '0.55rem' : 0
                            }}
                          >
                            {msg.attachments!.map((att) => (
                              <div
                                key={att.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.6rem',
                                  padding: att.category === 'image' && att.previewUrl ? '4px' : '0.45rem 0.65rem',
                                  borderRadius: '8px',
                                  backgroundColor: isUser ? 'rgba(255, 255, 255, 0.15)' : '#F8FAFC',
                                  border: isUser ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid #E2E8F0',
                                  color: isUser ? '#FFFFFF' : '#0F172A',
                                  fontSize: '0.78125rem'
                                }}
                              >
                                {att.category === 'image' && att.previewUrl ? (
                                  <img
                                    src={att.previewUrl}
                                    alt={att.name}
                                    style={{
                                      width: '60px',
                                      height: '60px',
                                      borderRadius: '6px',
                                      objectFit: 'cover'
                                    }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '6px',
                                      backgroundColor: isUser ? 'rgba(255, 255, 255, 0.2)' : '#FFFFFF',
                                      border: isUser ? 'none' : '1px solid #CBD5E1',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0
                                    }}
                                  >
                                    {renderFileIcon(att.category, att.extension, 16, isUser)}
                                  </div>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                                  <span
                                    style={{
                                      fontWeight: 650,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      color: isUser ? '#FFFFFF' : '#0F172A'
                                    }}
                                    title={att.name}
                                  >
                                    {att.name}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: '0.6875rem',
                                      color: isUser ? 'rgba(255, 255, 255, 0.8)' : '#64748B'
                                    }}
                                  >
                                    {att.extension} • {att.formattedSize}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Message Text */}
                        {msg.text && <div>{msg.text}</div>}

                        {/* Delivery tick for user */}
                        {isUser && (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              marginTop: '3px'
                            }}
                          >
                            <CheckCheck size={12} style={{ opacity: 0.85 }} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>

              {/* PANEL D — Upgraded Message Composer (Integrated with Attachment Drawer) */}
              <footer
                style={{
                  padding: '0.75rem 1.25rem 0.95rem',
                  borderTop: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  boxSizing: 'border-box',
                  zIndex: 20,
                  position: 'relative'
                }}
              >
                {/* Hidden File Inputs for Each Category */}
                <input
                  ref={photoInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    handleFilesSelected(e.target.files);
                    e.target.value = '';
                  }}
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  multiple
                  accept="video/mp4,video/quicktime,video/webm,video/x-msvideo,.mp4,.mov,.webm,.avi"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    handleFilesSelected(e.target.files);
                    e.target.value = '';
                  }}
                />
                <input
                  ref={documentInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,text/csv"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    handleFilesSelected(e.target.files);
                    e.target.value = '';
                  }}
                />
                <input
                  ref={engineeringInputRef}
                  type="file"
                  multiple
                  accept=".dwg,.dxf,.dwt,.dgn,.rvt,.rfa,.ifc,.xml,.landxml,.las,.laz,.shp,.shx,.dbf,.prj,.gpkg,.geojson,.blend,.obj,.fbx,.stl,.glb,.gltf,.step,.stp,.iges,.igs,.dwf,.dwfx,.plt,.svg,.tif,.tiff,.zip,.7z,.rar"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    handleFilesSelected(e.target.files);
                    e.target.value = '';
                  }}
                />
                <input
                  ref={allFilesInputRef}
                  type="file"
                  multiple
                  accept="*/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    handleFilesSelected(e.target.files);
                    e.target.value = '';
                  }}
                />

                {/* Validation Error Alert Banner */}
                {attachmentError && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.75rem',
                      marginBottom: '0.5rem',
                      borderRadius: '8px',
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FECACA',
                      color: '#991B1B',
                      fontSize: '0.75rem',
                      lineHeight: 1.4
                    }}
                    role="alert"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                      <AlertCircle size={15} style={{ color: '#DC2626', flexShrink: 0 }} />
                      <span>{attachmentError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachmentError(null)}
                      aria-label="Dismiss error"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#991B1B',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Attachment Drawer Popover (Opens upward above composer) */}
                {isAttachmentDrawerOpen && (
                  <div
                    ref={drawerRef}
                    id="geo-chat-attachment-drawer"
                    className="geo-chat-attachment-drawer animate-fade-in"
                    style={{
                      position: 'absolute',
                      bottom: 'calc(100% - 2px)',
                      left: '1.25rem',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12), 0 4px 10px rgba(15, 23, 42, 0.08)',
                      padding: '0.45rem',
                      zIndex: 60,
                      width: '280px',
                      maxWidth: 'calc(100% - 2.5rem)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}
                  >
                    {/* Drawer Header */}
                    <div
                      style={{
                        padding: '0.35rem 0.55rem 0.45rem',
                        borderBottom: '1px solid #F1F5F9',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#64748B'
                      }}
                    >
                      Add Attachment
                    </div>

                    {/* Option A: Photos & Images */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsAttachmentDrawerOpen(false);
                        photoInputRef.current?.click();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        width: '100%',
                        padding: '0.5rem 0.65rem',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color var(--transition-fast)'
                      }}
                      className="geo-drawer-option"
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: '#E0F2FE',
                          color: '#0284C7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <ImageIcon size={16} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 650, color: '#0F172A', lineHeight: 1.25 }}>
                          Photos &amp; Images
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: '#64748B', lineHeight: 1.2, marginTop: '2px' }}>
                          PNG, JPG, WebP, GIF, SVG
                        </span>
                      </div>
                    </button>

                    {/* Option B: Videos */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsAttachmentDrawerOpen(false);
                        videoInputRef.current?.click();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        width: '100%',
                        padding: '0.5rem 0.65rem',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color var(--transition-fast)'
                      }}
                      className="geo-drawer-option"
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: '#F3E8FF',
                          color: '#8B5CF6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <VideoIcon size={16} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 650, color: '#0F172A', lineHeight: 1.25 }}>
                          Videos
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: '#64748B', lineHeight: 1.2, marginTop: '2px' }}>
                          MP4, MOV, WebM, AVI
                        </span>
                      </div>
                    </button>

                    {/* Option C: Documents */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsAttachmentDrawerOpen(false);
                        documentInputRef.current?.click();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        width: '100%',
                        padding: '0.5rem 0.65rem',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color var(--transition-fast)'
                      }}
                      className="geo-drawer-option"
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: '#FEF3C7',
                          color: '#D97706',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <FileText size={16} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 650, color: '#0F172A', lineHeight: 1.25 }}>
                          Documents
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: '#64748B', lineHeight: 1.2, marginTop: '2px' }}>
                          PDF, Word, Excel, PPT, CSV, TXT
                        </span>
                      </div>
                    </button>

                    {/* Option D: Engineering and Design Files */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsAttachmentDrawerOpen(false);
                        engineeringInputRef.current?.click();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        width: '100%',
                        padding: '0.5rem 0.65rem',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color var(--transition-fast)'
                      }}
                      className="geo-drawer-option"
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: '#E0F2FE',
                          color: '#0284C7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Layers size={16} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 650, color: '#0F172A', lineHeight: 1.25 }}>
                          Engineering &amp; CAD Files
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: '#64748B', lineHeight: 1.2, marginTop: '2px' }}>
                          DWG, DXF, RVT, IFC, LandXML, SHP, 3D
                        </span>
                      </div>
                    </button>

                    {/* Option E: All Files */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsAttachmentDrawerOpen(false);
                        allFilesInputRef.current?.click();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        width: '100%',
                        padding: '0.5rem 0.65rem',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color var(--transition-fast)'
                      }}
                      className="geo-drawer-option"
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <FolderArchive size={16} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 650, color: '#0F172A', lineHeight: 1.25 }}>
                          All Project Files
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: '#64748B', lineHeight: 1.2, marginTop: '2px' }}>
                          ZIP archives, deliverables, any file
                        </span>
                      </div>
                    </button>

                    {/* Drawer Footer Hint */}
                    <div
                      style={{
                        padding: '0.4rem 0.55rem 0.25rem',
                        borderTop: '1px solid #F1F5F9',
                        fontSize: '0.6875rem',
                        color: '#94A3B8',
                        textAlign: 'center'
                      }}
                    >
                      Max 50 MB per file • Up to 10 files
                    </div>
                  </div>
                )}

                {/* Unified ChatGPT-style Composer Container */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="geo-chat-unified-composer"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    borderRadius: '14px',
                    padding: '0.5rem 0.65rem',
                    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
                    position: 'relative',
                    transition:
                      'border-color var(--transition-fast), box-shadow var(--transition-fast), background-color var(--transition-fast)'
                  }}
                >
                  {/* Selected Attachments Shelf in Composer */}
                  {pendingAttachments.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.45rem',
                        padding: '0.2rem 0.2rem 0.45rem',
                        borderBottom: '1px solid #E2E8F0',
                        marginBottom: '0.4rem',
                        maxHeight: '130px',
                        overflowY: 'auto'
                      }}
                      className="geo-composer-attachments-shelf"
                    >
                      {pendingAttachments.map((att) => (
                        <div
                          key={att.id}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: att.category === 'image' && att.previewUrl ? '3px 6px 3px 3px' : '4px 8px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '8px',
                            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                            maxWidth: '220px',
                            fontSize: '0.75rem',
                            position: 'relative'
                          }}
                          className="geo-composer-attachment-chip"
                        >
                          {att.category === 'image' && att.previewUrl ? (
                            <img
                              src={att.previewUrl}
                              alt={att.name}
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '5px',
                                objectFit: 'cover',
                                flexShrink: 0
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                backgroundColor: '#F1F5F9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              {renderFileIcon(att.category, att.extension, 15)}
                            </div>
                          )}

                          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                            <span
                              style={{
                                fontWeight: 600,
                                color: '#0F172A',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontSize: '0.75rem'
                              }}
                              title={att.name}
                            >
                              {att.name}
                            </span>
                            <span style={{ fontSize: '0.65rem', color: '#64748B' }}>
                              {att.extension} • {att.formattedSize}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(att.id)}
                            aria-label={`Remove ${att.name}`}
                            title={`Remove ${att.name}`}
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              backgroundColor: '#F1F5F9',
                              border: 'none',
                              color: '#64748B',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              flexShrink: 0,
                              padding: 0,
                              transition: 'all var(--transition-fast)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#FEE2E2';
                              e.currentTarget.style.color = '#DC2626';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#F1F5F9';
                              e.currentTarget.style.color = '#64748B';
                            }}
                          >
                            <X size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Main Input Row: Attachment (+) button, Textarea, Send button */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: '0.5rem',
                      width: '100%'
                    }}
                  >
                    {/* Left: Attachment (+) Button */}
                    <button
                      ref={attachmentButtonRef}
                      type="button"
                      onClick={() => setIsAttachmentDrawerOpen((prev) => !prev)}
                      aria-label={isAttachmentDrawerOpen ? 'Close attachment options' : 'Add attachments'}
                      aria-expanded={isAttachmentDrawerOpen}
                      title="Add attachments (Photos, Videos, Documents, CAD & Engineering files)"
                      id="geo-chat-attachment-button"
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor: isAttachmentDrawerOpen ? '#0F172A' : '#FFFFFF',
                        border: isAttachmentDrawerOpen ? '1px solid #0F172A' : '1px solid #CBD5E1',
                        color: isAttachmentDrawerOpen ? '#FFFFFF' : '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                        marginBottom: '2px',
                        transition: 'all var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isAttachmentDrawerOpen) {
                          e.currentTarget.style.backgroundColor = '#F1F5F9';
                          e.currentTarget.style.borderColor = '#94A3B8';
                          e.currentTarget.style.color = '#0F172A';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isAttachmentDrawerOpen) {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                          e.currentTarget.style.borderColor = '#CBD5E1';
                          e.currentTarget.style.color = '#475569';
                        }
                      }}
                    >
                      <Plus
                        size={18}
                        style={{
                          transform: isAttachmentDrawerOpen ? 'rotate(45deg)' : 'none',
                          transition: 'transform 0.18s ease'
                        }}
                      />
                    </button>

                    {/* Middle: Multiline Auto-expanding Textarea */}
                    <textarea
                      ref={textareaRef}
                      value={messageInput}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Write a message…"
                      aria-label="Write a message"
                      id="geo-chat-message-input"
                      rows={1}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        resize: 'none',
                        fontSize: '0.875rem',
                        lineHeight: 1.45,
                        color: '#0F172A',
                        fontFamily: 'inherit',
                        padding: '0.45rem 0.4rem',
                        minHeight: '24px',
                        maxHeight: '130px',
                        overflowY: 'auto'
                      }}
                    />

                    {/* Right: Send Button */}
                    <button
                      type="submit"
                      disabled={!isSendable}
                      aria-label="Send message"
                      title={isSendable ? 'Send message (Enter)' : 'Type a message or add an attachment to send'}
                      id="geo-chat-send-button"
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor: isSendable ? 'var(--color-accent-500)' : '#E2E8F0',
                        color: isSendable ? '#FFFFFF' : '#94A3B8',
                        border: 'none',
                        cursor: isSendable ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginBottom: '2px',
                        transition: 'background-color var(--transition-fast), transform var(--transition-fast)'
                      }}
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </form>
              </footer>
            </>
          ) : (
            /* Sensible Empty State when conversation is closed with X */
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: '#F8FAFC',
                gap: '1rem'
              }}
              id="geo-chat-empty-state"
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent-500)',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)'
                }}
              >
                <MessageSquare size={28} />
              </div>

              <div style={{ maxWidth: '360px' }}>
                <h2
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    marginBottom: '0.4rem'
                  }}
                >
                  Select an Employee
                </h2>
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: '#64748B',
                    lineHeight: 1.5,
                    margin: 0
                  }}
                >
                  Choose a team member from the Employees list on the left to start a conversation, view historical messages, or collaborate.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
