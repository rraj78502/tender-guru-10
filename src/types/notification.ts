
export interface Notification {
  id: number;
  message: string;
  read: boolean;
  timestamp: string;
  type: 'status_change' | 'deadline' | 'email' | 'committee';
  deadline?: string;
  reminderTime?: number;
  reminderPreferences?: {
    email: boolean;
    inApp: boolean;
    customTime?: number;
  };
  committeeInfo?: {
    committeeId: number;
    formationDate: string;
    submissionDate: string;
    role: 'member' | 'chairperson' | 'secretary';
    taskId?: number;
  };
}

export interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead?: (id: number) => void;
  onUpdateReminderPreferences?: (id: number, preferences: Notification['reminderPreferences']) => void;
}

export interface DeadlineNotification {
  id: number;
  title: string;
  deadline: string;
  reminderTime: number;
}

export interface CommitteeMember {
  id: number;
  employeeId: string;
  name: string;
  role: 'member' | 'chairperson' | 'secretary';
  email?: string;
  phone?: string;
  department?: string;
  tasks?: CommitteeTask[];
}

export interface CommitteeTask {
  id: number;
  title: string;
  description: string;
  assignedTo: number;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  documents?: File[];
}

export interface Committee {
  id: number;
  formationDate: string;
  specificationDate: string;
  reviewDate: string;
  members: CommitteeMember[];
  documents: File[];
  tasks: CommitteeTask[];
  status: 'active' | 'completed' | 'archived';
}
