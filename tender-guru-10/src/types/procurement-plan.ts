export interface QuarterlyTarget {
  _id?: string; // Added for MongoDB document ID
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  target_details: string;
  status: 'Planned' | 'In Progress' | 'Completed';
  created_at: string; // ISO date string from backend
}

export interface CreatedBy {
  _id: string;
  name: string;
  email: string;
  role: string;
  employeeId: string;
}

export interface ProcurementPlan {
  _id: string; // MongoDB document ID
  policy_number: string;
  department: 'Wireline' | 'Wireless';
  project_name: string;
  project_description: string;
  estimated_cost: number;
  proposed_budget: number;
  proposed_budget_percentage: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdBy: CreatedBy; // Populated user object
  createdAt: string; // ISO date string from backend
  quarterly_targets: QuarterlyTarget[];
  shouldNotify?: boolean;
  committee_id?: string; // Optional, used in ProcurementPlanView
}