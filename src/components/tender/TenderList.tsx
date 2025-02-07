
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Search, Filter, Upload, File } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import TenderPreview from "./TenderPreview";
import DocumentViewer from "./DocumentViewer";

type TenderStatus = "draft" | "published" | "closed";

interface Tender {
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

  const getStatusBadge = (status: TenderStatus) => {
    const statusStyles = {
      draft: "bg-yellow-100 text-yellow-800",
      published: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge variant="outline" className={`${statusStyles[status]} capitalize`}>
        {status}
      </Badge>
    );
  };

  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch =
      tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.ifbNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || tender.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePreview = (tender: Tender) => {
    setSelectedTender(tender);
    setShowPreview(true);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tenders</h2>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search tenders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            className="border rounded p-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TenderStatus | "all")}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

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
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {tender.documents.length} file(s)
                    </span>
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        className="hidden"
                        id={`upload-${tender.id}`}
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            handleDocumentUpload(tender.id, e.target.files);
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(`upload-${tender.id}`)?.click()}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      {tender.documents.map((doc, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleDocumentPreview(doc)}
                        >
                          <File className="h-4 w-4" />
                        </Button>
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(tender)}
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
