
import { BidSecurity, DocumentFee, PreBidMeeting, Clarification } from "@/types/procurement";

export const mockBidSecurities: BidSecurity[] = [
  {
    id: 1,
    tenderId: 1,
    vendorId: 1,
    amount: 25000,
    validityDate: "2024-07-15",
    bankName: "Global Bank Ltd.",
    referenceNumber: "GB/BS/2024/001",
    status: "active",
    documents: [],
  },
  {
    id: 2,
    tenderId: 1,
    vendorId: 2,
    amount: 25000,
    validityDate: "2024-07-15",
    bankName: "City Bank Ltd.",
    referenceNumber: "CB/BS/2024/023",
    status: "active",
    documents: [],
  },
];

export const mockDocumentFees: DocumentFee[] = [
  {
    id: 1,
    tenderId: 1,
    vendorId: 1,
    amount: 5000,
    paymentDate: "2024-03-16",
    receiptNumber: "RF/2024/001",
    status: "paid",
    documents: [],
  },
  {
    id: 2,
    tenderId: 1,
    vendorId: 2,
    amount: 5000,
    paymentDate: "2024-03-17",
    receiptNumber: "RF/2024/002",
    status: "paid",
    documents: [],
  },
];

export const mockPreBidMeetings: PreBidMeeting[] = [
  {
    id: 1,
    tenderId: 1,
    scheduledDate: "2024-03-25T10:00:00Z",
    venue: "Conference Room A",
    agenda: "Technical specification discussion and clarification",
    attendees: [
      { id: 1, name: "Vendor A Representative", company: "Tech Solutions Ltd." },
      { id: 2, name: "Vendor B Representative", company: "Network Systems Inc." },
    ],
    minutes: "Discussion points:\n1. Technical requirements clarification\n2. Timeline discussions\n3. Implementation approach",
    status: "completed",
  },
  {
    id: 2,
    tenderId: 2,
    scheduledDate: "2024-04-10T14:00:00Z",
    venue: "Virtual Meeting",
    agenda: "Project scope and requirements discussion",
    attendees: [],
    status: "scheduled",
  },
];

export const mockClarifications: Clarification[] = [
  {
    id: 1,
    tenderId: 1,
    vendorId: 1,
    question: "Can you provide more details about the network topology requirements?",
    submitDate: "2024-03-26",
    responseDate: "2024-03-28",
    response: "Detailed network topology requirements have been added to the technical specifications document.",
    status: "answered",
    documents: [],
  },
  {
    id: 2,
    tenderId: 1,
    vendorId: 2,
    question: "What are the warranty requirements for the equipment?",
    submitDate: "2024-03-27",
    status: "pending",
    documents: [],
  },
];
