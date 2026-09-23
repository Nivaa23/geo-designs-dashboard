export type NavModuleId =
  | 'overview'
  | 'inquiry-management'
  | 'daily-critical-activities'
  | 'strategic-marketing'
  | 'project-tracking'
  | 'major-projects'
  | 'account-expenses'
  | 'finance-recovery';

export interface NavItemConfig {
  id: NavModuleId;
  label: string;
  iconName: string;
  badgeCount?: number;
  description: string;
}

export interface EmployeeWorkSession {
  checkInTime: string;
  shiftHours: string;
  sessionDuration: string;
  attendanceState: 'Present & On Site' | 'Field Inspection' | 'Remote / On Duty';
  location: string;
}

export interface LeaveBalance {
  casual: number;
  casualTotal: number;
  medical: number;
  medicalTotal: number;
  earned: number;
  earnedTotal: number;
  pendingApproval: number;
  totalAnnualAllocation: number;
}

export interface KpiCardItem {
  id: string;
  title: string;
  metric: string;
  unit?: string;
  statusLabel: string;
  statusType: 'success' | 'warning' | 'info' | 'neutral' | 'error';
  trendValue: string;
  contextLine: string;
  iconName: string;
}

export interface ProjectProgressItem {
  id: string;
  code: string;
  name: string;
  client: string;
  sector: 'Geotechnical' | 'Surveying' | 'Structural' | 'Infrastructure';
  progressPercentage: number;
  status: 'On Schedule' | 'Milestone Review' | 'In Progress' | 'Pending Sign-off';
  deadline: string;
  totalValuation: string;
}

export interface InquiryCategoryItem {
  id: string;
  channelName:
    | 'Online Quotations'
    | 'GEM / Website / Portal'
    | 'Tenders'
    | 'Verbal Inquiries'
    | 'Mail Inquiries';
  totalReceived: number;
  pendingAction: number;
  converted: number;
  conversionRate: string;
  recentTitle: string;
  urgency: 'high' | 'medium' | 'normal';
}

export interface DailyActivityItem {
  id: string;
  code: string;
  title: string;
  category: string;
  priority: 'Critical' | 'High' | 'Normal';
  assignedTo: string;
  department: string;
  targetTime: string;
  status: 'Pending' | 'In Review' | 'Completed';
}

export interface MajorProjectTimelineItem {
  id: string;
  name: string;
  location: string;
  phase: string;
  currentMilestone: string;
  weeklyProgress: { week: string; label: string; status: 'completed' | 'in-progress' | 'scheduled' }[];
  completionEst: string;
}

export interface FinancialRecoveryItem {
  id: string;
  category: string;
  committedExpenses: string;
  recoveredAmount: string;
  outstandingRecovery: string;
  recoveryRate: number;
  overdueAccounts: number;
  status: 'Healthy' | 'Attention Required' | 'Action Needed';
}
