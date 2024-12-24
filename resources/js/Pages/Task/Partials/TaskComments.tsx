import { Card } from "@/Components/ui/card";
import { Task, TaskComment } from "@/types/task";
import { useState, useEffect } from "react";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import { useToast } from "@/hooks/use-toast";
import { router } from "@inertiajs/react";

type TaskCommentsProps = {
  task: Task;
};

type PageProps = {
  task?: Task;
  success?: string;
  comment?: TaskComment;
};

export function TaskComments({ task }: TaskCommentsProps) {
  const [comments, setComments] = useState<TaskComment[]>(task.comments);
  const { toast } = useToast();

  useEffect(() => {
    setComments(task.comments);
  }, [task.comments]);

  const showSuccessToast = (message: string) => {
    toast({
      title: "Success",
      description: message,
      variant: "success",
    });
  };

  const showErrorToast = () => {
    toast({
      title: "Error",
      description: "Operation failed",
      variant: "destructive",
    });
  };

  const handleCommentSubmit = (content: string, parentId?: number) => {
    router.post(
      route("task.comments.store", task.id),
      { content, parent_id: parentId },
      {
        preserveScroll: true,
        onSuccess: (page) => {
          const response = page.props as unknown as PageProps;
          if (response.task?.comments) {
            setComments(response.task.comments);
            showSuccessToast(response.success || "Comment posted successfully");
          }
        },
        onError: showErrorToast,
      },
    );
  };

  const handleCommentDelete = (commentId: number) => {
    router.delete(
      route("task.comments.destroy", { task: task.id, comment: commentId }),
      {
        preserveScroll: true,
        onSuccess: () => {
          const updatedComments = comments.reduce<TaskComment[]>((acc, comment) => {
            if (comment.id === commentId) return acc;

            if (comment.replies) {
              comment.replies = comment.replies.filter(
                (reply) => reply.id !== commentId,
              );
            }

            return [...acc, comment];
          }, []);

          setComments(updatedComments);
          showSuccessToast("Comment deleted successfully");
        },
        onError: showErrorToast,
      },
    );
  };

  const handleCommentEdit = (commentId: number, content: string) => {
    router.put(
      route("task.comments.update", { task: task.id, comment: commentId }),
      { content },
      {
        preserveScroll: true,
        onSuccess: (page) => {
          const response = page.props as unknown as PageProps;
          if (response.comment) {
            const updatedComments = comments.map((comment) =>
              comment.id === commentId ? response.comment! : comment,
            );
            setComments(updatedComments);
            showSuccessToast(response.success || "Comment updated successfully");
          }
        },
        onError: showErrorToast,
      },
    );
  };

  return (
    <Card className="space-y-6 p-4">
      <CommentForm onSubmit={handleCommentSubmit} />
      <CommentList
        comments={comments}
        onDelete={handleCommentDelete}
        onEdit={handleCommentEdit}
        onReply={handleCommentSubmit}
      />
    </Card>
  );
}
