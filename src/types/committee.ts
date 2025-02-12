
export type CommitteeTaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type CommitteeApprovalStatus = 'draft' | 'pending' | 'pending_review' | 'approved' | 'rejected';
export type DocumentStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

export interface CommitteeTask {
  id: number;
  title: string;
  description: string;
  assignedTo: number; // memberId
  dueDate: string;
  status: CommitteeTaskStatus;
  attachments?: File[];
  comments?: string[];
}

export interface CommitteeMember {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  role: 'chairperson' | 'member' | 'secretary';
  department: string;
  tasks: CommitteeTask[];
}

export interface SpecificationReview {
  id: number;
  committeeId: number;
  scheduledDate: string;
  actualDate?: string;
  minutes?: string;
  status: DocumentStatus;
  reviewers: CommitteeMember[];
  documents: File[];
  comments: string[];
}

export interface Committee {
  id: number;
  name: string;
  formationDate: string;
  formationLetter?: File;
  purpose: string;
  members: CommitteeMember[];
  tasks: CommitteeTask[];
  specifications: {
    submissionDate: string;
    documents: File[];
    status: DocumentStatus;
  };
  reviews: SpecificationReview[];
  approvalStatus: CommitteeApprovalStatus;
}

export interface ReviewHistory {
  id: number;
  reviewDate: string;
  reviewers: CommitteeMember[];
  status: DocumentStatus;
  minutes?: string;
  documents: File[];
  comments: string[];
  nextReviewDate?: string;
}
