
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  return (
    <div className="space-y-4">
      <div>
        <Label>Upload Documents</Label>
        <div className="flex items-center gap-4 mt-2">
          <Input
            type="file"
            onChange={onFileChange}
            accept=".pdf,.doc,.docx"
          />
          {/* BACKEND API: Upload review document
          // Endpoint: POST /api/committees/reviews/documents
          // Request: FormData with file and { reviewId: number, documentType: string }
          // Response: { id: number, name: string, url: string, type: string, size: number }
          
          // Integration Code:
          const uploadDocument = async (file: File, reviewId: number) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('reviewId', reviewId.toString());
            formData.append('documentType', file.type);
            
            try {
              const response = await fetch('/api/committees/reviews/documents', {
                method: 'POST',
                body: formData,
              });
              
              if (!response.ok) throw new Error('Upload failed');
              
              const data = await response.json();
              return data;
            } catch (error) {
              console.error('Error uploading document:', error);
              throw error;
            }
          }; */}
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
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
        {/* BACKEND API: Submit review minutes
        // Endpoint: POST /api/committees/reviews/:reviewId/minutes
        // Request: { minutes: string, committeeId: number }
        // Response: { success: boolean, review: { id: number, minutes: string, updatedAt: string } }
        
        // Integration Code:
        const submitMinutes = async (minutes: string, reviewId: number, committeeId: number) => {
          try {
            const response = await fetch(`/api/committees/reviews/${reviewId}/minutes`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                minutes, 
                committeeId 
              }),
            });
            
            if (!response.ok) throw new Error('Failed to submit minutes');
            
            const data = await response.json();
            return data;
          } catch (error) {
            console.error('Error submitting minutes:', error);
            throw error;
          }
        }; */}
        <Button type="submit">Add Minutes</Button>
      </form>
    </div>
  );
};

export default ReviewDocuments;
