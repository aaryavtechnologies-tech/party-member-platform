"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Bold, Italic, List, ListOrdered, ImageIcon, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content,
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

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      
      editor.chain().focus().setImage({ src: data.url }).run();
    } catch (error) {
      console.error(error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-xl border-b-0">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('bold') ? 'bg-slate-200 dark:bg-slate-800' : ''}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('italic') ? 'bg-slate-200 dark:bg-slate-800' : ''}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('bulletList') ? 'bg-slate-200 dark:bg-slate-800' : ''}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${editor.isActive('orderedList') ? 'bg-slate-200 dark:bg-slate-800' : ''}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1" />
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
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
