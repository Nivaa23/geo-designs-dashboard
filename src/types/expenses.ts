export type ExpenseCategory =
  | 'Operational Site Expenses'
  | 'Laboratory Equipment & Testing'
  | 'Field Disbursements'
  | 'Travel & Site Logistics'
  | 'Survey Consumables & Spares';

export type ExpenseStatus =
  | 'Approved'
  | 'Under Review'
  | 'Submitted'
  | 'Rejected';

export type ExpensePaymentStatus =
  | 'Disbursed'
  | 'Pending Reimbursement'
  | 'Processing';

export interface ExpenseAuditStep {
  stage: string;
  timestamp: string;
  actor: string;
  status: 'completed' | 'in-progress' | 'pending';
  note?: string;
}

export interface ExpenseRecord {
  id: string;
  projectCode: string;
  projectName: string;
  client: string;
  category: ExpenseCategory;
  amount: string;
  numericalAmount: number;
  date: string;
  rawDate: string;
  employeeName: string;
  employeeRole: string;
  department: string;
  description: string;
  supportingDocument: string;
  documentSize?: string;
  status: ExpenseStatus;
  paymentStatus: ExpensePaymentStatus;
  approvedBy?: string;
  approvalDate?: string;
  remarks?: string;
  auditTrail: ExpenseAuditStep[];
}

export interface ExpenseCategorySummary {
  category: ExpenseCategory;
  totalAmount: string;
  numericalTotal: number;
  count: number;
  percentage: number;
  color: string;
}
