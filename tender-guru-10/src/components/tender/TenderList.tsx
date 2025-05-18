import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TenderPreview from "./TenderPreview";
import DocumentViewer from "./DocumentViewer";
import TenderSearchFilter from "./TenderSearchFilter";
import TenderTable from "./TenderTable";
import TenderForm from "./TenderForm";
import { getNextStatus } from "@/utils/tenderUtils";
import { Tender, TenderStatus, TenderApprovalStatus, TenderComment, TenderDocument } from "@/types/tender";
import { useAuth } from "@/contexts/AuthContext";
import { constrainedMemory } from "process";

// Define the raw backend response type
interface RawTender {
  _id: string;
  ifbNumber: string;
  title: string;
  description: string;
  publishDate: Date;
  openingDate: Date;
  bidValidity: number;
  status: string;
  approvalStatus: string;
  documents: {
    filename: string;
    path: string;
    originalname: string;
    mimetype: string;
    size: number;
  }[];
  comments: {
    _id?: string;
    text: string;
    author: string;
    createdAt: string;
    timestamp: string;
  }[];
  createdBy?: {
    name: string;
    email: string;
    role: string;
    employeeId: string;
  };
  createdAt?: string;
}

// Function to fetch tenders from the backend
const fetchTenders = async (): Promise<Tender[]> => {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/tenders/getalltenders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tenders');
    }

    const data = await response.json();
    return data.data.tenders.map((tender: RawTender) => ({
      id: tender._id,
      ifbNumber: tender.ifbNumber,
      title: tender.title,
      description: tender.description,
      publishDate: tender.publishDate,
      openingDate: tender.openingDate,
      bidValidity: tender.bidValidity,
      status: tender.status as TenderStatus,
      approvalStatus: tender.approvalStatus as TenderApprovalStatus,
      documents: tender.documents.map((doc) => ({
        filename: doc.filename,
        path: doc.path,
        originalname: doc.originalname,
        mimetype: doc.mimetype,
        size: doc.size,
      })) as TenderDocument[],
      comments: tender.comments.map((comment) => ({
        id: comment._id ? parseInt(comment._id.toString()) : Date.now(),
        text: comment.text,
        author: comment.author,
        createdAt: comment.createdAt,
        timestamp: comment.timestamp,
      })) as TenderComment[],
      createdBy: tender.createdBy ? {
        name: tender.createdBy.name,
        email: tender.createdBy.email,
        role: tender.createdBy.role,
        employeeId: tender.createdBy.employeeId,
      } : undefined,
      createdAt: tender.createdAt,
    }));
  } catch (error) {
    console.error('Error fetching tenders:', error);
    throw error;
  }
};

// Function to update tender approval status (approve/reject)
const updateTenderApprovalStatus = async (tenderId: string, approvalStatus: TenderApprovalStatus): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/tenders/updatetender/${tenderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ approvalStatus }),
    });

    if (!response.ok) {
      throw new Error(`Failed to ${approvalStatus} tender`);
    }
  } catch (error) {
    console.error(`Error updating tender approval status:`, error);
    throw error;
  }
};

// Function to update tender status (e.g., published to closed)
const updateTenderStatus = async (tenderId: string, currentStatus: TenderStatus): Promise<void> => {
  try {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return;

    const response = await fetch(`http://localhost:5000/api/v1/tenders/updatetender/${tenderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update tender status to ${nextStatus}`);
    }
  } catch (error) {
    console.error(`Error updating tender status:`, error);
    throw error;
  }
};

const TenderList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TenderStatus | "all">("all");
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ document: TenderDocument; tenderId: string } | null>(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const canCreateTender = true;
  const canApproveTender = true;

  const loadTenders = async () => {
    try {
      setLoading(true);
      const fetchedTenders = await fetchTenders();
      setTenders(fetchedTenders);
    } catch (error) {
      setTenders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenders();
  }, []);

  const handleCreateTender = async () => {
    await loadTenders();
  };

  const handleStatusTransition = async (tenderId: string, currentStatus: TenderStatus) => {
    try {
      await updateTenderStatus(tenderId, currentStatus);
      await loadTenders();
      toast({
        title: "Status Updated",
        description: `Tender status changed from ${currentStatus} to ${getNextStatus(currentStatus)}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update tender status to ${getNextStatus(currentStatus)}`,
        variant: "destructive",
      });
    }
  };

  const handleApprovalStatusUpdate = async (tenderId: string, status: TenderApprovalStatus) => {
    try {
      await updateTenderApprovalStatus(tenderId, status);
      await loadTenders();
      toast({
        title: "Approval Status Updated",
        description: `Tender has been ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${status} tender`,
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async (tenderId: string, text: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/tenders/${tenderId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          text,
          author: "Current User", // Replace with req.user.name if using AuthContext
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          throw new Error('You are not logged in. Please log in to add a comment.');
        }
        if (response.status === 403) {
          throw new Error('You do not have permission to add a comment.');
        }
        throw new Error(errorData.message || 'Failed to add comment');
      }

      await loadTenders(); // Refresh the tenders list to include the new comment
    } catch (error) {
      throw new Error(error.message || 'Failed to add comment');
    }
  };

  const handleDocumentUpload = (tenderId: string, files: FileList) => {
    const newDocuments = Array.from(files).map(file => ({
      filename: file.name,
      path: '',
      originalname: file.name,
      mimetype: file.type,
      size: file.size,
    }));

    setTenders((prevTenders) =>
      prevTenders.map((tender) => {
        if (tender.id === tenderId) {
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

  const handleDocumentPreview = async (document: TenderDocument, tenderId: string) => {
    setSelectedDocument({ document, tenderId });
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
          {['admin', 'procurement_officer'].includes(user?.role) && (
              <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Tender
            </Button>
          )}
      </div>

      <TenderSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {loading ? (
        <p>Loading tenders...</p>
      ) : filteredTenders.length === 0 ? (
        <p>No tenders found.</p> 
      ) :(
       <TenderTable
          tenders={filteredTenders}
          onPreview={(tender) => {
            setSelectedTender(tender);
            setShowPreview(true);
          }}
          onApprovalStatusUpdate={canApproveTender ? handleApprovalStatusUpdate : undefined}
          onStatusTransition={handleStatusTransition}
          onAddComment={handleAddComment}
          onDocumentUpload={handleDocumentUpload}
          onDocumentPreview={handleDocumentPreview}
          showComments={showComments}
          setShowComments={setShowComments}
        />
      )}

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
          document={selectedDocument.document}
          tenderId={selectedDocument.tenderId}
        />
      )}

      {showCreateForm && (
        <TenderForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateTender}
        />
      )}
    </div>
  );
};

export default TenderList;