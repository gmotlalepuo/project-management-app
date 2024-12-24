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
    <div className={`space-y-4 ${level > 0 ? "ml-8 sm:ml-10" : ""}`}>
      {comments
        .filter((comment) => comment && comment.id)
        .map((comment) => (
          <div key={comment.id} className="relative">
            <CommentItem
              comment={comment}
              onDelete={onDelete}
              onEdit={onEdit}
              onReply={onReply}
              level={level}
            />
            {comment.replies && comment.replies.length > 0 && (
              <CommentList
                comments={comment.replies}
                onDelete={onDelete}
                onEdit={onEdit}
                onReply={onReply}
                level={level + 1}
              />
            )}
          </div>
        ))}
    </div>
  );
}
