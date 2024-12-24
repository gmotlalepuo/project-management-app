import { TaskComment } from "@/types/task";
import { CommentItem } from "./CommentItem";

type CommentListProps = {
  comments: TaskComment[];
  onDelete: (id: number) => void;
  onEdit: (id: number, content: string) => void;
  onReply: (content: string, parentId: number) => void;
};

export function CommentList({
  comments,
  onDelete,
  onEdit,
  onReply,
}: CommentListProps) {
  if (!comments || !Array.isArray(comments)) {
    return null;
  }

  return (
    <div className="mt-6 space-y-6">
      {comments
        .filter((comment) => comment && comment.id)
        .map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={onDelete}
            onEdit={onEdit}
            onReply={onReply}
          />
        ))}
    </div>
  );
}
