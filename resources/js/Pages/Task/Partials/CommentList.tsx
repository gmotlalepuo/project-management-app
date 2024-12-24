import { TaskComment } from "@/types/task";
import { CommentItem } from "./CommentItem";

type CommentListProps = {
  comments: TaskComment[];
  onDelete: (id: number) => void;
  onEdit: (id: number, content: string) => void;
  onReply: (content: string, parentId: number) => void;
  level?: number;
};

export function CommentList({
  comments,
  onDelete,
  onEdit,
  onReply,
  level = 0,
}: CommentListProps) {
  if (!comments || !Array.isArray(comments)) {
    return null;
  }

  return (
    <div className={`mt-6 space-y-6 ${level > 0 ? "ml-12" : ""}`}>
      {comments
        .filter((comment) => comment && comment.id)
        .map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={onDelete}
            onEdit={onEdit}
            onReply={onReply}
            level={level}
          />
        ))}
    </div>
  );
}
