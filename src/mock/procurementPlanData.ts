
import { ProcurementPlan } from "@/types/procurement-plan";

export const mockProcurementPlans: ProcurementPlan[] = [
  {
    id: 1,
    policy_number: "PP-2080-WL-N-01",
    department: "Wireline",
    project_name: "LTE Upgrade",
    project_description: "Network infrastructure upgrade for LTE services in central region",
    estimated_cost: 543280000,
    proposed_budget: 217312000,
    proposed_budget_percentage: 40,
    created_at: "2024-03-15T10:00:00Z",
    quarterly_targets: [
      {
        id: 1,
        procurement_plan_id: 1,
        quarter: "Q1",
        target_details: "Initial planning and vendor selection",
        status: "Completed",
        created_at: "2024-03-15T10:00:00Z"
      },
      {
        id: 2,
        procurement_plan_id: 1,
        quarter: "Q2",
        target_details: "Equipment procurement and delivery",
        status: "In Progress",
        created_at: "2024-03-15T10:00:00Z"
      },
      {
        id: 3,
        procurement_plan_id: 1,
        quarter: "Q3",
        target_details: "Installation and testing",
        status: "Planned",
        created_at: "2024-03-15T10:00:00Z"
      },
      {
        id: 4,
        procurement_plan_id: 1,
        quarter: "Q4",
        target_details: "Network optimization and project closure",
        status: "Planned",
        created_at: "2024-03-15T10:00:00Z"
      }
    ]
  },
  {
    id: 2,
    policy_number: "PP-2080-WL-O-01",
    department: "Wireless",
    project_name: "2G Expansion",
    project_description: "2G network expansion in rural areas of western region",
    estimated_cost: 107900000,
    proposed_budget: 102505000,
    proposed_budget_percentage: 95,
    created_at: "2024-03-16T09:00:00Z",
    quarterly_targets: [
      {
        id: 5,
        procurement_plan_id: 2,
        quarter: "Q1",
        target_details: "Site survey and planning",
        status: "Completed",
        created_at: "2024-03-16T09:00:00Z"
      },
      {
        id: 6,
        procurement_plan_id: 2,
        quarter: "Q2",
        target_details: "Equipment procurement",
        status: "Completed",
        created_at: "2024-03-16T09:00:00Z"
      },
      {
        id: 7,
        procurement_plan_id: 2,
        quarter: "Q3",
        target_details: "Installation phase",
        status: "In Progress",
        created_at: "2024-03-16T09:00:00Z"
      },
      {
        id: 8,
        procurement_plan_id: 2,
        quarter: "Q4",
        target_details: "Testing and optimization",
        status: "Planned",
        created_at: "2024-03-16T09:00:00Z"
      }
    ]
  }
];
