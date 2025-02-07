
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Eye, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  teamId: number;
}

// Mock data
const mockDocuments = [
  {
    id: 1,
    name: "Technical Proposal.pdf",
    type: "application/pdf",
    size: 2500000,
    uploadedAt: new Date().toISOString(),
    isConfidential: true,
  },
  {
    id: 2,
    name: "Financial Bid.pdf",
    type: "application/pdf",
    size: 1500000,
    uploadedAt: new Date().toISOString(),
    isConfidential: true,
  },
];

const SecureDocumentViewer = ({ teamId }: Props) => {
  const { toast } = useToast();
  const [selectedDoc, setSelectedDoc] = useState<typeof mockDocuments[0] | null>(null);

  const handleViewDocument = (doc: typeof mockDocuments[0]) => {
    setSelectedDoc(doc);
    toast({
      title: "Document Access Logged",
      description: `Access to ${doc.name} has been recorded`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Secure Documents</h3>
        <Button variant="outline">
          <Lock className="mr-2 h-4 w-4" />
          Access Log
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockDocuments.map((doc) => (
          <Card key={doc.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    {(doc.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleViewDocument(doc)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {selectedDoc && (
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="space-y-2">
            <h4 className="font-medium">{selectedDoc.name}</h4>
            <p className="text-sm text-gray-500">
              Document preview would be displayed here in a secure iframe
            </p>
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default SecureDocumentViewer;
