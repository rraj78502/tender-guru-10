import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Tender, TenderStatus, TenderApprovalStatus, TenderDocument } from "@/types/tender";
import { getStatusBadge, getApprovalStatusBadge, canTransitionStatus } from "@/utils/tenderUtils";
import TenderDocuments from "./TenderDocuments";
import CommentsSection from "../tender/CommentSection";

interface TenderTableProps {
  tenders: Tender[];
  onPreview: (tender: Tender) => void;
  onApprovalStatusUpdate?: (tenderId: string, status: TenderApprovalStatus) => Promise<void>;
  onStatusTransition: (tenderId: string, currentStatus: TenderStatus) => Promise<void>;
  onAddComment: (tenderId: string, text: string) => Promise<void>;
  onDocumentUpload: (tenderId: string, files: FileList) => void;
  onDocumentPreview: (document: TenderDocument, tenderId: string) => Promise<void>;
  showComments: boolean;
  setShowComments: (show: boolean) => void;
}

const TenderTable = ({
  tenders,
  onPreview,
  onApprovalStatusUpdate,
  onStatusTransition,
  onAddComment,
  onDocumentUpload,
  onDocumentPreview,
  showComments,
  setShowComments,
}: TenderTableProps) => {
  const canEdit = true;

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Publish Date</TableHead>
            <TableHead>Opening Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Approval</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenders.map((tender) => (
            <TableRow key={tender.id}>
              <TableCell>{tender.title}</TableCell>
              <TableCell>{new Date(tender.publishDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(tender.openingDate).toLocaleDateString()}</TableCell>
              <TableCell>{getStatusBadge(tender.status)}</TableCell>
              <TableCell>{getApprovalStatusBadge(tender.approvalStatus)}</TableCell>
              <TableCell>
                <TenderDocuments
                  tenderId={tender.id}
                  documents={tender.documents}
                  onUpload={onDocumentUpload}
                  onPreview={(document: TenderDocument) => onDocumentPreview(document, tender.id)}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center gap-2">
                  <CommentsSection
                    comments={tender.comments}
                    showComments={showComments}
                    setShowComments={setShowComments}
                    newComment=""
                    setNewComment={() => {}}
                    onAddComment={onAddComment}
                    tenderId={tender.id}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreview(tender)}
                  >
                    Preview
                  </Button>
                  {canEdit && (
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {tender.status === "draft" && tender.approvalStatus === "pending" && onApprovalStatusUpdate && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => await onApprovalStatusUpdate(tender.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={async () => await onApprovalStatusUpdate(tender.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {tender.status === "draft" && tender.approvalStatus === "approved" && canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => await onStatusTransition(tender.id, tender.status)}
                    >
                      Publish
                    </Button>
                  )}
                  {tender.status === "published" && canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => await onStatusTransition(tender.id, tender.status)}
                    >
                      Close
                    </Button>
                  )}
                  {tender.status === "closed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                    >
                      Already Closed
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TenderTable;