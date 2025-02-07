
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface DateInputsProps {
  formDate: string;
  specificationDate: string;
  reviewDate: string;
  onFormDateChange: (date: string) => void;
  onSpecificationDateChange: (date: string) => void;
  onReviewDateChange: (date: string) => void;
}

const DateInputs = ({
  formDate,
  specificationDate,
  reviewDate,
  onFormDateChange,
  onSpecificationDateChange,
  onReviewDateChange,
}: DateInputsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="formation-date">Formation Date</Label>
          <Input
            id="formation-date"
            type="date"
            value={formDate}
            onChange={(e) => onFormDateChange(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="specification-date">Specification Submission Date</Label>
          <Input
            id="specification-date"
            type="date"
            value={specificationDate}
            onChange={(e) => onSpecificationDateChange(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="review-date">Review Date</Label>
        <div className="flex items-center gap-4">
          <Input
            id="review-date"
            type="date"
            value={reviewDate}
            onChange={(e) => onReviewDateChange(e.target.value)}
          />
          <Button type="button" variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
        </div>
      </div>
    </>
  );
};

export default DateInputs;
