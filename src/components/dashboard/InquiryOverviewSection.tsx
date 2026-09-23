import React from 'react';
import { INQUIRY_OVERVIEW_DATA } from '../../data/mockDashboardData';
import { Inbox, FileText, Globe, Tag, Phone, Mail, ChevronRight } from 'lucide-react';

const INQUIRY_ICONS: Record<string, React.ReactNode> = {
  'Online Quotations': <FileText size={16} />,
  'GEM / Website / Portal': <Globe size={16} />,
  'Tenders': <Tag size={16} />,
  'Verbal Inquiries': <Phone size={16} />,
  'Mail Inquiries': <Mail size={16} />
};

export const InquiryOverviewSection: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.35rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)'
      }}
    >
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ textAlign: 'left' }}>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#0F172A',
              lineHeight: 1.25,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: 0,
              textAlign: 'left'
            }}
          >
            <Inbox size={18} style={{ color: 'var(--color-accent-500)' }} />
            Inquiry Channel Queue
          </h3>
          <p
            style={{
              fontSize: '13px',
              fontWeight: 400,
              color: '#64748B',
              lineHeight: 1.4,
              marginTop: '4px',
              margin: '4px 0 0 0',
              textAlign: 'left'
            }}
          >
            Contracted inquiry distribution & response status across operational portals.
          </p>
        </div>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '10px',
            backgroundColor: 'rgba(2, 132, 199, 0.08)',
            border: '1px solid rgba(2, 132, 199, 0.2)',
            color: 'var(--color-accent-600)',
            fontSize: '11px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            marginTop: '2px'
          }}
        >
          62 TOTAL INQUIRIES
        </span>
      </div>

      {/* Inquiry Channels Breakdown List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {INQUIRY_OVERVIEW_DATA.map((item) => {
          const icon = INQUIRY_ICONS[item.channelName] || <Inbox size={16} />;

          return (
            <div
              key={item.id}
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}
            >
              {/* [Icon] → [Title + Description] */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0, textAlign: 'left' }}>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: 'var(--color-accent-500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {icon}
                </div>
                <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#0F172A',
                      lineHeight: 1.25,
                      textAlign: 'left'
                    }}
                  >
                    {item.channelName}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 400,
                      color: '#64748B',
                      lineHeight: 1.3,
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      textAlign: 'left'
                    }}
                  >
                    {item.recentTitle}
                  </div>
                </div>
              </div>

              {/* [Received] [Pending] [Converted] → [Arrow] */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
                <div style={{ textAlign: 'center', minWidth: '55px' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                    RECEIVED
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginTop: '2px' }}>
                    {item.totalReceived}
                  </div>
                </div>

                <div style={{ textAlign: 'center', minWidth: '55px' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                    PENDING
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: item.pendingAction > 4 ? '#B45309' : '#0F172A',
                      marginTop: '2px'
                    }}
                  >
                    {item.pendingAction}
                  </div>
                </div>

                <div style={{ textAlign: 'center', minWidth: '85px' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                    CONVERTED
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#047857', marginTop: '2px' }}>
                    {item.converted} ({item.conversionRate})
                  </div>
                </div>

                <ChevronRight size={15} style={{ color: '#94A3B8', flexShrink: 0 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
