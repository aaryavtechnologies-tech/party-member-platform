"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, Undo, Redo, Link as LinkIcon, Image as ImageIcon, Unlink 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload?: () => void;
}

export function RichTextEditor({ content, onChange, onImageUpload }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none dark:prose-invert min-h-[400px] p-4 bg-white dark:bg-slate-950 rounded-b-xl border border-t-0 border-slate-200 dark:border-slate-800",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const toggleLink = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // We can use a FileReader to insert a base64 string, OR upload to API and insert URL.
    // Given we want a simple approach now, we'll upload via standard FormData to our upload endpoint if it exists.
    // Assuming there's a generic upload API. If not, fallback to base64 for immediate visual (not ideal for DB size, but works).
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      editor.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // reset
  };

  return (
    <div className="flex flex-col rounded-xl overflow-hidden shadow-sm">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-xl sticky top-0 z-10">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          icon={<Bold className="w-4 h-4" />}
          title="Bold"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          icon={<Italic className="w-4 h-4" />}
          title="Italic"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          icon={<Strikethrough className="w-4 h-4" />}
          title="Strikethrough"
        />
        
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          icon={<Heading1 className="w-4 h-4" />}
          title="Heading 1"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          icon={<Heading2 className="w-4 h-4" />}
          title="Heading 2"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          icon={<Heading3 className="w-4 h-4" />}
          title="Heading 3"
        />

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          icon={<List className="w-4 h-4" />}
          title="Bullet List"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          icon={<ListOrdered className="w-4 h-4" />}
          title="Ordered List"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          icon={<Quote className="w-4 h-4" />}
          title="Blockquote"
        />

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

        <MenuButton
          onClick={toggleLink}
          active={editor.isActive("link")}
          icon={<LinkIcon className="w-4 h-4" />}
          title="Add Link"
        />
        <MenuButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          active={false}
          disabled={!editor.isActive("link")}
          icon={<Unlink className="w-4 h-4" />}
          title="Remove Link"
        />

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
        <label
          className="p-2 rounded-lg transition-colors flex items-center justify-center text-slate-600 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          title="Add Image"
        >
          <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleInlineImageUpload}
          />
        </label>

        <div className="flex-1" />

        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          active={false}
          icon={<Undo className="w-4 h-4" />}
          title="Undo"
        />
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          active={false}
          icon={<Redo className="w-4 h-4" />}
          title="Redo"
        />
      </div>
      
      <EditorContent editor={editor} />
    </div>
  );
}

function MenuButton({ 
  onClick, active, icon, title, disabled = false 
}: { 
  onClick: () => void, active: boolean, icon: React.ReactNode, title: string, disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-2 rounded-lg transition-colors flex items-center justify-center",
        active ? "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white" : "text-slate-600 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white",
        disabled && "opacity-30 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent"
      )}
      type="button"
    >
      {icon}
    </button>
  );
}
