
import { useState } from "react";
import Welcome from "@/components/home/Welcome";
import QuickActions from "@/components/home/QuickActions";
import DashboardContent from "@/components/home/DashboardContent";
import Modals from "@/components/home/Modals";
import NotificationCenter from "@/components/review/NotificationCenter";
import type { Notification } from "@/types/notification";
import { mockNotifications } from "@/mock/committeeNotifications";

const Index = () => {
  const [showCommitteeForm, setShowCommitteeForm] = useState(false);
  const [showTenderForm, setShowTenderForm] = useState(false);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [showComplaints, setShowComplaints] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <Welcome />
          </div>
          <div className="ml-4">
            <NotificationCenter 
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onUpdateReminderPreferences={handleUpdateReminderPreferences}
            />
          </div>
        </div>

        <div className="space-y-8">
          <QuickActions 
            onShowCommitteeForm={() => setShowCommitteeForm(true)}
            onShowTenderForm={() => setShowTenderForm(true)}
            onShowVendorForm={() => setShowVendorForm(true)}
            onShowComplaints={() => setShowComplaints(true)}
          />

          <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
            <DashboardContent />
          </div>
        </div>

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
