'use client';

import { Editor } from '@tiptap/react';

interface EditorToolbarProps {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 p-3 bg-gray-50">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1 text-sm border rounded ${
            editor.isActive('heading', { level: 1 }) 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 text-sm border rounded ${
            editor.isActive('heading', { level: 2 }) 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 text-sm border rounded ${
            editor.isActive('heading', { level: 3 }) 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-3 py-1 text-sm border rounded ${
            editor.isActive('paragraph') 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          Paragraph
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 text-sm border rounded ${
            editor.isActive('bold') 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 text-sm border rounded ${
            editor.isActive('italic') 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 text-sm border rounded ${
            editor.isActive('strike') 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          Strike
        </button>
      </div>
    </div>
  );
}
