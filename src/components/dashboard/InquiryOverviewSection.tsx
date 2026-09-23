import React from 'react';
import { INQUIRY_OVERVIEW_DATA } from '../../data/mockDashboardData';
import { Inbox, FileText, Globe, Tag, Phone, Mail, ChevronRight } from 'lucide-react';

const INQUIRY_ICONS: Record<string, React.ReactNode> = {
  'Online Quotations': <FileText size={15} />,
  'GEM / Website / Portal': <Globe size={15} />,
  'Tenders': <Tag size={15} />,
  'Verbal Inquiries': <Phone size={15} />,
  'Mail Inquiries': <Mail size={15} />
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', color: '#0F172A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Inbox size={16} style={{ color: 'var(--color-accent-500)' }} />
            Inquiry Channel Queue
          </h3>
          <p style={{ fontSize: '0.73rem', color: '#64748B', marginTop: '2px' }}>
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
            fontSize: '0.68rem',
            fontWeight: 650
          }}
        >
          62 TOTAL INQUIRIES
        </span>
      </div>

      {/* Inquiry Channels Breakdown List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {INQUIRY_OVERVIEW_DATA.map((item) => {
          const icon = INQUIRY_ICONS[item.channelName] || <Inbox size={15} />;

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
              {/* Channel title + icon */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: '160px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: 'var(--color-accent-500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 650, color: '#0F172A' }}>
                    {item.channelName}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '180px' }}>
                    {item.recentTitle}
                  </div>
                </div>
              </div>

              {/* Status Stats */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.64rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>
                    RECEIVED
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                    {item.totalReceived}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.64rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>
                    PENDING
                  </div>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: item.pendingAction > 4 ? '#B45309' : '#0F172A'
                    }}
                  >
                    {item.pendingAction}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.64rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>
                    CONVERTED
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#047857' }}>
                    {item.converted} ({item.conversionRate})
                  </div>
                </div>

                <ChevronRight size={15} style={{ color: '#94A3B8' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
