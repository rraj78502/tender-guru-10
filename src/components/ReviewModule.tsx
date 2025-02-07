
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ReviewModuleProps {
  committeeId: number;
  title: string;
  submissionDate: string;
  status: string;
}

const ReviewModule = ({ committeeId, title, submissionDate, status }: ReviewModuleProps) => {
  const { toast } = useToast();

  const handleApprove = () => {
    console.log("Approving specification for committee:", committeeId);
    toast({
      title: "Specification Approved",
      description: "The committee has been notified of the approval.",
      variant: "default",
    });
  };

  const handleRequestRevision = () => {
    console.log("Requesting revision for committee:", committeeId);
    toast({
      title: "Revision Requested",
      description: "A revision request has been sent to the committee.",
      variant: "destructive",
    });
  };

  const handleViewDocument = () => {
    console.log("Viewing document for committee:", committeeId);
    toast({
      title: "Opening Document",
      description: "Loading specification document...",
    });
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="flex items-center gap-2 mt-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Submitted: {new Date(submissionDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Badge 
            variant={status === "pending_review" ? "secondary" : "default"}
            className="flex items-center gap-1"
          >
            {status === "pending_review" ? (
              <>
                <AlertCircle className="h-3 w-3" />
                Pending Review
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3" />
                Reviewed
              </>
            )}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          <FileText className="h-4 w-4" />
          <span>Specification Document</span>
          <Button 
            variant="link" 
            className="text-sm p-0 h-auto text-blue-600 hover:text-blue-700" 
            onClick={handleViewDocument}
          >
            View Document
          </Button>
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            onClick={handleApprove}
            className="bg-green-500 hover:bg-green-600 text-white transition-colors"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button
            variant="outline"
            onClick={handleRequestRevision}
            className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Request Revision
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ReviewModule;
