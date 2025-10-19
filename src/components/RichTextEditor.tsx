"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Minus
} from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ content, onChange, placeholder = "Start writing...", className = "" }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 text-gray-900',
      },
    },
  });

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-md p-4 min-h-[300px] flex items-center justify-center">
        <div className="text-gray-700">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className={`border border-gray-300 rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 flex flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('bold') ? 'bg-gray-200' : ''
            }`}
            title="Bold"
          >
            <Bold className="h-4 w-4 text-black" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('italic') ? 'bg-gray-200' : ''
            }`}
            title="Italic"
          >
            <Italic className="h-4 w-4 text-black" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('code') ? 'bg-gray-200' : ''
            }`}
            title="Inline Code"
          >
            <Code className="h-4 w-4 text-black" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
            }`}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4 text-black" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
            }`}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4 text-black" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''
            }`}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4 text-black" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('bulletList') ? 'bg-gray-200' : ''
            }`}
            title="Bullet List"
          >
            <List className="h-4 w-4 text-black" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('orderedList') ? 'bg-gray-200' : ''
            }`}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4 text-black" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('blockquote') ? 'bg-gray-200' : ''
            }`}
            title="Quote"
          >
            <Quote className="h-4 w-4 text-black" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="Undo"
          >
            <Undo className="h-4 w-4 text-black" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="Redo"
          >
            <Redo className="h-4 w-4 text-black" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded hover:bg-gray-100 transition-colors"
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4 text-black" />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="min-h-[300px] max-w-none text-gray-900 [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[300px]"
      />
    </div>
  );
}