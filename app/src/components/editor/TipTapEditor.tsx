'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
}

export default function TipTapEditor({
  content,
  onChange,
  editable = true,
  placeholder = "Start writing..."
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-4',
        'data-placeholder': placeholder,
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  return (
    <div className="w-full max-w-none">
      <EditorContent 
        editor={editor} 
        className="min-h-[500px] w-full border rounded-lg bg-white dark:bg-gray-900"
      />
    </div>
  );
}
