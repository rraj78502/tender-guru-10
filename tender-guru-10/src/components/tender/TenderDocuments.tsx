import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TenderDocument } from "@/types/tender";

interface TenderDocumentsProps {
  tenderId: string; // Changed to string
  documents: TenderDocument[]; // Changed to TenderDocument[]
  onUpload: (tenderId: string, files: FileList) => void;
  onPreview: (document: TenderDocument, tenderId: string) => Promise<void>; // Updated to match TenderTable
}

const TenderDocuments = ({
  tenderId,
  documents,
  onUpload,
  onPreview,
}: TenderDocumentsProps) => {
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const formData = new FormData();
      Array.from(e.target.files).forEach((file) => {
        formData.append('documents', file);
      });
      formData.append('uploadType', 'tender');

      fetch(`http://localhost:5000/api/v1/tenders/updatetender/${tenderId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      })
        .then((response) => {
          if (!response.ok) throw new Error('Upload failed');
          return response.json();
        })
        .then(() => {
          onUpload(tenderId, e.target.files);
          toast({
            title: "Documents Uploaded",
            description: `${e.target.files.length} document(s) uploaded successfully.`,
          });
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to upload documents",
            variant: "destructive",
          });
        });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">{documents.length} file(s)</span>
      <div className="flex gap-2">
        <Input
          type="file"
          className="hidden"
          id={`upload-${tenderId}`}
          multiple
          onChange={handleFileUpload}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => document.getElementById(`upload-${tenderId}`)?.click()}
        >
          <Upload className="h-4 w-4" />
        </Button>
        {documents.map((doc, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onPreview(doc, tenderId)}
          >
            <File className="h-4 w-4" />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TenderDocuments;