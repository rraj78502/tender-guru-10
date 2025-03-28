
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

interface Comment {
  id: number;
  text: string;
  timestamp: string;
  author: string;
}

interface CommentsSectionProps {
  comments: Comment[];
  showComments: boolean;
  setShowComments: (show: boolean) => void;
  newComment: string;
  setNewComment: (comment: string) => void;
  onAddComment: () => void;
}

const CommentsSection = ({
  comments,
  showComments,
  setShowComments,
  newComment,
  setNewComment,
  onAddComment,
}: CommentsSectionProps) => {
  return (
    <>
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
              {/* BACKEND API: Add comment to item (tender, specification, etc.)
              // Endpoint: POST /api/comments
              // Request: { itemId: number, itemType: string, text: string }
              // Response: { id: number, text: string, timestamp: string, author: string }
              
              // Integration Code:
              const addComment = async (itemId: number, itemType: string, text: string) => {
                try {
                  const response = await fetch('/api/comments', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      itemId,
                      itemType,
                      text
                    }),
                  });
                  
                  if (!response.ok) throw new Error('Failed to add comment');
                  
                  const commentData = await response.json();
                  return commentData;
                } catch (error) {
                  console.error('Error adding comment:', error);
                  throw error;
                }
              }; */}
              <Button onClick={onAddComment}>Add Comment</Button>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {/* BACKEND API: Get comments for an item
              // Endpoint: GET /api/comments
              // Request: { itemId: number, itemType: string }
              // Response: Array of Comment objects
              
              // Integration Code:
              const getComments = async (itemId: number, itemType: string) => {
                try {
                  const response = await fetch(`/api/comments?itemId=${itemId}&itemType=${itemType}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                  
                  if (!response.ok) throw new Error('Failed to fetch comments');
                  
                  const comments = await response.json();
                  return comments;
                } catch (error) {
                  console.error('Error fetching comments:', error);
                  return [];
                }
              }; */}
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
    </>
  );
};

export default CommentsSection;
