import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { TenderComment } from "@/types/tender";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext"; // Assuming you have an AuthContext

interface CommentsSectionProps {
  comments: TenderComment[];
  showComments: boolean;
  setShowComments: (show: boolean) => void;
  newComment: string;
  setNewComment: (comment: string) => void;
  onAddComment: (tenderId: string, text: string) => Promise<void>;
  tenderId: string;
}

const CommentsSection = ({
  comments,
  showComments,
  setShowComments,
  newComment,
  setNewComment,
  onAddComment,
  tenderId,
}: CommentsSectionProps) => {
  const { toast } = useToast();
  const { user } = useAuth(); // Get authenticated user from context
  const [localComment, setLocalComment] = useState(newComment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async () => {
    if (!localComment.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddComment(tenderId, localComment);
      setLocalComment("");
      setNewComment("");
      setShowComments(false);
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant="link"
        size="sm"
        onClick={() => setShowComments(true)}
        className="text-blue-600 hover:underline"
      >
        Show Comments ({comments.length})
      </Button>

      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>Review comments and feedback</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {comments.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="border p-2 rounded">
                    <p>{comment.text}</p>
                    <p className="text-sm text-gray-500">
                      By {comment.author} at {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No comments yet.</p>
            )}
            <Textarea
              value={localComment}
              onChange={(e) => {
                setLocalComment(e.target.value);
                setNewComment(e.target.value);
              }}
              placeholder="Add your comment..."
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddComment} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Comment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommentsSection;