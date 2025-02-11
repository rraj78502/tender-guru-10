
import { Notification } from "@/types/notification";
import NotificationCenter from "@/components/review/NotificationCenter";
import Welcome from "@/components/home/Welcome";

interface NotificationHandlerProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onUpdateReminderPreferences: (id: number, preferences: Notification['reminderPreferences']) => void;
}

const NotificationHandler = ({
  notifications,
  onMarkAsRead,
  onUpdateReminderPreferences
}: NotificationHandlerProps) => {
  return (
    <div className="flex justify-between items-start mb-8">
      <div className="flex-1">
        <Welcome />
      </div>
      <div className="ml-4">
        <NotificationCenter 
          notifications={notifications}
          onMarkAsRead={onMarkAsRead}
          onUpdateReminderPreferences={onUpdateReminderPreferences}
        />
      </div>
    </div>
  );
};

export default NotificationHandler;
