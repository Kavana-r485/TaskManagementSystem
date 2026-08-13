export type TaskStatus = 'to_do' | 'doing' | 'completed' | 'on_hold';
export type Priority = 'no_priority' | 'urgent' | 'high' | 'medium' | 'low';

export interface Member {
  _id: string;
  fullName: string;
  username?: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  members: Member[];
  labels: string[];
  dueDate?: string;
  project?: string;
  createdAt: string;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  to_do: 'To Do',
  doing: 'Doing',
  completed: 'Completed',
  on_hold: 'On Hold',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  no_priority: 'No Priority',
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

// Matches the red/orange/gray priority coloring seen on the board & list views
export const PRIORITY_COLORS: Record<Priority, string> = {
  no_priority: 'text-gray-400',
  urgent: 'text-red-600',
  high: 'text-red-500',
  medium: 'text-amber-500',
  low: 'text-gray-400',
};
