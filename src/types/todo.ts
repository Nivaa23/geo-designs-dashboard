export type ToDoCategory =
  | 'Daily Activities'
  | 'Minor Corrections'
  | 'Project Requirement Updates'
  | 'Important Communications'
  | 'Critical Timeline Allocation';

export type ToDoStatus = 'Pending' | 'In Progress' | 'In Review' | 'Completed';

export type ToDoPriority = 'Critical' | 'High' | 'Normal';

export interface ToDoItem {
  id: string;
  code: string;
  title: string;
  description: string;
  category: ToDoCategory;
  priority: ToDoPriority;
  status: ToDoStatus;
  assignedTo: string;
  department: string;
  projectContext?: string;
  targetTime: string;
  date: string;
  timestamp: number;
  timelineAllocation: string;
  commentsCount: number;
  correctionDetails?: string;
  requirementUpdateNote?: string;
}

export interface ChatMessage {
  id: string;
  taskId?: string;
  taskCode?: string;
  senderName: string;
  senderRole: string;
  timestamp: string;
  messageText: string;
  isCurrentUser: boolean;
  priorityTag?: 'Critical' | 'Important' | 'Normal';
}
