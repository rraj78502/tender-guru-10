
import React from "react";
import { Bell } from "lucide-react";

interface Notification {
  id: number;
  message: string;
  read: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
}

const NotificationCenter = ({ notifications }: NotificationCenterProps) => {
  return (
    <div className="relative">
      <Bell className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" />
      {notifications.some(n => !n.read) && (
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
      )}
    </div>
  );
};

export default NotificationCenter;
