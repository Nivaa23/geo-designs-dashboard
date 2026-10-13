export type ContractCategory =
  | 'Government & PSU Contracts'
  | 'Private Commercial & Infrastructure';

export type RecoveryHealthStatus =
  | 'Healthy'
  | 'Attention Required'
  | 'Action Needed'
  | 'Fully Recovered';

export interface MilestoneRecoverySchedule {
  id: string;
  milestoneTitle: string;
  percentage: number;
  amount: string;
  numericalAmount: number;
  dueDate: string;
  recoveredAmount: string;
  pendingAmount: string;
  status: 'Recovered' | 'Pending' | 'Overdue' | 'Scheduled';
  invoiceRef?: string;
}

export interface FinanceRecoveryRecord {
  id: string;
  projectCode: string;
  projectName: string;
  client: string;
  contractCategory: ContractCategory;
  sector: 'Geotechnical' | 'Surveying' | 'Structural' | 'Infrastructure';
  totalValuation: string;
  numericalValuation: number;
  billedAmount: string;
  numericalBilled: number;
  recoveredAmount: string;
  numericalRecovered: number;
  outstandingRecovery: string;
  numericalOutstanding: number;
  recoveryRate: number; // e.g. 86
  dueDate: string;
  isOverdue: boolean;
  overdueDays?: number;
  responsiblePerson: string;
  responsibleRole: string;
  department: string;
  status: RecoveryHealthStatus;
  lastPaymentDate?: string;
  lastPaymentAmount?: string;
  milestones: MilestoneRecoverySchedule[];
  recoveryNotes?: string;
}

export interface RecoveryCategorySummary {
  category: ContractCategory;
  committedExpenses: string;
  recoveredAmount: string;
  outstandingRecovery: string;
  recoveryRate: number;
  overdueAccounts: number;
  status: 'Healthy' | 'Attention Required' | 'Action Needed';
}
