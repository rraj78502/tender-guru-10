
import { Committee, CommitteeMember, CommitteeTask, SpecificationReview } from "@/types/committee";

export const mockMembers: CommitteeMember[] = [
  {
    id: 1,
    employeeId: "EMP001",
    name: "John Smith",
    email: "john.smith@company.com",
    phone: "+1234567890",
    role: "chairperson",
    department: "Technical",
    tasks: [],
  },
  {
    id: 2,
    employeeId: "EMP002",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    phone: "+1234567891",
    role: "secretary",
    department: "Procurement",
    tasks: [],
  },
  {
    id: 3,
    employeeId: "EMP003",
    name: "Mike Wilson",
    email: "mike.w@company.com",
    phone: "+1234567892",
    role: "member",
    department: "Finance",
    tasks: [],
  },
];

export const mockTasks: CommitteeTask[] = [
  {
    id: 1,
    title: "Initial Specification Draft",
    description: "Prepare initial draft of technical specifications",
    assignedTo: 1,
    dueDate: "2024-04-15",
    status: "in_progress",
    attachments: [],
    comments: ["First draft completed", "Pending review from technical team"],
  },
  {
    id: 2,
    title: "Cost Analysis",
    description: "Analyze and document cost implications",
    assignedTo: 3,
    dueDate: "2024-04-20",
    status: "pending",
    attachments: [],
    comments: [],
  },
  {
    id: 3,
    title: "Documentation Review",
    description: "Review and finalize all documentation",
    assignedTo: 2,
    dueDate: "2024-04-25",
    status: "pending",
    attachments: [],
    comments: [],
  },
];

export const mockReviews: SpecificationReview[] = [
  {
    id: 1,
    committeeId: 1,
    scheduledDate: "2024-04-10",
    actualDate: "2024-04-10",
    minutes: "Initial review completed. Major points discussed:\n1. Technical specifications alignment\n2. Budget considerations\n3. Timeline feasibility",
    status: "under_review",
    reviewers: mockMembers,
    documents: [],
    comments: [
      "Technical specifications need more detail",
      "Budget estimates to be revised",
    ],
  },
  {
    id: 2,
    committeeId: 1,
    scheduledDate: "2024-04-20",
    status: "draft",
    reviewers: mockMembers.slice(0, 2),
    documents: [],
    comments: [],
  },
];

export const mockCommittees: Committee[] = [
  {
    id: 1,
    name: "Network Infrastructure Upgrade Committee",
    formationDate: "2024-03-01",
    purpose: "Review and prepare specifications for network infrastructure upgrade project",
    members: mockMembers,
    tasks: mockTasks,
    specifications: {
      submissionDate: "2024-04-30",
      documents: [],
      status: "draft",
    },
    reviews: mockReviews,
    approvalStatus: "pending",
  },
  {
    id: 2,
    name: "Data Center Equipment Committee",
    formationDate: "2024-03-15",
    purpose: "Prepare specifications for new data center equipment",
    members: mockMembers.slice(1),
    tasks: mockTasks.slice(0, 2),
    specifications: {
      submissionDate: "2024-05-15",
      documents: [],
      status: "draft",
    },
    reviews: [],
    approvalStatus: "draft",
  },
];
