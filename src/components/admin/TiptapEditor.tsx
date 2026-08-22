"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, ImageIcon, Loader2, Undo, Redo 
} from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4 bg-white dark:bg-slate-950 rounded-b-xl border border-t-0 border-slate-200 dark:border-slate-800',
      },
    },
  });

  if (!editor) {
    return <div className="h-[300px] bg-slate-50 dark:bg-slate-900 rounded-xl animate-pulse" />;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }
      const data = await res.json();
      
      editor.chain().focus().setImage({ src: data.url }).run();
      toast.success("Image inserted into editor");
    } catch (error: any) {
      console.error("Editor image upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-xl border-b-0">
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Heading 1"
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-slate-200 dark:bg-slate-800 font-bold text-primary' : 'text-slate-700 dark:text-slate-300'}`}
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 dark:bg-slate-800 font-bold text-primary' : 'text-slate-700 dark:text-slate-300'}`}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-slate-200 dark:bg-slate-800 font-bold text-primary' : 'text-slate-700 dark:text-slate-300'}`}
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

        {/* Text Formats */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive('bold') ? 'bg-slate-200 dark:bg-slate-800 font-bold text-primary' : 'text-slate-700 dark:text-slate-300'}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive('italic') ? 'bg-slate-200 dark:bg-slate-800 font-bold text-primary' : 'text-slate-700 dark:text-slate-300'}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive('strike') ? 'bg-slate-200 dark:bg-slate-800 font-bold text-primary' : 'text-slate-700 dark:text-slate-300'}`}
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive('bulletList') ? 'bg-slate-200 dark:bg-slate-800 font-bold text-primary' : 'text-slate-700 dark:text-slate-300'}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive('orderedList') ? 'bg-slate-200 dark:bg-slate-800 font-bold text-primary' : 'text-slate-700 dark:text-slate-300'}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${editor.isActive('blockquote') ? 'bg-slate-200 dark:bg-slate-800 font-bold text-primary' : 'text-slate-700 dark:text-slate-300'}`}
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

        {/* Media */}
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          title="Upload / Insert Image"
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 text-slate-700 dark:text-slate-300 transition-colors"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
        </button>

        <div className="flex-1" />

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
