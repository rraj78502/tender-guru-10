
export interface Notification {
  id: number;
  message: string;
  read: boolean;
  timestamp: string;
  type: 'status_change' | 'deadline' | 'email';
  deadline?: string;
  reminderTime?: number; // Hours before deadline to remind
  reminderPreferences?: {
    email: boolean;
    inApp: boolean;
    customTime?: number; // Custom hours before deadline
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
