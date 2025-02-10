
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Eye, Upload, X, Hash } from "lucide-react";
import TenderPreview from "./TenderPreview";
import { Tender } from "@/types/tender";

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

  const generateIFBNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const ifbNumber = `IFB-${year}${month}-${random}`;
    setTenderData(prev => ({ ...prev, ifbNumber }));
    
    toast({
      title: "IFB Number Generated",
      description: `New IFB number: ${ifbNumber}`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dates
    const publish = new Date(tenderData.publishDate);
    const opening = new Date(tenderData.openingDate);
    
    if (opening <= publish) {
      toast({
        title: "Invalid Dates",
        description: "Opening date must be after publish date",
        variant: "destructive",
      });
      return;
    }

    // Convert bidValidity to string if it's a number
    const tender = {
      ...tenderData,
      bidValidity: String(tenderData.bidValidity),
    };

    onSubmit?.(tender);
    
    toast({
      title: "Tender Created",
      description: "Tender has been created successfully.",
    });
    
    onClose();
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
          <h2 className="text-2xl font-bold">Create New Tender</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="ifbNumber">IFB Number</Label>
              <Input
                id="ifbNumber"
                name="ifbNumber"
                value={tenderData.ifbNumber}
                onChange={handleInputChange}
                readOnly
                placeholder="Generate IFB Number"
              />
            </div>
            <Button 
              type="button" 
              onClick={generateIFBNumber}
              className="flex items-center gap-2"
            >
              <Hash className="h-4 w-4" />
              Generate
            </Button>
          </div>

          <div>
            <Label htmlFor="title">Tender Title</Label>
            <Input
              id="title"
              name="title"
              value={tenderData.title}
              onChange={handleInputChange}
              placeholder="Enter tender title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={tenderData.description}
              onChange={handleInputChange}
              placeholder="Enter tender description"
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="publishDate">Publish Date</Label>
              <Input
                id="publishDate"
                name="publishDate"
                type="date"
                value={tenderData.publishDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="openingDate">Opening Date</Label>
              <Input
                id="openingDate"
                name="openingDate"
                type="date"
                value={tenderData.openingDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bidValidity">Bid Validity (in days)</Label>
            <Input
              id="bidValidity"
              name="bidValidity"
              type="number"
              value={tenderData.bidValidity}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documents">Upload Documents</Label>
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
            <Button type="submit">
              Create Tender
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

