
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload, Clock, FileText, Users } from "lucide-react";
import type { SpecificationReview as SpecificationReviewType, DocumentStatus, CommitteeMember } from "@/types/committee";

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
    
    if (onNotifyTeam && review.reviewers.length > 0) {
      onNotifyTeam(review.reviewers);
      toast({
        title: "Team Notified",
        description: "Review team has been notified of the scheduled date",
      });
    }

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

  const getStatusBadgeColor = (status: DocumentStatus) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Review Management</h3>
        <Badge className={getStatusBadgeColor(review.status)}>
          {review.status.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label>Schedule Review</Label>
            <div className="flex gap-4 mt-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
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
            <Label>Review Team</Label>
            <div className="mt-2 p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">
                  {review.reviewers.length} team members
                </span>
              </div>
              <div className="space-y-2">
                {review.reviewers.map((member, index) => (
                  <div key={member.id} className="text-sm">
                    {member.name} ({member.role})
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Upload Documents</Label>
            <div className="flex items-center gap-4 mt-2">
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

      {review.minutes && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <h4 className="font-medium">Previous Minutes</h4>
          </div>
          <p className="text-sm text-gray-600">{review.minutes}</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: {format(new Date(review.actualDate || review.scheduledDate), "PPP")}</span>
          </div>
        </div>
      )}

      {review.documents.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Uploaded Documents</h4>
          <div className="space-y-2">
            {review.documents.map((doc, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-gray-500" />
                <span>{doc.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecificationReview;

