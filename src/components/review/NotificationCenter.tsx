
import React, { useState, useEffect } from "react";
import { Bell, Mail, Calendar, Clock, CheckCircle, AlertCircle, Trash2, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const [filter, setFilter] = useState<'all' | 'status_change' | 'deadline' | 'email'>('all');
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      setLocalNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleMarkAsRead = (id: number) => {
    onMarkAsRead?.(id);
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
    setIsOpen(false);
  };

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

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' ? true : notification.type === filter
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleClearAll = () => {
    localStorage.removeItem('notifications');
    setLocalNotifications([]);
    toast({
      title: "Notifications cleared",
      description: "All notifications have been cleared.",
    });
  };

  const groupNotificationsByDate = (notifications: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {};
    notifications.forEach(notification => {
      const date = new Date(notification.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });
    return groups;
  };

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

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
        <div className="p-2 flex items-center justify-between border-b">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-gray-100' : ''}
            >
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter('status_change')}
              className={filter === 'status_change' ? 'bg-purple-100' : ''}
            >
              Status
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter('deadline')}
              className={filter === 'deadline' ? 'bg-orange-100' : ''}
            >
              Deadlines
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter('email')}
              className={filter === 'email' ? 'bg-blue-100' : ''}
            >
              Emails
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="h-[400px]">
          {Object.entries(groupedNotifications).length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No notifications
            </div>
          ) : (
            Object.entries(groupedNotifications).map(([date, notifications]) => (
              <div key={date}>
                <div className="sticky top-0 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500">
                  {date}
                </div>
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`mb-2 p-3 cursor-pointer transition-colors ${
                      getNotificationColor(notification.type, notification.read)
                    }`}
                    onClick={() => handleMarkAsRead(notification.id)}
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
                  </DropdownMenuItem>
                ))}
              </div>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationCenter;

