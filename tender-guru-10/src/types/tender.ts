export type TenderStatus = "draft" | "published" | "closed";

export type TenderApprovalStatus = "pending" | "approved" | "rejected";

export interface TenderComment {
  id: number;
  text: string;
  author: string;
  createdAt: string;
  timestamp: string;
}

export interface TenderDocument {
  filename: string;
  path: string;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface Tender {
  id: string; // Changed from number to string to match MongoDB _id
  ifbNumber: string;
  title: string;
  description: string;
  publishDate: string;
  openingDate: string;
  bidValidity: number; // Changed from string to number
  status: TenderStatus; 
  approvalStatus: TenderApprovalStatus;
  comments: TenderComment[];
  documents: TenderDocument[]; // Changed from File[] to TenderDocument[]
  createdBy?: {
    name: string;
    email: string;
    role: string;
    employeeId: string;
  }; // Added to match populated createdBy
  createdAt?: string; // Added to match backend
}