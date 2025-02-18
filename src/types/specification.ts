
export type SpecificationStatus = 
  | "draft"
  | "submitted"
  | "under_review"
  | "revision_required"
  | "approved"
  | "rejected";

export type ReviewStatus = 
  | "scheduled"
  | "in_progress"
  | "completed"
  | "rescheduled";

export interface DocumentVersion {
  id: number;
  version: number;
  documentUrl: string;
  changes: string;
  submittedBy: number;
  submittedAt: string;
}

export interface SpecificationDocument {
  id: number;
  title: string;
  description: string;
  version: number;
  status: SpecificationStatus;
  submittedBy: number;
  submittedAt: string;
  lastModified: string;
  documentUrl: string;
  committeeId: number;
  comments: string[];
  versionHistory?: DocumentVersion[];
}

export interface ReviewSession {
  id: number;
  specificationId: number;
  scheduledDate: string;
  actualDate?: string;
  status: ReviewStatus;
  reviewers: CommitteeMember[];
  minutes?: string;
  comments: string[];
  nextReviewDate?: string;
  documents: {
    id: number;
    name: string;
    url: string;
    uploadedAt: string;
    type: "review_minutes" | "supporting_document" | "final_approval";
  }[];
}

export interface CommitteeFormation {
  id: number;
  formationDate: string;
  letterReference: string;
  letterUrl: string;
  purpose: string;
  chairperson: CommitteeMember;
  members: CommitteeMember[];
  documents: {
    id: number;
    title: string;
    url: string;
    uploadedAt: string;
  }[];
}
