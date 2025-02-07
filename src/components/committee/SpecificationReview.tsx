
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
import type { SpecificationReview as SpecificationReviewType, DocumentStatus } from "@/types/committee";

interface SpecificationReviewProps {
  review: SpecificationReviewType;
  onScheduleReview: (date: string) => void;
  onAddMinutes: (minutes: string) => void;
  onUploadDocument: (file: File) => void;
  onUpdateStatus: (status: DocumentStatus) => void;
}

const SpecificationReview = ({
  review,
  onScheduleReview,
  onAddMinutes,
  onUploadDocument,
  onUpdateStatus,
}: SpecificationReviewProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [minutes, setMinutes] = useState("");

  const handleSchedule = () => {
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    onScheduleReview(date.toISOString());
    setDate(undefined);
    toast({
      title: "Review Scheduled",
      description: "Review has been scheduled successfully",
    });
  };

  const handleMinutesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMinutes(minutes);
    setMinutes("");
    toast({
      title: "Minutes Added",
      description: "Review minutes have been added successfully",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadDocument(e.target.files[0]);
      toast({
        title: "Document Uploaded",
        description: "Review document has been uploaded successfully",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Schedule Review</h3>
        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleSchedule}>Schedule</Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Upload Documents</h3>
        <div className="flex items-center gap-4">
          <Input
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

      <form onSubmit={handleMinutesSubmit} className="space-y-4">
        <div>
          <Label htmlFor="minutes">Review Minutes</Label>
          <Textarea
            id="minutes"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="h-32"
            placeholder="Enter review minutes..."
          />
        </div>
        <Button type="submit">Add Minutes</Button>
      </form>

      <div>
        <Label htmlFor="status">Review Status</Label>
        <select
          id="status"
          value={review.status}
          onChange={(e) => onUpdateStatus(e.target.value as DocumentStatus)}
          className="w-full p-2 border rounded-md"
        >
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {review.minutes && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Previous Minutes</h4>
          <p className="text-sm">{review.minutes}</p>
        </div>
      )}
    </div>
  );
};

export default SpecificationReview;
