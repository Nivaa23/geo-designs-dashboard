export type MajorProjectSector = 'Geotechnical' | 'Surveying' | 'Structural' | 'Infrastructure';

export type MajorProjectCategory = 
  | 'Mega Infrastructure'
  | 'Highways & Expressways'
  | 'Structural & Urban IT Parks'
  | 'Hydrology & Energy'
  | 'Geotechnical Audits';

export type MajorProjectHealth = 'On Track' | 'Milestone Review' | 'Attention Required' | 'Completed';

export interface MajorProjectWeeklyPhase {
  week: string;
  label: string;
  deliverable: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  targetDate: string;
}

export interface MajorProjectRiskItem {
  id: string;
  title: string;
  type: 'Risk' | 'Pending Decision' | 'Upcoming Milestone';
  severity: 'Critical' | 'Moderate' | 'Normal';
  actionOwner: string;
  dueDate: string;
}

export interface MajorProjectFinance {
  totalValuation: string;
  numericalValuation: number;
  billedAmount: string;
  receivedAmount: string;
  pendingValuation: string;
  financialHealth: 'Healthy' | 'Attention Required' | 'Action Needed';
}

export interface MajorProjectTeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  phone?: string;
}

export interface MajorProjectItem {
  id: string;
  code: string;
  title: string;
  client: string;
  sector: MajorProjectSector;
  category: MajorProjectCategory;
  location: string;
  division: string;
  currentPhase: string;
  currentMilestone: string;
  progressPercentage: number;
  health: MajorProjectHealth;
  startDate: string;
  targetCompletionDate: string;
  qualityAuditStatus: 'Certified' | 'Under Review' | 'Passed';
  safetyCompliance: string;
  finance: MajorProjectFinance;
  weeklyPhases: MajorProjectWeeklyPhase[];
  risksAndDecisions: MajorProjectRiskItem[];
  team: MajorProjectTeamMember[];
  description: string;
  keyObjectives: string[];
}
