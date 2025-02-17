
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProcurementPlan } from "@/types/procurement-plan";
import { format } from 'date-fns';
import { 
  Users, 
  FileText, 
  Search, 
  Building2, 
  FileCheck,
  MessageSquare,
  Clock,
  AlertCircle,
  ChevronRight 
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface ProcurementPlanViewProps {
  open: boolean;
  onClose: () => void;
  plan: ProcurementPlan;
}

const ProcurementPlanView: React.FC<ProcurementPlanViewProps> = ({ open, onClose, plan }) => {
  const navigate = useNavigate();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      maximumFractionDigits: 0
    }).format(amount);
  };

  const projectSections = [
    {
      title: "Committee",
      icon: Users,
      status: "Pending Formation",
      statusColor: "text-yellow-600",
      path: `/committees/${plan.id}`
    },
    {
      title: "Specification",
      icon: FileText,
      status: "Draft",
      statusColor: "text-blue-600",
      path: `/specification/${plan.id}`
    },
    {
      title: "Review",
      icon: Search,
      status: "Not Started",
      statusColor: "text-gray-600",
      path: `/review/${plan.id}`
    },
    {
      title: "Tender",
      icon: Building2,
      status: "Not Created",
      statusColor: "text-gray-600",
      path: `/tender/${plan.id}`
    },
    {
      title: "Evaluation",
      icon: FileCheck,
      status: "Pending",
      statusColor: "text-gray-600",
      path: `/evaluation/${plan.id}`
    },
    {
      title: "Complaints",
      icon: MessageSquare,
      status: "No Complaints",
      statusColor: "text-green-600",
      path: `/complaints/${plan.id}`
    }
  ];

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full md:max-w-4xl lg:max-w-6xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View Procurement Plan Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Project Timeline Indicator */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Clock className="h-4 w-4" />
              <span>Project Timeline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-medium">Planning Phase</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400">Committee Formation</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400">Specification</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400">Tender</span>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Policy Number</h3>
                <p className="text-gray-700">{plan.policy_number}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Department</h3>
                <p className="text-gray-700">{plan.department}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Project Name</h3>
                <p className="text-gray-700">{plan.project_name}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Created At</h3>
                <p className="text-gray-700">{format(new Date(plan.created_at), 'PPP')}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Estimated Cost</h3>
                <p className="text-gray-700">NPR {formatCurrency(plan.estimated_cost)}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Proposed Budget</h3>
                <p className="text-gray-700">NPR {formatCurrency(plan.proposed_budget)}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Budget Percentage</h3>
                <p className="text-gray-700">{plan.proposed_budget_percentage}%</p>
              </div>
            </div>
          </div>

          {/* Project Sections Quick Access */}
          <div>
            <h3 className="font-semibold mb-4">Project Sections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectSections.map((section) => (
                <button
                  key={section.title}
                  onClick={() => handleNavigate(section.path)}
                  className="flex items-center justify-between p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <section.icon className="h-5 w-5 text-gray-500" />
                    <div className="text-left">
                      <h4 className="font-medium">{section.title}</h4>
                      <p className={`text-sm ${section.statusColor}`}>{section.status}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Important Alerts */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h4 className="font-medium">Upcoming Deadline</h4>
                <p className="text-sm">Committee formation deadline in 5 days</p>
              </div>
            </div>
          </div>

          {/* Quarterly Targets */}
          <div>
            <h3 className="font-semibold mb-4">Quarterly Targets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plan.quarterly_targets.map((target) => (
                <div key={target.id} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">{target.quarter}</h4>
                  <p className="text-sm text-gray-600 mb-2">{target.target_details || "No details provided"}</p>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    target.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    target.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {target.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProcurementPlanView;
