
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/types/auth";
import DashboardContent from "@/components/home/DashboardContent";
import VendorDashboard from "@/components/vendor/VendorDashboard";
import TenderList from "@/components/tender/TenderList";
import ProcurementManagement from "@/components/procurement/ProcurementManagement";
import BidEvaluationModule from "@/components/evaluation/BidEvaluationModule";
import ClarificationManager from "@/components/procurement/ClarificationManager";
import ComplaintManagement from "@/components/complaint/ComplaintManagement";
import EmployeeManagement from "@/components/employee/EmployeeManagement";

interface RoleBasedTabsProps {
  user: User | null;
  defaultTab: string;
}

const RoleBasedTabs = ({ user, defaultTab }: RoleBasedTabsProps) => {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="w-full justify-start mb-6 bg-white/50 backdrop-blur-sm p-1 rounded-lg">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        {(user?.role === 'admin' || user?.role === 'procurement_officer') && (
          <TabsTrigger value="partners">Partners</TabsTrigger>
        )}
        <TabsTrigger value="tenders">Tenders</TabsTrigger>
        {(user?.role === 'admin' || user?.role === 'committee_member') && (
          <TabsTrigger value="procurement">Procurement</TabsTrigger>
        )}
        {(user?.role === 'admin' || user?.role === 'evaluator') && (
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
        )}
        <TabsTrigger value="clarifications">Clarifications</TabsTrigger>
        {user?.role === 'admin' && (
          <>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
          </>
        )}
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

      <TabsContent value="employees">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-6">
          <EmployeeManagement />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default RoleBasedTabs;

