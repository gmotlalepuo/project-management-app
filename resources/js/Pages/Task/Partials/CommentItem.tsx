import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { TaskComment } from "@/types/task";
import { formatDate } from "@/utils/helpers";
import { Edit2, MessageCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { CommentForm } from "./CommentForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";

type CommentItemProps = {
  comment: TaskComment;
  onDelete: (id: number) => void;
  onEdit: (id: number, content: string) => void;
  onReply: (content: string, parentId: number) => void;
};

export function CommentItem({
  comment,
  onDelete,
  onEdit,
  onReply,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = (content: string) => {
    onEdit(comment.id, content);
    setIsEditing(false);
  };

  const handleReply = (content: string) => {
    onReply(content, comment.id);
    setIsReplying(false);
  };

  const handleDelete = () => {
    onDelete(comment.id);
    setShowDeleteDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src={comment.user.profile_picture} />
          <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.user.name}</span>
              <span className="text-sm text-muted-foreground">
                {formatDate(comment.created_at)}
              </span>
              {comment.is_edited && (
                <span className="text-sm text-muted-foreground">(edited)</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {comment.can.edit && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              {comment.can.reply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(true)}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              )}
              {comment.can.delete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {isEditing ? (
            <CommentForm
              initialContent={comment.content}
              onSubmit={handleEdit}
              submitLabel="Save"
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              {comment.content}
            </div>
          )}
        </div>
      </div>

      {isReplying && (
        <div className="ml-12">
          <CommentForm
            onSubmit={handleReply}
            submitLabel="Reply"
            onCancel={() => setIsReplying(false)}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 space-y-4">
          {comment.replies.map(
            (reply) =>
              reply && (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onReply={onReply}
                />
              ),
          )}
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
