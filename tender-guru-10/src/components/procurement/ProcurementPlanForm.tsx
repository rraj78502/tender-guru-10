import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ProcurementPlan, QuarterlyTarget } from "@/types/procurement-plan";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProcurementPlanFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (plan: Omit<ProcurementPlan, '_id' | 'createdAt' | 'createdBy'>) => void;
}

type FormQuarterlyTarget = {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  target_details: string;
  status: 'Planned' | 'In Progress' | 'Completed';
  created_at: string;
};

interface FormData {
  policy_number: string;
  department: 'Wireline' | 'Wireless';
  project_name: string;
  project_description: string;
  estimated_cost: number;
  proposed_budget: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  quarterly_targets: FormQuarterlyTarget[];
  shouldNotify: boolean;
}

const INITIAL_QUARTERLY_TARGETS: FormQuarterlyTarget[] = [
  { quarter: 'Q1', target_details: '', status: 'Planned', created_at: new Date().toISOString() },
  { quarter: 'Q2', target_details: '', status: 'Planned', created_at: new Date().toISOString() },
  { quarter: 'Q3', target_details: '', status: 'Planned', created_at: new Date().toISOString() },
  { quarter: 'Q4', target_details: '', status: 'Planned', created_at: new Date().toISOString() },
];

const DEPARTMENT_MAP: { [key: number]: 'Wireline' | 'Wireless' } = {
  1: 'Wireline',
  2: 'Wireless',
};

const ProcurementPlanForm: React.FC<ProcurementPlanFormProps> = ({ open, onClose, onSubmit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState<FormData>({
    policy_number: '',
    department: 'Wireline',
    project_name: '',
    project_description: '',
    estimated_cost: 0,
    proposed_budget: 0,
    status: 'draft',
    quarterly_targets: INITIAL_QUARTERLY_TARGETS,
    shouldNotify: false,
  });

  const [departmentIndex, setDepartmentIndex] = React.useState<1 | 2>(1);

  useEffect(() => {
    const fetchPolicyNumber = async () => {
      const token = localStorage.getItem('token');
      console.log('Token being sent:', token);
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/procurement-plans/generate-policy-number?department=${departmentIndex}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status === 'success') {
          setFormData(prev => ({ ...prev, policy_number: data.data.policyNumber }));
        } else {
          throw new Error('Unexpected response from server');
        }
      } catch (error) {
        console.error('Error fetching policy number:', error);
        toast({
          title: "Error",
          description: `Failed to generate policy number: ${error.message}`,
          variant: "destructive"
        });
        setFormData(prev => ({ ...prev, policy_number: 'PP-2025-0001-1-N-1' }));
      }
    };

    if (open) {
      fetchPolicyNumber();
    }
  }, [open, toast, departmentIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('cost') || name.includes('budget') ? Number(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleQuarterlyTargetChange = (
    quarter: string,
    field: 'target_details' | 'status',
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      quarterly_targets: prev.quarterly_targets.map(target =>
        target.quarter === quarter ? { ...target, [field]: value } : target
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.policy_number || !formData.project_name || !formData.project_description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.estimated_cost <= 0 || formData.proposed_budget <= 0) {
      toast({
        title: "Validation Error",
        description: "Estimated cost and proposed budget must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    const proposedBudgetPercentage = (formData.proposed_budget / formData.estimated_cost) * 100;

    const newPlan: Omit<ProcurementPlan, '_id' | 'createdAt' | 'createdBy'> = {
      policy_number: formData.policy_number,
      department: DEPARTMENT_MAP[departmentIndex],
      project_name: formData.project_name,
      project_description: formData.project_description,
      estimated_cost: formData.estimated_cost,
      proposed_budget: formData.proposed_budget,
      proposed_budget_percentage: Math.round(proposedBudgetPercentage),
      status: formData.status,
      quarterly_targets: formData.quarterly_targets,
      shouldNotify: formData.shouldNotify,
    };

    try {
      const token = localStorage.getItem('token');
      console.log('Token being sent for submission:', token);
      const response = await fetch('http://localhost:5000/api/v1/procurement-plans/createprocurementplan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newPlan),
      });

      const result = await response.json();
      if (response.ok) {
        toast({ title: "Success", description: "Plan created successfully" });
        onSubmit(result.data.procurementPlan);
        onClose();
        setFormData({
          policy_number: '',
          department: 'Wireline',
          project_name: '',
          project_description: '',
          estimated_cost: 0,
          proposed_budget: 0,
          status: 'draft',
          quarterly_targets: INITIAL_QUARTERLY_TARGETS,
          shouldNotify: false,
        });
        setDepartmentIndex(1);
      } else {
        toast({ title: "Error", description: result.message || "Failed to create plan", variant: "destructive" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full md:max-w-4xl lg:max-w-6xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Procurement Plan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="policy_number">Policy Number*</Label>
                <Input
                  id="policy_number"
                  name="policy_number"
                  value={formData.policy_number}
                  onChange={handleInputChange}
                  placeholder="PP-2080-1-N-1"
                  required
                  readOnly
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="project_name">Project Name*</Label>
                <Input
                  id="project_name"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleInputChange}
                  placeholder="Enter project name"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="department">Department*</Label>
                <Select
                  value={departmentIndex === 1 ? 'Wireline' : 'Wireless'}
                  onValueChange={(value: 'Wireline' | 'Wireless') => setDepartmentIndex(value === 'Wireline' ? 1 : 2)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wireline">Wireline</SelectItem>
                    <SelectItem value="Wireless">Wireless</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'draft' | 'submitted' | 'approved' | 'rejected') => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="estimated_cost">Estimated Cost (NPR)*</Label>
                <Input
                  id="estimated_cost"
                  name="estimated_cost"
                  type="number"
                  value={formData.estimated_cost}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="proposed_budget">Proposed Budget (NPR)*</Label>
                <Input
                  id="proposed_budget"
                  name="proposed_budget"
                  type="number"
                  value={formData.proposed_budget}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="project_description">Project Description*</Label>
                <Textarea
                  id="project_description"
                  name="project_description"
                  value={formData.project_description}
                  onChange={handleInputChange}
                  placeholder="Enter project description"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="shouldNotify">Notify Admins</Label>
                <input
                  id="shouldNotify"
                  name="shouldNotify"
                  type="checkbox"
                  checked={formData.shouldNotify}
                  onChange={handleCheckboxChange}
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Label className="text-lg font-semibold">Quarterly Targets</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {formData.quarterly_targets.map((target) => (
                <div key={target.quarter} className="space-y-2">
                  <Label htmlFor={`target_${target.quarter}`}>{target.quarter} Target Details</Label>
                  <Input
                    id={`target_${target.quarter}`}
                    value={target.target_details}
                    onChange={(e) => handleQuarterlyTargetChange(target.quarter, 'target_details', e.target.value)}
                    placeholder={`Enter ${target.quarter} target details`}
                  />
                  <Select
                    value={target.status}
                    onValueChange={(value: 'Planned' | 'In Progress' | 'Completed') =>
                      handleQuarterlyTargetChange(target.quarter, 'status', value)
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planned">Planned</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProcurementPlanForm;