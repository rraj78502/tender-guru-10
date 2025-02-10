
import { User, UserRole } from "@/types/auth";

export const mockUsers: User[] = [
  {
    id: 1,
    name: "John Admin",
    email: "admin@ntc.net.np",
    role: "admin",
    employeeId: "NTC001",
    department: "Administration",
    permissions: ["manage_users", "manage_tenders", "manage_committees", "view_reports"]
  },
  {
    id: 2,
    name: "Sarah Procurement",
    email: "procurement@ntc.net.np",
    role: "procurement_officer",
    employeeId: "NTC002",
    department: "Procurement",
    permissions: ["create_tender", "manage_bids", "view_submissions"]
  },
  {
    id: 3,
    name: "Mike Committee",
    email: "committee@ntc.net.np",
    role: "committee_member",
    employeeId: "NTC003",
    department: "Technical",
    permissions: ["view_specifications", "submit_reviews", "attend_meetings"]
  }
];

export const rolePermissions = {
  admin: [
    "manage_users",
    "manage_tenders",
    "manage_committees",
    "view_reports",
    "manage_roles",
    "approve_documents"
  ],
  procurement_officer: [
    "create_tender",
    "manage_bids",
    "view_submissions",
    "manage_documents",
    "schedule_meetings"
  ],
  committee_member: [
    "view_specifications",
    "submit_reviews",
    "attend_meetings",
    "comment_documents"
  ],
  evaluator: [
    "view_bids",
    "submit_evaluations",
    "view_documents",
    "provide_feedback"
  ],
  bidder: [
    "view_tenders",
    "submit_bids",
    "view_clarifications",
    "request_information"
  ]
};
