
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, AlertCircle, Calendar, Bell, MessageSquare, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ReviewModuleProps {
  committeeId: number;
  title: string;
  submissionDate: string;
  status: string;
}

interface Comment {
  id: number;
  text: string;
  timestamp: string;
  author: string;
}

interface ReviewHistory {
  id: number;
  action: 'approved' | 'revision_requested';
  timestamp: string;
  comment?: string;
}

const ReviewModule = ({ committeeId, title, submissionDate, status }: ReviewModuleProps) => {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [notifications, setNotifications] = useState<Array<{ id: number; message: string; read: boolean }>>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reviewHistory, setReviewHistory] = useState<ReviewHistory[]>([]);

  const addNotification = (message: string) => {
    const newNotification = {
      id: Date.now(),
      message,
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now(),
        text: newComment,
        timestamp: new Date().toISOString(),
        author: "Current User", // In a real app, this would come from auth context
      };
      setComments(prev => [comment, ...prev]);
      setNewComment("");
      toast({
        title: "Comment Added",
        description: "Your comment has been added to the review.",
      });
    }
  };

  const handleApprove = () => {
    const historyEntry: ReviewHistory = {
      id: Date.now(),
      action: 'approved',
      timestamp: new Date().toISOString(),
    };
    setReviewHistory(prev => [historyEntry, ...prev]);
    addNotification("Specification has been approved");
    toast({
      title: "Specification Approved",
      description: "The committee has been notified of the approval.",
      variant: "default",
    });
  };

  const handleRequestRevision = () => {
    const historyEntry: ReviewHistory = {
      id: Date.now(),
      action: 'revision_requested',
      timestamp: new Date().toISOString(),
    };
    setReviewHistory(prev => [historyEntry, ...prev]);
    addNotification("Revision has been requested");
    toast({
      title: "Revision Requested",
      description: "A revision request has been sent to the committee.",
      variant: "destructive",
    });
  };

  const handleViewDocument = () => {
    setShowPreview(true);
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
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setShowComments(true)}
              >
                <MessageSquare className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                {comments.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                    {comments.length}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setShowHistory(true)}
              >
                <History className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </Button>
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
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>
              Review comments and feedback
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Add your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={handleAddComment}>Add Comment</Button>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{comment.author}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review History</DialogTitle>
            <DialogDescription>
              Timeline of review actions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {reviewHistory.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                {entry.action === 'approved' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <div className="font-medium">
                    {entry.action === 'approved' ? 'Specification Approved' : 'Revision Requested'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                  {entry.comment && (
                    <p className="mt-2 text-gray-700">{entry.comment}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewModule;
