
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import QuickActions from "@/components/home/QuickActions";
import Modals from "@/components/home/Modals";
import type { Notification } from "@/types/notification";
import { mockNotifications } from "@/mock/committeeNotifications";
import { useAuthNavigation } from "@/hooks/useAuthNavigation";
import NotificationHandler from "@/components/home/NotificationHandler";
import RoleBasedTabs from "@/components/home/RoleBasedTabs";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { exportToCSV } from "@/utils/exportUtils";

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const { defaultTab } = useAuthNavigation(isAuthenticated, user);
  const [showCommitteeForm, setShowCommitteeForm] = useState(false);
  const [showTenderForm, setShowTenderForm] = useState(false);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [showComplaints, setShowComplaints] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleExport = () => {
    exportToCSV(notifications, 'notifications');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <Button
            onClick={handleExport}
            variant="outline"
            className="ml-4"
          >
            Export Data
          </Button>
        </div>

        <NotificationHandler
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onUpdateReminderPreferences={handleUpdateReminderPreferences}
        />

        {user?.role === 'admin' && (
          <QuickActions 
            onShowCommitteeForm={() => setShowCommitteeForm(true)}
            onShowTenderForm={() => setShowTenderForm(true)}
            onShowVendorForm={() => setShowVendorForm(true)}
            onShowComplaints={() => setShowComplaints(true)}
          />
        )}

        <div className="mb-8">
          <DashboardStats />
        </div>

        <div className="mt-8">
          <RoleBasedTabs user={user} defaultTab={defaultTab} />
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
