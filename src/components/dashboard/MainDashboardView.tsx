import React from 'react';
import { WorkSessionOverviewBar } from './WorkSessionOverviewBar';
import { KpiCardsGrid } from './KpiCardsGrid';
import { ProjectProgressSection } from './ProjectProgressSection';
import { InquiryOverviewSection } from './InquiryOverviewSection';
import { DailyActivitiesSection } from './DailyActivitiesSection';
import { TimelineSummarySection } from './TimelineSummarySection';
import { FinancialRecoverySection } from './FinancialRecoverySection';

export const MainDashboardView: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.15rem',
        padding: '0.25rem 0 2rem 0'
      }}
      className="animate-fade-in"
    >
      {/* 1. EMPLOYEE WORK SESSION & LEAVE BALANCE OVERVIEW BAR */}
      <WorkSessionOverviewBar />

      {/* 2. OPERATIONAL METRIC CARDS */}
      <KpiCardsGrid />

      {/* 3. PROJECT EXECUTION + INQUIRY CHANNEL QUEUE */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.45fr) minmax(0, 1fr)',
          gap: '1.15rem',
          width: '100%'
        }}
        className="geo-dashboard-grid-2col"
      >
        <ProjectProgressSection />
        <InquiryOverviewSection />
      </div>

      {/* 4. DAILY CRITICAL ACTIVITIES + MAJOR PROJECT TIMELINES */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
          gap: '1.15rem',
          width: '100%'
        }}
        className="geo-dashboard-grid-2col"
      >
        <DailyActivitiesSection />
        <TimelineSummarySection />
      </div>

      {/* 5. FINANCIAL COMMITMENTS & RECOVERY SUMMARY */}
      <FinancialRecoverySection />
    </div>
  );
};
