import type { ProjectProgressItem } from './dashboard';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
}

export interface MomRecord {
  id: string;
  date: string;
  subject: string;
  summary: string;
  attendees: string;
}

export interface SopReference {
  id: string;
  code: string;
  title: string;
  category: string;
}

export interface ProjectFinanceInfo {
  totalValuation: string;
  numericalValuation: number;
  billedAmount: string;
  receivedAmount: string;
  pendingValuation: string;
  status: 'Healthy' | 'In Progress' | 'Attention Required';
}

export interface DetailedProjectTrackingItem extends ProjectProgressItem {
  allocationDivision: string;
  assignedTeam: TeamMember[];
  timelineUpdates: { date: string; note: string }[];
  momRecords: MomRecord[];
  sopReferences: SopReference[];
  financeInfo: ProjectFinanceInfo;
}
