
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { FileText, Eye, Lock, Printer, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  teamId: number;
}

interface SecureDocument {
  id: number;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  isConfidential: boolean;
  accessHistory: Array<{
    userId: number;
    timestamp: string;
    action: "view" | "print";
  }>;
}

// Mock data
const mockDocuments: SecureDocument[] = [
  {
    id: 1,
    name: "Technical Proposal.pdf",
    type: "application/pdf",
    size: 2500000,
    uploadedAt: new Date().toISOString(),
    isConfidential: true,
    accessHistory: [],
  },
  {
    id: 2,
    name: "Financial Bid.pdf",
    type: "application/pdf",
    size: 1500000,
    uploadedAt: new Date().toISOString(),
    isConfidential: true,
    accessHistory: [],
  },
];

const SecureDocumentViewer = ({ teamId }: Props) => {
  const { toast } = useToast();
  const [selectedDoc, setSelectedDoc] = useState<SecureDocument | null>(null);
  const [showAccessLog, setShowAccessLog] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  const handleViewDocument = (doc: SecureDocument) => {
    setSelectedDoc(doc);
    logAccess(doc.id, "view");
    toast({
      title: "Document Access Logged",
      description: `Access to ${doc.name} has been recorded`,
    });
  };

  const logAccess = (documentId: number, action: "view" | "print") => {
    // In a real app, this would call an API to log the access
    console.log("Access logged:", {
      documentId,
      userId: 1, // This would come from auth context
      timestamp: new Date().toISOString(),
      action,
    });
  };

  const handlePrint = () => {
    if (!selectedDoc) return;
    
    setShowPrintDialog(true);
  };

  const confirmPrint = () => {
    if (!selectedDoc) return;

    logAccess(selectedDoc.id, "print");
    toast({
      title: "Print Request Logged",
      description: "Your print request has been recorded and will be monitored.",
    });

    // In a real app, this would trigger a controlled print process
    if (viewerRef.current) {
      try {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(viewerRef.current.innerHTML);
          printWindow.document.close();
          printWindow.print();
        }
      } catch (error) {
        console.error("Print error:", error);
        toast({
          title: "Print Error",
          description: "Unable to print document. Please try again.",
          variant: "destructive",
        });
      }
    }

    setShowPrintDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Secure Documents</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAccessLog(true)}>
            <Clock className="mr-2 h-4 w-4" />
            Access Log
          </Button>
          {selectedDoc && (
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          )}
        </div>
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
        <ScrollArea className="h-[400px] w-full rounded-md border p-4" ref={viewerRef}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{selectedDoc.name}</h4>
              {selectedDoc.isConfidential && (
                <div className="flex items-center text-amber-600">
                  <Lock className="h-4 w-4 mr-1" />
                  <span className="text-sm">Confidential</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Document preview would be displayed here in a secure iframe
            </p>
          </div>
        </ScrollArea>
      )}

      <AlertDialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Print Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                <span>This action will be logged and monitored</span>
              </div>
              <p className="mt-2">
                Are you sure you want to print this confidential document?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPrint}>
              Confirm Print
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showAccessLog} onOpenChange={setShowAccessLog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Document Access Log</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="py-4">
            <ScrollArea className="h-[300px]">
              {mockDocuments.map((doc) => (
                <div key={doc.id} className="mb-4">
                  <h4 className="font-medium mb-2">{doc.name}</h4>
                  {doc.accessHistory.length > 0 ? (
                    doc.accessHistory.map((log, index) => (
                      <div key={index} className="text-sm text-gray-600 mb-1">
                        {new Date(log.timestamp).toLocaleString()} - {log.action}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No access history</p>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAccessLog(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SecureDocumentViewer;
