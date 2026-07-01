import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MessageCircle, Send, Reply } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CommentSectionProps {
  postId: number;
}

interface Comment {
  id: number;
  postId: number;
  parentId: number | null;
  authorName: string;
  authorEmail: string;
  content: string;
  status: string;
  createdAt: Date;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const utils = trpc.useUtils();
  const { data: comments = [], isLoading } = trpc.comment.listByPost.useQuery({ postId });
  const { data: commentCount = 0 } = trpc.comment.getCount.useQuery({ postId });

  const createCommentMutation = trpc.comment.create.useMutation({
    onSuccess: () => {
      // Clear form
      setAuthorName("");
      setAuthorEmail("");
      setContent("");
      setReplyContent("");
      setReplyingTo(null);
      setIsSubmitting(false);
      
      // Refetch comments
      utils.comment.listByPost.invalidate({ postId });
      utils.comment.getCount.invalidate({ postId });
    },
    onError: (error) => {
      console.error("Failed to submit comment:", error);
      alert("Failed to submit comment. Please try again.");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authorName.trim() || !authorEmail.trim() || !content.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    createCommentMutation.mutate({
      postId,
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim(),
      content: content.trim(),
    });
  };

  const handleReply = (parentId: number) => {
    if (!authorName.trim() || !authorEmail.trim() || !replyContent.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    createCommentMutation.mutate({
      postId,
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim(),
      content: replyContent.trim(),
      parentId,
    });
  };

  // Organize comments into a tree structure
  const organizeComments = (comments: Comment[]) => {
    const commentMap = new Map<number, Comment & { replies: Comment[] }>();
    const rootComments: (Comment & { replies: Comment[] })[] = [];

    // First pass: create map of all comments
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into tree
    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parentId === null) {
        rootComments.push(commentWithReplies);
      } else {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      }
    });

    return rootComments;
  };

  const renderComment = (comment: Comment & { replies: Comment[] }, depth: number = 0) => {
    const isReplying = replyingTo === comment.id;
    const maxDepth = 3; // Maximum nesting level

    return (
      <div key={comment.id} className={depth > 0 ? "ml-8 mt-4" : ""}>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{comment.authorName}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <p className="text-foreground whitespace-pre-wrap">{comment.content}</p>
              
              {/* Reply Button */}
              {depth < maxDepth && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(isReplying ? null : comment.id)}
                  className="text-primary"
                >
                  <Reply className="h-4 w-4 mr-1" />
                  {isReplying ? "Cancel" : "Reply"}
                </Button>
              )}

              {/* Reply Form */}
              {isReplying && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      maxLength={100}
                      required
                    />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                      maxLength={320}
                      required
                    />
                  </div>
                  <Textarea
                    placeholder="Write your reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={3}
                    maxLength={5000}
                    required
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleReply(comment.id)}
                      disabled={isSubmitting}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      {isSubmitting ? "Submitting..." : "Submit Reply"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setReplyingTo(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Render nested replies */}
        {comment.replies.length > 0 && (
          <div className="space-y-4 mt-4">
            {comment.replies.map(reply => renderComment(reply as Comment & { replies: Comment[] }, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const organizedComments = organizeComments(comments as Comment[]);

  return (
    <div className="mt-12 space-y-8">
      {/* Comments Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">
          Comments ({commentCount})
        </h2>
      </div>

      {/* Comment Form */}
      <Card>
        <CardHeader>
          <CardTitle>Leave a Comment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  maxLength={100}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  maxLength={320}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Your email will not be published
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comment *</Label>
              <Textarea
                id="comment"
                placeholder="Share your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                maxLength={5000}
                required
              />
              <p className="text-xs text-muted-foreground text-right">
                {content.length} / 5000 characters
              </p>
            </div>

            <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground">
              <p>
                Your comment will be reviewed by our moderators before appearing on the site.
              </p>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Comment"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading comments...
          </div>
        ) : organizedComments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          organizedComments.map(comment => renderComment(comment))
        )}
      </div>
    </div>
  );
}
