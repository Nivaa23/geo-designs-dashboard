import type {
  NavItemConfig,
  KpiCardItem,
  ProjectProgressItem,
  InquiryCategoryItem,
  DailyActivityItem,
  MajorProjectTimelineItem,
  FinancialRecoveryItem,
  EmployeeWorkSession,
  LeaveBalance
} from '../types/dashboard';

export const EMPLOYEE_WORK_SESSION_DATA: EmployeeWorkSession = {
  checkInTime: '09:00 AM Today',
  shiftHours: '09:00 - 18:00 (Regular Shift)',
  sessionDuration: '6h 25m active',
  attendanceState: 'Present & On Site',
  location: 'HQ Engineering Lab, New Delhi'
};

export const LEAVE_BALANCE_DATA: LeaveBalance = {
  casual: 8,
  casualTotal: 12,
  medical: 12,
  medicalTotal: 15,
  earned: 14,
  earnedTotal: 20,
  pendingApproval: 1,
  totalAnnualAllocation: 25
};

export const NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'overview',
    label: 'Dashboard Overview',
    iconName: 'LayoutDashboard',
    description: 'Central operational dashboard and executive summary'
  },
  {
    id: 'inquiry-management',
    label: 'Inquiry Management',
    iconName: 'Inbox',
    badgeCount: 18,
    description: 'Online quotations, GEM portal tenders, verbal and mail inquiry tracking'
  },
  {
    id: 'daily-critical-activities',
    label: 'To-Do List',
    iconName: 'CheckSquare',
    badgeCount: 4,
    description: 'High-priority daily site, laboratory, and engineering tasks'
  },
  {
    id: 'strategic-marketing',
    label: 'Strategic & Marketing Activities',
    iconName: 'TrendingUp',
    description: 'Client acquisition, strategic partnerships, and corporate outreach'
  },
  {
    id: 'project-tracking',
    label: 'Project Tracking',
    iconName: 'Briefcase',
    badgeCount: 24,
    description: 'Active survey, geotechnical, and structural engineering assignments'
  },
  {
    id: 'major-projects',
    label: 'Major Projects',
    iconName: 'Layers',
    badgeCount: 7,
    description: 'High-valuation infrastructure timelines and multi-phase milestones'
  },
  {
    id: 'account-expenses',
    label: 'Account Expenses',
    iconName: 'CreditCard',
    description: 'Operational site expenses, laboratory equipment, and field disbursements'
  },
  {
    id: 'finance-recovery',
    label: 'Finance & Recovery',
    iconName: 'DollarSign',
    badgeCount: 2,
    description: 'Commitment tracking, client billing recovery, and outstanding receivables'
  }
];

export const KPI_SUMMARY_CARDS: KpiCardItem[] = [
  {
    id: 'kpi-active-projects',
    title: 'ACTIVE PROJECTS',
    metric: '24',
    statusLabel: '4 In Testing Phase',
    statusType: 'success',
    trendValue: '+3 this month',
    contextLine: '18 on schedule • 6 milestone reviews',
    iconName: 'Briefcase'
  },
  {
    id: 'kpi-pending-inquiries',
    title: 'PENDING INQUIRIES',
    metric: '18',
    statusLabel: '5 High Priority',
    statusType: 'warning',
    trendValue: '12h avg response',
    contextLine: '7 Tenders • 6 GEM Portal • 5 Direct',
    iconName: 'Inbox'
  },
  {
    id: 'kpi-daily-activities',
    title: "TODAY'S CRITICAL ACTIVITIES",
    metric: '12',
    statusLabel: '4 Pending Action',
    statusType: 'info',
    trendValue: '8 Completed today',
    contextLine: '2 Site verification • 2 Lab approvals',
    iconName: 'CheckSquare'
  },
  {
    id: 'kpi-major-projects',
    title: 'MAJOR PROJECTS',
    metric: '7',
    statusLabel: '3 Milestones Due',
    statusType: 'neutral',
    trendValue: '₹4.2 Cr portfolio',
    contextLine: 'Metro Line, Expressway, Tech Park B',
    iconName: 'Layers'
  },
  {
    id: 'kpi-outstanding-recovery',
    title: 'OUTSTANDING RECOVERY',
    metric: '₹28.5L',
    statusLabel: '2 Accounts Overdue',
    statusType: 'warning',
    trendValue: '14 Days avg turn',
    contextLine: '₹18.2L in processing • ₹10.3L pending',
    iconName: 'DollarSign'
  }
];

export const PROJECT_PROGRESS_DATA: ProjectProgressItem[] = [
  {
    id: 'proj-101',
    code: 'GEO-PRJ-2026-089',
    name: 'Metro Line Extension Phase 3 — Geotechnical Sub-surface Survey',
    client: 'Urban Transit Corporation',
    sector: 'Geotechnical',
    progressPercentage: 82,
    status: 'In Progress',
    deadline: '28 Oct 2026',
    totalValuation: '₹85,00,000'
  },
  {
    id: 'proj-102',
    code: 'GEO-PRJ-2026-074',
    name: 'National Expressway Corridor — Topographic & UAV Aerial Mapping',
    client: 'National Highway Authority',
    sector: 'Surveying',
    progressPercentage: 94,
    status: 'Milestone Review',
    deadline: '15 Oct 2026',
    totalValuation: '₹1,20,00,000'
  },
  {
    id: 'proj-103',
    code: 'GEO-PRJ-2026-092',
    name: 'Cyber IT Park Tower B — Structural Load & Soil Capacity Audit',
    client: 'Apex Realty Developers',
    sector: 'Structural',
    progressPercentage: 45,
    status: 'On Schedule',
    deadline: '12 Nov 2026',
    totalValuation: '₹48,50,000'
  },
  {
    id: 'proj-104',
    code: 'GEO-PRJ-2026-068',
    name: 'Industrial Corridor Water Supply Reservoir — Hydrological Study',
    client: 'State Infrastructure Corp',
    sector: 'Infrastructure',
    progressPercentage: 98,
    status: 'Pending Sign-off',
    deadline: '30 Sep 2026',
    totalValuation: '₹62,00,000'
  }
];

