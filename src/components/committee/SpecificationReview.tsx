
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { SpecificationReview as SpecificationReviewType, DocumentStatus, CommitteeMember } from "@/types/committee";
import ReviewScheduler from "./review/ReviewScheduler";
import ReviewDocuments from "./review/ReviewDocuments";
import ReviewInfo from "./review/ReviewInfo";

interface SpecificationReviewProps {
  review: SpecificationReviewType;
  onScheduleReview: (date: string) => void;
  onAddMinutes: (minutes: string) => void;
  onUploadDocument: (file: File) => void;
  onUpdateStatus: (status: DocumentStatus) => void;
  onNotifyTeam?: (members: CommitteeMember[]) => void;
}

const SpecificationReview = ({
  review,
  onScheduleReview,
  onAddMinutes,
  onUploadDocument,
  onUpdateStatus,
  onNotifyTeam,
}: SpecificationReviewProps) => {
  // BACKEND API: Get review details
  // Endpoint: GET /api/committees/:committeeId/reviews/:reviewId
  // Request: { committeeId: number, reviewId: number }
  // Response: SpecificationReview object with dates, documents, minutes, etc.
  
  /* Integration Code:
  const [reviewDetails, setReviewDetails] = useState<SpecificationReviewType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchReviewDetails = async (committeeId: number, reviewId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/committees/${committeeId}/reviews/${reviewId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch review details');
      
      const data = await response.json();
      setReviewDetails(data);
      setError('');
    } catch (error) {
      console.error('Error fetching review details:', error);
      setError('Failed to load review details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (review.committeeId && review.id) {
      fetchReviewDetails(review.committeeId, review.id);
    } else {
      setReviewDetails(review);
      setLoading(false);
    }
  }, [review]); */
  
  const { toast } = useToast();
  const [minutes, setMinutes] = useState("");

  const handleMinutesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // BACKEND API: Add review minutes
    // Endpoint: POST /api/committees/:committeeId/reviews/:reviewId/minutes
    // Request Body: { minutes: string }
    // Response: { success: boolean, updatedReview: SpecificationReview }
    
    /* Integration Code:
    const submitMinutes = async () => {
      try {
        const response = await fetch(`/api/committees/${review.committeeId}/reviews/${review.id}/minutes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            minutes: minutes
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add minutes');
        }
        
        const result = await response.json();
        
        if (result.success) {
          onAddMinutes(minutes);
          setMinutes("");
          
          toast({
            title: "Minutes Added",
            description: "Review minutes have been added successfully",
          });
        }
        
        return result;
      } catch (error) {
        console.error('Error adding minutes:', error);
        
        toast({
          title: "Failed to Add Minutes",
          description: error.message || "An error occurred while adding minutes.",
          variant: "destructive",
        });
        
        throw error;
      }
    }; */
    
    onAddMinutes(minutes);
    setMinutes("");
    toast({
      title: "Minutes Added",
      description: "Review minutes have been added successfully",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // BACKEND API: Upload review document
      // Endpoint: POST /api/committees/:committeeId/reviews/:reviewId/documents
      // Request: Multipart form with file
      // Response: { success: boolean, document: { id: number, name: string, url: string } }
      
      /* Integration Code:
      const uploadDocument = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const response = await fetch(`/api/committees/${review.committeeId}/reviews/${review.id}/documents`, {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) throw new Error('Upload failed');
          
          const result = await response.json();
          
          if (result.success) {
            onUploadDocument(file);
            
            toast({
              title: "Document Uploaded",
              description: "Review document has been uploaded successfully",
            });
          }
          
          return result;
        } catch (error) {
          console.error('Error uploading document:', error);
          
          toast({
            title: "Upload Failed",
            description: "Failed to upload document. Please try again.",
            variant: "destructive",
          });
          
          throw error;
        }
      }; */
      
      onUploadDocument(e.target.files[0]);
      toast({
        title: "Document Uploaded",
        description: "Review document has been uploaded successfully",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Label>Schedule Review</Label>
          <ReviewScheduler
            onSchedule={onScheduleReview}
            onNotifyTeam={onNotifyTeam}
            reviewers={review.reviewers}
            scheduledDate={review.scheduledDate}
          />
        </div>

        <div className="space-y-4">
          <ReviewDocuments
            minutes={minutes}
            onMinutesChange={setMinutes}
            onMinutesSubmit={handleMinutesSubmit}
            onFileChange={handleFileChange}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="status">Review Status</Label>
        <select
          id="status"
          value={review.status}
          onChange={(e) => onUpdateStatus(e.target.value as DocumentStatus)}
          className="w-full p-2 border rounded-md mt-2"
        >
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <ReviewInfo
        minutes={review.minutes}
        actualDate={review.actualDate}
        scheduledDate={review.scheduledDate}
        documents={review.documents}
        status={review.status}
      />
    </div>
  );
};

export default SpecificationReview;
