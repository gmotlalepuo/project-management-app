import { Button } from "@/Components/ui/button";
import RichTextEditor from "@/Components/RichTextEditor";
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
      // Reset content after successful submission
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <RichTextEditor
        value={content}
        onChange={(value) => setContent(value)}
        placeholder="Write a comment..."
      />
      <div className="mt-4 flex items-center gap-2">
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
