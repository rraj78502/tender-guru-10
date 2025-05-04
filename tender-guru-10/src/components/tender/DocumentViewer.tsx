import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    filename: string;
    path: string;
    originalname: string;
    mimetype: string;
    size: number;
  }; // Changed to TenderDocument
  tenderId: string; // Added to fetch the file
}

const DocumentViewer = ({ open, onOpenChange, document, tenderId }: DocumentViewerProps) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/tenders/${tenderId}/download/${document.filename}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.originalname;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Document Downloaded",
        description: `${document.originalname} has been downloaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Document Preview: {document.originalname}
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
        <ScrollArea className="h-[calc(80vh-8rem)] w-full rounded-md border">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-500">
                {document.mimetype} - {(document.size / 1024).toFixed(2)} KB
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-500">
                Preview not available for this file type. Please download to view.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;