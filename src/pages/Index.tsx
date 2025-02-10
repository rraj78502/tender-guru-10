
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Welcome from "@/components/home/Welcome";
import QuickActions from "@/components/home/QuickActions";
import DashboardContent from "@/components/home/DashboardContent";
import Modals from "@/components/home/Modals";
import NotificationCenter from "@/components/review/NotificationCenter";
import VendorDashboard from "@/components/vendor/VendorDashboard";
import TenderList from "@/components/tender/TenderList";
import ProcurementManagement from "@/components/procurement/ProcurementManagement";
import BidEvaluationModule from "@/components/evaluation/BidEvaluationModule";
import ClarificationManager from "@/components/procurement/ClarificationManager";
import ComplaintManagement from "@/components/complaint/ComplaintManagement";
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

        <QuickActions 
          onShowCommitteeForm={() => setShowCommitteeForm(true)}
          onShowTenderForm={() => setShowTenderForm(true)}
          onShowVendorForm={() => setShowVendorForm(true)}
          onShowComplaints={() => setShowComplaints(true)}
        />

        <div className="mt-8">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-white/50 backdrop-blur-sm p-1 rounded-lg">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="partners">Partners</TabsTrigger>
              <TabsTrigger value="tenders">Tenders</TabsTrigger>
              <TabsTrigger value="procurement">Procurement</TabsTrigger>
              <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
              <TabsTrigger value="clarifications">Clarifications</TabsTrigger>
              <TabsTrigger value="complaints">Complaints</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
              <DashboardContent />
            </TabsContent>

            <TabsContent value="partners">
              <VendorDashboard />
            </TabsContent>

            <TabsContent value="tenders">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
                <h1 className="text-3xl font-bold mb-6">Tender Management</h1>
                <TenderList />
              </div>
            </TabsContent>

            <TabsContent value="procurement">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
                <ProcurementManagement tenderId={1} />
              </div>
            </TabsContent>

            <TabsContent value="evaluation">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
                <BidEvaluationModule />
              </div>
            </TabsContent>

            <TabsContent value="clarifications">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
                <h1 className="text-3xl font-bold mb-6">Clarifications Management</h1>
                <ClarificationManager 
                  tenderId={1}
                  clarifications={[]}
                  onUpdate={() => {}}
                />
              </div>
            </TabsContent>

            <TabsContent value="complaints">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
                <ComplaintManagement />
              </div>
            </TabsContent>
          </Tabs>
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
