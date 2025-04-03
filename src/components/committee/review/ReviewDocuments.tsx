
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Upload } from "lucide-react";

interface ReviewDocumentsProps {
  minutes: string;
  onMinutesChange: (minutes: string) => void;
  onMinutesSubmit: (e: React.FormEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ReviewDocuments = ({
  minutes,
  onMinutesChange,
  onMinutesSubmit,
  onFileChange,
}: ReviewDocumentsProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      onFileChange(e);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // This is where you would call your upload API
      // The actual API call is handled by the parent component via onFileChange
      
      toast({
        title: "File uploaded successfully",
        description: `${selectedFile.name} has been uploaded.`,
      });
      
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById("fileUpload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Upload Documents</Label>
        <div className="flex items-center gap-4 mt-2">
          <Input
            id="fileUpload"
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx"
          />
          <Button 
            variant="outline" 
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
        {selectedFile && (
          <p className="text-sm text-gray-500 mt-1">
            Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
          </p>
        )}
      </div>

      <form onSubmit={onMinutesSubmit} className="space-y-4">
        <div>
          <Label htmlFor="minutes">Review Minutes</Label>
          <Textarea
            id="minutes"
            value={minutes}
            onChange={(e) => onMinutesChange(e.target.value)}
            className="h-32"
            placeholder="Enter review minutes..."
          />
        </div>
        <Button type="submit">Add Minutes</Button>
      </form>
    </div>
  );
};

export default ReviewDocuments;
