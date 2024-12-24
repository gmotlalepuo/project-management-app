import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { useState } from "react";

type CommentFormProps = {
  onSubmit: (content: string) => void;
  parentId?: number;
  initialContent?: string;
  submitLabel?: string;
  onCancel?: () => void;
};

export function CommentForm({
  onSubmit,
  parentId,
  initialContent = "",
  submitLabel = "Comment",
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Leave a comment..."
        required
      />
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={!content.trim()}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
