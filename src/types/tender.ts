
export type TenderStatus = "draft" | "published" | "closed";

export interface Tender {
  id: number;
  ifbNumber: string;
  title: string;
  description: string;
  publishDate: string;
  openingDate: string;
  bidValidity: string;
  status: TenderStatus;
  documents: File[];
}
