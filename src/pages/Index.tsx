import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CommitteeForm from "@/components/CommitteeForm";
import CommitteeList from "@/components/CommitteeList";
import ReviewModule from "@/components/ReviewModule";
import TenderForm from "@/components/tender/TenderForm";
import TenderList from "@/components/tender/TenderList";
import VendorRegistrationForm from "@/components/vendor/VendorRegistrationForm";
import { Building2, FileText, Users, MessageSquare } from "lucide-react";
import NotificationCenter from "@/components/review/NotificationCenter";
import ComplaintManagement from "@/components/complaint/ComplaintManagement";
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

  // Mock review data
  const reviewData = {
    committeeId: 1,
    title: "Network Equipment Specification Review",
    submissionDate: "2024-04-01",
    status: "pending_review"
  };

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
          <div className="text-center mb-12 slide-in">
            <div className="inline-block px-3 py-1 mb-4 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
              Tender Management System
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to TenderFlow
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Streamline your tender process with our comprehensive management system
            </p>
          </div>
          <NotificationCenter 
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onUpdateReminderPreferences={handleUpdateReminderPreferences}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 glass-card fade-in hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-purple-500" />
              <h3 className="text-lg font-semibold">Committee Formation</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Create and manage specification committees
            </p>
            <Button 
              onClick={() => setShowCommitteeForm(true)}
              className="w-full"
            >
              Create Committee
            </Button>
          </Card>

          <Card className="p-6 glass-card fade-in hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-semibold">Active Tenders</h3>
            </div>
            <p className="text-gray-600 mb-4">
              View and manage ongoing tender processes
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowTenderForm(true)}
            >
              Create Tender
            </Button>
          </Card>

          <Card className="p-6 glass-card fade-in hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-semibold">Vendor Management</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Register and manage vendor profiles
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowVendorForm(true)}
            >
              Register Vendor
            </Button>
          </Card>

          <Card className="p-6 glass-card fade-in hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="h-6 w-6 text-orange-500" />
              <h3 className="text-lg font-semibold">Complaints</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Manage and track complaints
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowComplaints(true)}
            >
              View Complaints
            </Button>
          </Card>
        </div>

        <div className="mb-12">
          <TenderList />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Pending Reviews</h2>
            <ReviewModule {...reviewData} />
          </div>
          <div>
            <CommitteeList />
          </div>
        </div>

        {showComplaints && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Complaint Management</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowComplaints(false)}
                  >
                    Close
                  </Button>
                </div>
                <ComplaintManagement />
              </div>
            </Card>
          </div>
        )}

        {showCommitteeForm && (
          <CommitteeForm onClose={() => setShowCommitteeForm(false)} />
        )}

        {showTenderForm && (
          <TenderForm onClose={() => setShowTenderForm(false)} />
        )}

        {showVendorForm && (
          <VendorRegistrationForm onClose={() => setShowVendorForm(false)} />
        )}
      </div>
    </div>
  );
};

export default Index;
