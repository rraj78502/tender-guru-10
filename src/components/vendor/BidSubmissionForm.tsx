
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";
import { VendorBid } from "@/types/vendor";
import BidAmountField from "./form/BidAmountField";
import DocumentUpload from "./form/DocumentUpload";

interface BidSubmissionFormProps {
  tenderId: number;
  onClose: () => void;
}

const BidSubmissionForm = ({ tenderId, onClose }: BidSubmissionFormProps) => {
  // BACKEND API: Get tender details for bid submission
  // Endpoint: GET /api/tenders/:tenderId
  // Request: { tenderId: number }
  // Response: Tender object with details needed for bid submission
  
  /* API Flow:
  // 1. Component mounts when user opens bid submission form
  // 2. Component makes API call to get tender details based on tenderId
  // 3. API call made to GET /api/tenders/:tenderId
  // 4. Server retrieves tender data from database
  // 5. Response with tender data returned to client
  // 6. Component sets tender details to state for reference
  // 7. Form initialized with tender-specific information
  // 8. Form fields may be adjusted based on tender requirements
  
  // Integration Code:
  const [tenderDetails, setTenderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchTenderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tenders/${tenderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch tender details');
      
      const data = await response.json();
      setTenderDetails(data);
      setError('');
    } catch (error) {
      console.error('Error fetching tender details:', error);
      setError('Failed to load tender details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTenderDetails();
  }, [tenderId]); */
  
  const { toast } = useToast();
  const [documents, setDocuments] = useState<File[]>([]);
  const [bidData, setBidData] = useState({
    bidAmount: "",
    technicalDetails: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // BACKEND API: Submit bid
    // Endpoint: POST /api/tenders/:tenderId/bids
    // Request Body: Multipart form with bid data and documents
    // {
    //   bidAmount: number,
    //   technicalDetails: string,
    //   documents: File[]
    // }
    // Response: { id: number, tenderId: number, vendorId: number, status: "submitted", ...bidData }
    
    /* API Flow:
    // 1. User fills bid submission form and attaches documents
    // 2. handleSubmit prevents default form submission
    // 3. Client validates all required fields
    // 4. Client creates FormData object with bid amount and files
    // 5. API call made to POST /api/tenders/:tenderId/bids
    // 6. Server validates bid data against tender requirements
    // 7. Server saves bid documents to storage system
    // 8. Server creates bid record in database with submitted status
    // 9. Server links bid to tender and vendor
    // 10. Server notifies procurement team of new bid
    // 11. Response with created bid returned to client
    // 12. Client shows success toast and closes the form
    
    // Integration Code:
    const submitBid = async () => {
      const formData = new FormData();
      
      // Add bid data
      formData.append('bidAmount', bidData.bidAmount);
      formData.append('technicalDetails', bidData.technicalDetails);
      
      // Add all documents
      documents.forEach((file, index) => {
        formData.append(`document-${index}`, file);
      });
      
      try {
        const response = await fetch(`/api/tenders/${tenderId}/bids`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Bid submission failed');
        }
        
        const newBid = await response.json();
        
        toast({
          title: "Bid Submitted Successfully",
          description: "Your bid has been submitted and is now under review.",
        });
        
        onClose();
        return newBid;
      } catch (error) {
        console.error('Error submitting bid:', error);
        
        toast({
          title: "Submission Failed",
          description: error.message || "An error occurred during bid submission.",
          variant: "destructive",
        });
        
        throw error;
      }
    }; */
    
    const newBid: Partial<VendorBid> = {
      tenderId,
      vendorId: 1, // This would come from auth context in a real app
      bidAmount: parseFloat(bidData.bidAmount),
      technicalScore: 0, // To be evaluated by committee
      documents,
      submissionDate: new Date().toISOString(),
      status: "submitted",
    };
    
    console.log("Bid submitted:", newBid);
    
    toast({
      title: "Bid Submitted",
      description: "Your bid has been submitted successfully.",
    });
    
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBidData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // BACKEND API: Upload bid documents
      // Endpoint: POST /api/uploads/documents
      // Request: Multipart form with files
      // Response: { success: boolean, files: Array of document objects }
      
      /* API Flow:
      // 1. User selects files in file input
      // 2. handleFileChange captures selected files
      // 3. Component can either store files for later submission with bid
      // 4. Or component can immediately upload files to get URLs
      // 5. If immediate upload: API call made to POST /api/uploads/documents
      // 6. Server validates files (size, type, etc.)
      // 7. Server saves files to storage system
      // 8. Server returns file metadata including URLs
      // 9. Component updates state with file information
      // 10. UI shows uploaded files with success message
      
      // Integration Code:
      const uploadDocuments = async (files: FileList) => {
        const formData = new FormData();
        
        // Add all files to formData
        Array.from(files).forEach((file, index) => {
          formData.append(`file-${index}`, file);
        });
        
        try {
          const response = await fetch('/api/uploads/documents', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) throw new Error('Upload failed');
          
          const result = await response.json();
          
          if (result.success) {
            toast({
              title: "Files Uploaded",
              description: `${result.files.length} file(s) uploaded successfully.`,
            });
            
            // Update state with uploaded files
            return result.files;
          }
        } catch (error) {
          console.error('Error uploading documents:', error);
          
          toast({
            title: "Upload Failed",
            description: "Failed to upload documents. Please try again.",
            variant: "destructive",
          });
          
          throw error;
        }
      }; */
      
      const newFiles = Array.from(e.target.files);
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
          <h2 className="text-2xl font-bold">Submit Bid</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <BidAmountField
            bidAmount={bidData.bidAmount}
            onChange={handleInputChange}
          />

          <DocumentUpload
            documents={documents}
            onFileChange={handleFileChange}
            onRemoveDocument={removeDocument}
          />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Bid
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BidSubmissionForm;
