
import { Notification, CommitteeMember, Committee, CommitteeTask } from "@/types/notification";

export const checkUpcomingDeadlines = (notifications: Notification[]): Notification[] => {
  const now = new Date();
  const newNotifications: Notification[] = [];
  
  notifications
    .filter(n => (n.type === 'deadline' || n.type === 'committee') && n.deadline && !n.read)
    .forEach(notification => {
      const deadline = new Date(notification.deadline!);
      const reminderTime = notification.reminderPreferences?.customTime || 
                          notification.reminderTime || 
                          24; // Default 24 hours
      const reminderDate = new Date(deadline.getTime() - (reminderTime * 60 * 60 * 1000));
      
      if (now >= reminderDate && now < deadline) {
        const hoursLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60));
        
        if (notification.type === 'committee' && notification.committeeInfo) {
          newNotifications.push({
            id: Date.now(),
            message: `Committee Reminder: ${hoursLeft} hours left until ${notification.message}`,
            read: false,
            timestamp: new Date().toISOString(),
            type: 'committee',
            deadline: notification.deadline,
            reminderTime: reminderTime,
            reminderPreferences: notification.reminderPreferences,
            committeeInfo: notification.committeeInfo
          });
        } else {
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
      }
    });
    
  return newNotifications;
};

export const createCommitteeNotification = (
  committee: Committee,
  member: CommitteeMember,
  task?: CommitteeTask
): Notification => {
  const baseNotification = {
    id: Date.now(),
    read: false,
    timestamp: new Date().toISOString(),
    type: 'committee' as const,
    committeeInfo: {
      committeeId: committee.id,
      formationDate: committee.formationDate,
      submissionDate: committee.specificationDate,
      role: member.role,
      taskId: task?.id
    }
  };

  if (task) {
    return {
      ...baseNotification,
      message: `New task assigned: ${task.title}`,
      deadline: task.dueDate,
      reminderTime: 24,
      reminderPreferences: {
        email: true,
        inApp: true
      }
    };
  }

  return {
    ...baseNotification,
    message: `You have been assigned as ${member.role} to a new committee`,
    deadline: committee.specificationDate,
    reminderTime: 48,
    reminderPreferences: {
      email: true,
      inApp: true
    }
  };
};
