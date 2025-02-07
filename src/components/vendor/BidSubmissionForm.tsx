
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X } from "lucide-react";
import { VendorBid } from "@/types/vendor";

interface BidSubmissionFormProps {
  tenderId: number;
  onClose: () => void;
}

const BidSubmissionForm = ({ tenderId, onClose }: BidSubmissionFormProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<File[]>([]);
  const [bidData, setBidData] = useState({
    bidAmount: "",
    technicalDetails: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          <div>
            <Label htmlFor="bidAmount">Bid Amount</Label>
            <Input
              id="bidAmount"
              name="bidAmount"
              type="number"
              step="0.01"
              value={bidData.bidAmount}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documents">Bid Documents</Label>
            <div className="flex items-center gap-4">
              <Input
                id="documents"
                type="file"
                onChange={handleFileChange}
                multiple
                className="cursor-pointer"
                accept=".pdf,.doc,.docx"
              />
              <Button type="button" variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </div>
            
            {documents.length > 0 && (
              <div className="mt-4 space-y-2">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm truncate">{doc.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

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
