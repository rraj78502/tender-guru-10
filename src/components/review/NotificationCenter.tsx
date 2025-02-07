
import React, { useState } from "react";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: number;
  message: string;
  read: boolean;
  timestamp: string;
  type: 'status_change' | 'deadline' | 'email';
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead?: (id: number) => void;
}

const NotificationCenter = ({ notifications, onMarkAsRead }: NotificationCenterProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleMarkAsRead = (id: number) => {
    onMarkAsRead?.(id);
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
    setIsOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="relative">
        <Bell className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-80 bg-white" 
        align="end"
      >
        <ScrollArea className="h-[300px] p-4">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`mb-2 p-3 cursor-pointer rounded-lg transition-colors ${
                  notification.read ? 'bg-gray-50' : 'bg-blue-50'
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="space-y-1">
                  <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationCenter;
