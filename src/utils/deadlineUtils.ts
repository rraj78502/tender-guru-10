
import { Notification } from "@/types/notification";

export const checkUpcomingDeadlines = (notifications: Notification[]): Notification[] => {
  const now = new Date();
  const newNotifications: Notification[] = [];
  
  notifications
    .filter(n => n.type === 'deadline' && n.deadline && !n.read)
    .forEach(notification => {
      const deadline = new Date(notification.deadline!);
      const reminderTime = notification.reminderPreferences?.customTime || 
                          notification.reminderTime || 
                          24; // Default 24 hours
      const reminderDate = new Date(deadline.getTime() - (reminderTime * 60 * 60 * 1000));
      
      if (now >= reminderDate && now < deadline) {
        const hoursLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60));
        
        newNotifications.push({
          id: Date.now(),
          message: `Reminder: ${hoursLeft} hours left until deadline for ${notification.message}`,
          read: false,
          timestamp: new Date().toISOString(),
          type: 'deadline',
          deadline: notification.deadline,
          reminderTime: reminderTime,
          reminderPreferences: notification.reminderPreferences
        });
      }
    });
    
  return newNotifications;
};
