
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Send, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ReviewSession } from "@/types/specification";
import { mockReviews } from "@/mock/specificationData";
import { sendNotification } from "@/utils/notificationUtils";

interface ReviewManagementProps {
  specificationId: number;
}

const ReviewManagement = ({ specificationId }: ReviewManagementProps) => {
  // BACKEND API: Get reviews for specification
  // Endpoint: GET /api/specifications/:specificationId/reviews
  // Request: { specificationId: number }
  // Response: Array of ReviewSession objects
  
  /* Integration Code:
  const [reviews, setReviews] = useState<ReviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/specifications/${specificationId}/reviews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch reviews');
      
      const data = await response.json();
      setReviews(data);
      setError('');
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReviews();
  }, [specificationId]); */
  
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [reviews] = useState<ReviewSession[]>(mockReviews);
  const [minutes, setMinutes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleScheduleReview = () => {
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a review date",
        variant: "destructive",
      });
      return;
    }

    // BACKEND API: Schedule review
    // Endpoint: POST /api/specifications/:specificationId/reviews
    // Request Body: {
    //   scheduledDate: string (ISO date),
    //   reviewers: number[] (IDs of reviewers)
    // }
    // Response: { id: number, scheduledDate: string, reviewers: Reviewer[], status: "scheduled" }
    
    /* Integration Code:
    const scheduleReview = async () => {
      try {
        const reviewers = reviews[0]?.reviewers.map(r => r.id) || [];
        
        const response = await fetch(`/api/specifications/${specificationId}/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            scheduledDate: date.toISOString(),
            reviewers: reviewers
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Scheduling failed');
        }
        
        const newReview = await response.json();
        
        // Update reviews state
        setReviews(prev => [...prev, newReview]);
        
        // Notify reviewers
        newReview.reviewers.forEach(reviewer => {
          sendNotification(
            "email",
            reviewer.email || "",
            `Review scheduled for ${format(date, "PPP")}`
          );
          
          sendNotification(
            "sms",
            reviewer.phone || "",
            `Review scheduled for ${format(date, "PPP")}`
          );
        });
        
        toast({
          title: "Review Scheduled",
          description: "Notifications sent to all reviewers",
        });
        
        return newReview;
      } catch (error) {
        console.error('Error scheduling review:', error);
        
        toast({
          title: "Scheduling Failed",
          description: error.message || "An error occurred while scheduling the review.",
          variant: "destructive",
        });
        
        throw error;
      }
    }; */
    
    // Mock sending notifications to reviewers
    reviews[0].reviewers.forEach(reviewer => {
      sendNotification(
        "email",
        reviewer.email || "",
        `Review scheduled for ${format(date, "PPP")}`
      );
      sendNotification(
        "sms",
        reviewer.phone || "",
        `Review scheduled for ${format(date, "PPP")}`
      );
    });

    toast({
      title: "Review Scheduled",
      description: "Notifications sent to all reviewers",
    });
  };

  const handleUploadMinutes = () => {
    if (!minutes.trim()) {
      toast({
        title: "Error",
        description: "Please enter review minutes",
        variant: "destructive",
      });
      return;
    }

    // BACKEND API: Upload review minutes
    // Endpoint: PUT /api/specifications/:specificationId/reviews/:reviewId/minutes
    // Request Body: { minutes: string }
    // Response: { success: boolean, updatedReview: ReviewSession }
    
    /* Integration Code:
    const uploadMinutes = async (reviewId: number) => {
      try {
        const response = await fetch(`/api/specifications/${specificationId}/reviews/${reviewId}/minutes`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            minutes: minutes
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Upload failed');
        }
        
        const result = await response.json();
        
        if (result.success) {
          // Update reviews state with updated review
          setReviews(prev => 
            prev.map(review => 
              review.id === reviewId ? result.updatedReview : review
            )
          );
          
          setMinutes("");
          
          toast({
            title: "Minutes Uploaded",
            description: "Review minutes have been saved",
          });
        }
        
        return result;
      } catch (error) {
        console.error('Error uploading minutes:', error);
        
        toast({
          title: "Upload Failed",
          description: error.message || "An error occurred while uploading minutes.",
          variant: "destructive",
        });
        
        throw error;
      }
    }; */
    
    toast({
      title: "Minutes Uploaded",
      description: "Review minutes have been saved",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // BACKEND API: Upload review document
      // Endpoint: POST /api/specifications/:specificationId/reviews/:reviewId/documents
      // Request: Multipart form with file
      // Response: { success: boolean, document: { id: number, name: string, url: string } }
      
      /* Integration Code:
      const uploadDocument = async (reviewId: number, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const response = await fetch(`/api/specifications/${specificationId}/reviews/${reviewId}/documents`, {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) throw new Error('Upload failed');
          
          const result = await response.json();
          
          if (result.success) {
            // Update reviews state with new document
            setReviews(prev => 
              prev.map(review => 
                review.id === reviewId 
                  ? { ...review, documents: [...review.documents, result.document] } 
                  : review
              )
            );
            
            toast({
              title: "Document Uploaded",
              description: `${file.name} has been uploaded successfully`,
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
      
      setSelectedFile(e.target.files[0]);
      toast({
        title: "File Selected",
        description: `${e.target.files[0].name} ready for upload`,
      });
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Schedule Review</h3>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleScheduleReview}>
            <Send className="mr-2 h-4 w-4" />
            Schedule & Notify
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Review Minutes</h3>
        <Textarea
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="Enter review minutes..."
          className="min-h-[100px]"
        />
        <Button onClick={handleUploadMinutes}>Upload Minutes</Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Supporting Documents</h3>
        <div className="space-y-2">
          <Label htmlFor="document">Upload Document</Label>
          <div className="flex items-center gap-4">
            <Input
              id="document"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
            />
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReviewManagement;