export const INQUIRY_OVERVIEW_DATA: InquiryCategoryItem[] = [
  {
    id: 'inq-1',
    channelName: 'Online Quotations',
    totalReceived: 14,
    pendingAction: 3,
    converted: 8,
    conversionRate: '57%',
    recentTitle: 'Structural audit quote request - Commercial Complex',
    urgency: 'medium'
  },
  {
    id: 'inq-2',
    channelName: 'GEM / Website / Portal',
    totalReceived: 22,
    pendingAction: 6,
    converted: 12,
    conversionRate: '54%',
    recentTitle: 'GEM Bid Ref #GEM/2026/B/49210 — Highway Survey',
    urgency: 'high'
  },
  {
    id: 'inq-3',
    channelName: 'Tenders',
    totalReceived: 9,
    pendingAction: 4,
    converted: 3,
    conversionRate: '33%',
    recentTitle: 'State Irrigation Dept Tender — Dam Safety Assessment',
    urgency: 'high'
  },
  {
    id: 'inq-4',
    channelName: 'Verbal Inquiries',
    totalReceived: 6,
    pendingAction: 2,
    converted: 3,
    conversionRate: '50%',
    recentTitle: 'Site meeting inquiry — Smart City Utility Mapping',
    urgency: 'normal'
  },
  {
    id: 'inq-5',
    channelName: 'Mail Inquiries',
    totalReceived: 11,
    pendingAction: 3,
    converted: 6,
    conversionRate: '55%',
    recentTitle: 'Direct email inquiry — Soil testing for high-rise',
    urgency: 'normal'
  }
];

export const DAILY_CRITICAL_ACTIVITIES_DATA: DailyActivityItem[] = [
  {
    id: 'act-1',
    code: 'ACT-0923-01',
    title: 'Borehole Sample Lab Analysis & Triaxial Shear Test Report Sign-off',
    category: 'Geotechnical Lab',
    priority: 'Critical',
    assignedTo: 'Dr. V. Raman',
    department: 'Research & Lab',
    targetTime: '14:30 Today',
    status: 'Pending'
  },
  {
    id: 'act-2',
    code: 'ACT-0923-02',
    title: 'Metro Corridor Section 4 DGPS Ground Control Point Verification',
    category: 'Field Survey',
    priority: 'High',
    assignedTo: 'K. S. Verma',
    department: 'Survey Team 2',
    targetTime: '16:00 Today',
    status: 'Pending'
  },
  {
    id: 'act-3',
    code: 'ACT-0923-03',
    title: 'Submission of Technical Bid Docs for GEM Tender #GEM-88421',
    category: 'Tender Desk',
    priority: 'Critical',
    assignedTo: 'Ananya Roy',
    department: 'Business Operations',
    targetTime: '17:30 Today',
    status: 'In Review'
  },
  {
    id: 'act-4',
    code: 'ACT-0923-04',
    title: 'Client Payment Clearance Verification — National Highway Project',
    category: 'Finance Recovery',
    priority: 'High',
    assignedTo: 'R. K. Sharma',
    department: 'Accounts',
    targetTime: '18:00 Today',
    status: 'Pending'
  }
];

export const MAJOR_PROJECTS_TIMELINE_DATA: MajorProjectTimelineItem[] = [
  {
    id: 'mp-1',
    name: 'Metro Line Extension Phase 3',
    location: 'Sector 62 - Airport Hub',
    phase: 'Phase 2: Sub-grade Drilling',
    currentMilestone: '120m Deep Core Drilling & Standard Penetration Test',
    weeklyProgress: [
      { week: 'W36', label: 'Topography Map', status: 'completed' },
      { week: 'W37', label: 'Borehole Drilling', status: 'completed' },
      { week: 'W38', label: 'Lab Soil Testing', status: 'in-progress' },
      { week: 'W39', label: 'Final Stratigraphy', status: 'scheduled' }
    ],
    completionEst: '82%'
  },
  {
    id: 'mp-2',
    name: 'National Expressway Corridor',
    location: 'Km 140 to Km 210',
    phase: 'Phase 4: Contour Data Processing',
    currentMilestone: 'UAV Point Cloud Processing & Orthomosaic Alignment',
    weeklyProgress: [
      { week: 'W36', label: 'Flight Missions', status: 'completed' },
      { week: 'W37', label: 'GCP Tie-in', status: 'completed' },
      { week: 'W38', label: 'DEM Extraction', status: 'completed' },
      { week: 'W39', label: 'CAD Delivery', status: 'in-progress' }
    ],
    completionEst: '94%'
  }
];

export const FINANCIAL_RECOVERY_DATA: FinancialRecoveryItem[] = [
  {
    id: 'fin-1',
    category: 'Government & PSU Contracts',
    committedExpenses: '₹42,50,000',
    recoveredAmount: '₹1,18,00,000',
    outstandingRecovery: '₹18,50,000',
    recoveryRate: 86,
    overdueAccounts: 1,
    status: 'Healthy'
  },
  {
    id: 'fin-2',
    category: 'Private Commercial & Infrastructure',
    committedExpenses: '₹28,10,000',
    recoveredAmount: '₹64,20,000',
    outstandingRecovery: '₹10,00,000',
    recoveryRate: 86,
    overdueAccounts: 1,
    status: 'Attention Required'
  }
];
