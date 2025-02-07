
import React from "react";
import { CheckCircle, Clock, Mail, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Notification } from "@/types/notification";

interface NotificationItemProps {
  notification: Notification;
  onClick: (id: number) => void;
}

export const NotificationItem = ({ notification, onClick }: NotificationItemProps) => {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'status_change':
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      case 'deadline':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: Notification['type'], read: boolean) => {
    if (read) return 'bg-gray-50';
    
    switch (type) {
      case 'status_change':
        return 'bg-purple-50 border-l-4 border-purple-500';
      case 'deadline':
        return 'bg-orange-50 border-l-4 border-orange-500';
      case 'email':
        return 'bg-blue-50 border-l-4 border-blue-500';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div
      className={`mb-2 p-3 cursor-pointer transition-colors ${
        getNotificationColor(notification.type, notification.read)
      }`}
      onClick={() => onClick(notification.id)}
    >
      <div className="flex items-start gap-3">
        {getNotificationIcon(notification.type)}
        <div className="space-y-1 flex-1">
          <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
            {notification.message}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(notification.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <Badge 
          variant={notification.read ? "secondary" : "default"}
          className="text-xs"
        >
          {notification.type.replace('_', ' ')}
        </Badge>
      </div>
    </div>
  );
};
