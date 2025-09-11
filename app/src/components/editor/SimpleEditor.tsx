'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic } from 'lucide-react';

export default function SimpleEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World! Try making this <strong>bold</strong> or <em>italic</em>.</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none p-4 min-h-[200px] border border-gray-300 rounded-md',
      },
    },
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            console.log('Bold clicked');
            editor.chain().focus().toggleBold().run();
          }}
          className={`px-3 py-1 rounded border ${
            editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            console.log('Italic clicked');
            editor.chain().focus().toggleItalic().run();
          }}
          className={`px-3 py-1 rounded border ${
            editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
        >
          <Italic className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
