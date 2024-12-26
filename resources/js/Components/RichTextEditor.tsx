import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Strikethrough, Italic, List, ListOrdered } from "lucide-react";
import { Toggle } from "@/Components/ui/toggle";
import { Separator } from "@/Components/ui/separator";
import React from "react";

const RichTextEditor = ({
  value,
  onChange,
  className = "",
  placeholder = "",
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: `w-full min-h-[135px] max-h-[135px] rounded-md rounded-br-none rounded-bl-none border border-input bg-transparent px-3 py-2 border-b-0 text-sm ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto ${className}`,
      },
    },
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-4 space-y-1",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-4 space-y-1",
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "mb-1",
          },
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:h-0 before:pointer-events-none",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Reset editor content when value is empty
  React.useEffect(() => {
    if (editor && value === "") {
      editor.commands.setContent("");
    }
  }, [value, editor]);

  return (
    <div className="w-full">
      <EditorContent editor={editor} className="w-full" />
      {editor ? <RichTextEditorToolbar editor={editor} /> : null}
    </div>
  );
};

const RichTextEditorToolbar = ({ editor }: { editor: Editor }) => {
  return (
    <div className="flex w-full flex-row items-center gap-1 rounded-bl-md rounded-br-md border border-input bg-transparent p-1">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="h-8 w-[1px]" />
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
    </div>
  );
};

export default RichTextEditor;
