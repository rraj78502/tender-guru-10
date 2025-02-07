
export interface Notification {
  id: number;
  message: string;
  read: boolean;
  timestamp: string;
  type: 'status_change' | 'deadline' | 'email';
  deadline?: string; // Optional deadline date for deadline notifications
  reminderTime?: number; // Hours before deadline to remind
}

export interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead?: (id: number) => void;
}

export interface DeadlineNotification {
  id: number;
  title: string;
  deadline: string;
  reminderTime: number;
}

