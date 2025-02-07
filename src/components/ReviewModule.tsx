
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, AlertCircle, Calendar, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReviewModuleProps {
  committeeId: number;
  title: string;
  submissionDate: string;
  status: string;
}

const ReviewModule = ({ committeeId, title, submissionDate, status }: ReviewModuleProps) => {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: number; message: string; read: boolean }>>([]);

  const addNotification = (message: string) => {
    const newNotification = {
      id: Date.now(),
      message,
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleApprove = () => {
    console.log("Approving specification for committee:", committeeId);
    toast({
      title: "Specification Approved",
      description: "The committee has been notified of the approval.",
      variant: "default",
    });
    addNotification("Specification has been approved");
  };

  const handleRequestRevision = () => {
    console.log("Requesting revision for committee:", committeeId);
    toast({
      title: "Revision Requested",
      description: "A revision request has been sent to the committee.",
      variant: "destructive",
    });
    addNotification("Revision has been requested");
  };

  const handleViewDocument = () => {
    setShowPreview(true);
    console.log("Viewing document for committee:", committeeId);
    toast({
      title: "Opening Document",
      description: "Loading specification document...",
    });
  };

  return (
    <>
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
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
                )}
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

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
            <DialogDescription>
              Reviewing specification for {title}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-4 bg-gray-50 rounded-lg">
            {/* This is a placeholder for the actual document preview */}
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewModule;
