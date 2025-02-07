import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import TenderPreview from "./TenderPreview";
import DocumentViewer from "./DocumentViewer";
import TenderSearchFilter from "./TenderSearchFilter";
import TenderDocuments from "./TenderDocuments";
import { getStatusBadge } from "@/utils/tenderUtils";
import { Tender, TenderStatus } from "@/types/tender";

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

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IFB Number</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Publish Date</TableHead>
              <TableHead>Opening Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTenders.map((tender) => (
              <TableRow key={tender.id}>
                <TableCell className="font-medium">{tender.ifbNumber}</TableCell>
                <TableCell>{tender.title}</TableCell>
                <TableCell>{tender.publishDate}</TableCell>
                <TableCell>{tender.openingDate}</TableCell>
                <TableCell>{getStatusBadge(tender.status)}</TableCell>
                <TableCell>
                  <TenderDocuments
                    tenderId={tender.id}
                    documents={tender.documents}
                    onUpload={handleDocumentUpload}
                    onPreview={handleDocumentPreview}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTender(tender);
                        setShowPreview(true);
                      }}
                    >
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
