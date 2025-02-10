
import type { Notification } from "@/types/notification";

export const mockNotifications: Notification[] = [
  {
    id: 1,
    message: "New committee formation: Network Infrastructure Committee",
    read: false,
    timestamp: new Date().toISOString(),
    type: "committee",
    committeeInfo: {
      committeeId: 1,
      formationDate: "2024-03-01",
      submissionDate: "2024-04-15",
      role: "chairperson",
    }
  },
  {
    id: 2,
    message: "Specification review scheduled for Network Infrastructure Project",
    read: false,
    timestamp: new Date().toISOString(),
    type: "committee",
    committeeInfo: {
      committeeId: 1,
      formationDate: "2024-03-01",
      submissionDate: "2024-04-15",
      role: "member",
    }
  }
];

export const sendNotification = (userId: number, message: string, type: 'email' | 'sms') => {
  console.log(`Sending ${type} to user ${userId}: ${message}`);
  // In a real implementation, this would integrate with an email/SMS service
};

export const createCommitteeNotification = (
  message: string,
  committeeId: number,
  formationDate: string,
  submissionDate: string,
  role: 'member' | 'chairperson' | 'secretary'
): Notification => {
  return {
    id: Date.now(),
    message,
    read: false,
    timestamp: new Date().toISOString(),
    type: "committee",
    committeeInfo: {
      committeeId,
      formationDate,
      submissionDate,
      role,
    }
  };
};
