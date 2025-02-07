
export interface Notification {
  id: number;
  message: string;
  read: boolean;
  timestamp: string;
  type: 'status_change' | 'deadline' | 'email';
}

export interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead?: (id: number) => void;
}
