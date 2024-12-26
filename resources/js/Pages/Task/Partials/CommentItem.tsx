import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { TaskComment } from "@/types/task";
import { formatDate } from "@/utils/helpers";
import { Edit2, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { CommentForm } from "./CommentForm";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";

type CommentItemProps = {
  comment: TaskComment;
  onDelete: (id: number) => void;
  onEdit: (id: number, content: string) => void;
  onReply: (content: string, parentId: number) => void;
  level?: number;
};

export function CommentItem({
  comment,
  onDelete,
  onEdit,
  onReply,
  level = 0,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const handleEdit = (content: string) => {
    onEdit(comment.id, content);
    setIsEditing(false);
  };

  const handleReply = (content: string) => {
    onReply(content, comment.id);
    setIsReplying(false);
  };

  const handleDelete = () => {
    showConfirmation({
      title: "Delete Comment",
      description:
        "Are you sure you want to delete this comment? This action cannot be undone.",
      action: () => onDelete(comment.id),
      actionText: "Delete",
    });
  };

  return (
    <div
      className={`relative ${level > 0 ? "rounded-lg border-l border-zinc-300 p-4 dark:border-zinc-600" : ""}`}
    >
      <div className="flex items-start space-x-4 overflow-auto">
        <Avatar className={level === 0 ? "h-10 w-10" : "h-8 w-8"}>
          <AvatarImage src={comment.user.profile_picture} />
          <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2 text-sm">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <div className="font-semibold">{comment.user.name}</div>
            <div className="text-xs text-muted-foreground">
              {formatDate(comment.created_at)}
            </div>
            {comment.is_edited && (
              <div className="text-xs text-muted-foreground">(edited)</div>
            )}
          </div>

          {isEditing ? (
            <CommentForm
              initialContent={comment.content}
              onSubmit={handleEdit}
              submitLabel="Save"
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div
              className="break-words text-sm"
              dangerouslySetInnerHTML={{ __html: comment.content }}
            />
          )}

          <div className="flex flex-col items-start gap-1 text-xs sm:flex-row sm:items-center sm:gap-2">
            {comment.can.edit && (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full p-1"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-3.5 w-3" />
                <div>Edit</div>
              </Button>
            )}
            {comment.can.reply && (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full p-1"
                onClick={() => setIsReplying(true)}
              >
                <ChevronDown className="h-3.5 w-3" />
                <div>Reply</div>
              </Button>
            )}
            {comment.can.delete && (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full p-1 text-primary"
                onClick={handleDelete}
              >
                <Trash2 className="h-3.5 w-3" />
                <div>Delete</div>
              </Button>
            )}
          </div>
        </div>
      </div>

      {isReplying && (
        <div className="mt-4">
          <CommentForm
            onSubmit={handleReply}
            submitLabel="Reply"
            onCancel={() => setIsReplying(false)}
          />
        </div>
      )}

      <ConfirmationDialog />
    </div>
  );
}
