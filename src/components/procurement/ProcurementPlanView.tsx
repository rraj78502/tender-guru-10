
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProcurementPlan } from "@/types/procurement-plan";
import { format } from 'date-fns';

interface ProcurementPlanViewProps {
  open: boolean;
  onClose: () => void;
  plan: ProcurementPlan;
}

const ProcurementPlanView: React.FC<ProcurementPlanViewProps> = ({ open, onClose, plan }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full md:max-w-4xl lg:max-w-6xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View Procurement Plan Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
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

          <div>
            <h3 className="font-semibold mb-3">Project Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{plan.project_description}</p>
          </div>

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
