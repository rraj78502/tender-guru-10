
import { useState } from "react";
import Welcome from "@/components/home/Welcome";
import QuickActions from "@/components/home/QuickActions";
import DashboardContent from "@/components/home/DashboardContent";
import Modals from "@/components/home/Modals";
import NotificationCenter from "@/components/review/NotificationCenter";
import type { Notification } from "@/types/notification";

const Index = () => {
  const [showCommitteeForm, setShowCommitteeForm] = useState(false);
  const [showTenderForm, setShowTenderForm] = useState(false);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [showComplaints, setShowComplaints] = useState(false);

  // Mock notifications data with deadline information
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "New tender specification submitted for review",
      read: false,
      timestamp: new Date().toISOString(),
      type: 'status_change' as const,
    },
    {
      id: 2,
      message: "Deadline approaching: Network Equipment Specification Review",
      read: false,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'deadline' as const,
      deadline: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
      reminderTime: 24,
      reminderPreferences: {
        email: true,
        inApp: true,
      },
    },
    {
      id: 3,
      message: "Tender status updated to 'Published'",
      read: true,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      type: 'status_change' as const,
    },
  ]);

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleUpdateReminderPreferences = (id: number, preferences: Notification['reminderPreferences']) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, reminderPreferences: preferences } : notification
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Welcome />
          <NotificationCenter 
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onUpdateReminderPreferences={handleUpdateReminderPreferences}
          />
        </div>

        <QuickActions 
          onShowCommitteeForm={() => setShowCommitteeForm(true)}
          onShowTenderForm={() => setShowTenderForm(true)}
          onShowVendorForm={() => setShowVendorForm(true)}
          onShowComplaints={() => setShowComplaints(true)}
        />

        <DashboardContent />

        <Modals 
          showComplaints={showComplaints}
          showCommitteeForm={showCommitteeForm}
          showTenderForm={showTenderForm}
          showVendorForm={showVendorForm}
          onCloseComplaints={() => setShowComplaints(false)}
          onCloseCommitteeForm={() => setShowCommitteeForm(false)}
          onCloseTenderForm={() => setShowTenderForm(false)}
          onCloseVendorForm={() => setShowVendorForm(false)}
        />
      </div>
    </div>
  );
};

export default Index;
