import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import TenderPreview from "./TenderPreview";
import DocumentViewer from "./DocumentViewer";
import TenderSearchFilter from "./TenderSearchFilter";
import TenderTable from "./TenderTable";
import { getNextStatus } from "@/utils/tenderUtils";
import { Tender, TenderStatus, TenderComment } from "@/types/tender";

const mockTenders: Tender[] = [
  {
    id: 1,
    ifbNumber: "IFB-1234567890-001",
    title: "Network Equipment Procurement",
    description: "Procurement of networking equipment for data center",
    publishDate: "2024-03-15",
    openingDate: "2024-04-15",
    bidValidity: "90",
    status: "draft",
    approvalStatus: "pending",
    comments: [],
    documents: [],
  },
  {
    id: 2,
    ifbNumber: "IFB-1234567890-002",
    title: "Software Development Services",
    description: "Custom software development services for ERP system",
    publishDate: "2024-03-20",
    openingDate: "2024-04-20",
    bidValidity: "60",
    status: "published",
    approvalStatus: "approved",
    comments: [],
    documents: [],
  },
];

const TenderList = () => {
  const { toast } = useToast();
  const [tenders, setTenders] = useState<Tender[]>(mockTenders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TenderStatus | "all">("all");
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleStatusTransition = (tenderId: number) => {
    setTenders((prevTenders) =>
      prevTenders.map((tender) => {
        if (tender.id === tenderId) {
          const nextStatus = getNextStatus(tender.status);
          if (nextStatus) {
            toast({
              title: "Status Updated",
              description: `Tender status changed from ${tender.status} to ${nextStatus}`,
            });
            return { ...tender, status: nextStatus };
          }
        }
        return tender;
      })
    );
  };

  const handleApprovalStatusUpdate = (tenderId: number, status: "approved" | "rejected") => {
    setTenders((prevTenders) =>
      prevTenders.map((tender) => {
        if (tender.id === tenderId) {
          toast({
            title: "Approval Status Updated",
            description: `Tender has been ${status}`,
          });
          return { ...tender, approvalStatus: status };
        }
        return tender;
      })
    );
  };

  const handleAddComment = (tenderId: number, text: string) => {
    const now = new Date();
    const newComment: TenderComment = {
      id: Date.now(),
      text,
      author: "Current User",
      createdAt: now.toISOString(),
      timestamp: now.toISOString(),
    };

    setTenders((prevTenders) =>
      prevTenders.map((tender) => {
        if (tender.id === tenderId) {
          return {
            ...tender,
            comments: [newComment, ...tender.comments],
          };
        }
        return tender;
      })
    );

    toast({
      title: "Comment Added",
      description: "Your comment has been added successfully",
    });
  };

  const handleDocumentUpload = (tenderId: number, files: FileList) => {
    setTenders((prevTenders) =>
      prevTenders.map((tender) => {
        if (tender.id === tenderId) {
          const newDocuments = Array.from(files);
          return {
            ...tender,
            documents: [...tender.documents, ...newDocuments],
          };
        }
        return tender;
      })
    );

    toast({
      title: "Documents Uploaded",
      description: `${files.length} document(s) have been uploaded successfully.`,
    });
  };

  const handleDocumentPreview = (document: File) => {
    setSelectedDocument(document);
    setShowDocumentViewer(true);
  };

  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch =
      tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.ifbNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || tender.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tenders</h2>
      </div>

      <TenderSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <TenderTable
        tenders={filteredTenders}
        onPreview={(tender) => {
          setSelectedTender(tender);
          setShowPreview(true);
        }}
        onApprovalStatusUpdate={handleApprovalStatusUpdate}
        onStatusTransition={handleStatusTransition}
        onAddComment={handleAddComment}
        onDocumentUpload={handleDocumentUpload}
        onDocumentPreview={handleDocumentPreview}
        showComments={showComments}
        setShowComments={setShowComments}
      />

      {selectedTender && (
        <TenderPreview
          open={showPreview}
          onOpenChange={setShowPreview}
          tender={selectedTender}
        />
      )}

      {selectedDocument && (
        <DocumentViewer
          open={showDocumentViewer}
          onOpenChange={setShowDocumentViewer}
          document={selectedDocument}
        />
      )}
    </div>
  );
};

export default TenderList;
