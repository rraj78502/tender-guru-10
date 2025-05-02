import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, X } from "lucide-react";
import TenderPreview from "./TenderPreview";
import { Tender } from "@/types/tender";
import IFBNumberField from "./form/IFBNumberField";
import BasicTenderInfo from "./form/BasicTenderInfo";
import TenderDates from "./form/TenderDates";
import DocumentUpload from "./form/DocumentUpload";

interface TenderFormProps {
  onClose: () => void;
  onSubmit?: (tender: Omit<Tender, "id" | "comments" | "documents">) => void;
}

const TenderForm = ({ onClose, onSubmit }: TenderFormProps) => {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [tenderData, setTenderData] = useState({
    ifbNumber: "",
    title: "",
    description: "",
    publishDate: "",
    openingDate: "",
    bidValidity: "90",
    status: "draft" as const,
    approvalStatus: "pending" as const,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const publish = new Date(tenderData.publishDate);
    const opening = new Date(tenderData.openingDate);

    if (opening <= publish) {
      toast({
        title: "Invalid Dates",
        description: "Opening date must be after publish date",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('ifbNumber', tenderData.ifbNumber);
    formData.append('title', tenderData.title);
    formData.append('description', tenderData.description);
    formData.append('publishDate', tenderData.publishDate);
    formData.append('openingDate', tenderData.openingDate);
    formData.append('bidValidity', String(tenderData.bidValidity));
    formData.append('status', tenderData.status);
    formData.append('approvalStatus', tenderData.approvalStatus);
    formData.append('uploadType', 'tender');
    // Append files to the 'documents' field as an array
    documents.forEach((doc) => {
      formData.append('documents', doc);
    });

    try {
      const response = await fetch(`http://localhost:5000/api/v1/tenders/createtender`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 413) {
          throw new Error('Payload too large. Please upload smaller files or reduce the number of files (max 10 files, 5MB each).');
        }
        if (response.status === 403) {
          throw new Error('You do not have permission to create a tender. Only admins and procurement officers can manage tenders.');
        }
        if (response.status === 401) {
          throw new Error('You are not logged in. Please log in to create a tender.');
        }
        throw new Error(errorData.message || 'Failed to create tender');
      }

      const result = await response.json();
      onSubmit?.(result.data.tender);

      toast({
        title: "Tender Created",
        description: "Tender has been created successfully.",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create tender",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTenderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIFBChange = async (name: string, value: string) => {
    if (value === "generate") {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/tenders/generate-ifb`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 403) {
            throw new Error('You do not have permission to generate an IFB number. Only admins and procurement officers can manage tenders.');
          }
          if (response.status === 401) {
            throw new Error('You are not logged in. Please log in to generate an IFB number.');
          }
          throw new Error(errorData.message || 'Failed to generate IFB number');
        }

        const result = await response.json();
        setTenderData(prev => ({
          ...prev,
          ifbNumber: result.data.ifbNumber,
        }));
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to generate IFB number",
          variant: "destructive",
        });
      }
    } else {
      setTenderData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      // Client-side validation for file size and count
      const oversizedFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast({
          title: "Error",
          description: "One or more files exceed the 5MB limit. Please upload smaller files.",
          variant: "destructive",
        });
        return;
      }
      if (newFiles.length + documents.length > 10) {
        toast({
          title: "Error",
          description: "You can only upload up to 10 files.",
          variant: "destructive",
        });
        return;
      }
      setDocuments(prev => [...prev, ...newFiles]);
      
      toast({
        title: "Files Added",
        description: `${newFiles.length} file(s) added successfully.`,
      });
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Tender</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <IFBNumberField 
            ifbNumber={tenderData.ifbNumber}
            onChange={handleIFBChange}
          />

          <BasicTenderInfo
            title={tenderData.title}
            description={tenderData.description}
            onChange={handleInputChange}
          />

          <TenderDates
            publishDate={tenderData.publishDate}
            openingDate={tenderData.openingDate}
            bidValidity={tenderData.bidValidity}
            onChange={handleInputChange}
          />

          <DocumentUpload
            documents={documents}
            onFileChange={handleFileChange}
            onRemoveDocument={removeDocument}
          />

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Tender"}
            </Button>
          </div>
        </form>
      </Card>

      {showPreview && (
        <TenderPreview
          open={showPreview}
          onOpenChange={setShowPreview}
          tender={{ ...tenderData, documents }}
        />
      )}
    </div>
  );
};

export default TenderForm;