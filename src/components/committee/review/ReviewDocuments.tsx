
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
          // Response: { id: number, name: string, url: string, type: string, size: number } */}
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
        // Response: { success: boolean, review: { id: number, minutes: string, updatedAt: string } } */}
        <Button type="submit">Add Minutes</Button>
      </form>
    </div>
  );
};

export default ReviewDocuments;
