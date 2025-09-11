'use client';

import { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EditorToolbar from './EditorToolbar';
import { useAutoSave, SaveStatus } from '../../hooks/useAutoSave';
import { Save, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface DocumentEditorProps {
  initialContent?: string;
  onSave: (content: string) => Promise<void>;
  placeholder?: string;
  editable?: boolean;
  autoSave?: boolean;
  className?: string;
}

export default function DocumentEditor({
  initialContent = '',
  onSave,
  placeholder = "Start writing your document...",
  editable = true,
  autoSave = true,
  className = ''
}: DocumentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');

  const handleSave = useCallback(async (contentToSave: string) => {
    try {
      await onSave(contentToSave);
    } catch (error) {
      throw error;
    }
  }, [onSave]);

  const { debouncedSave, forceSave, getStatus } = useAutoSave({
    onSave: handleSave,
    debounceMs: 1500,
    enabled: autoSave
  });

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
    content: initialContent,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      
      if (autoSave) {
        debouncedSave(html);
        // Update status immediately to show "unsaved"
        setSaveStatus('unsaved');
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-6 max-w-none',
        'data-placeholder': placeholder,
      },
    },
  });

  // Update save status periodically
  useEffect(() => {
    if (!autoSave) return;

    const interval = setInterval(() => {
      const currentStatus = getStatus();
      setSaveStatus(currentStatus);
    }, 500);

    return () => clearInterval(interval);
  }, [getStatus, autoSave]);


  const handleManualSave = async () => {
    if (editor && !autoSave) {
      const currentContent = editor.getHTML();
      setSaveStatus('saving');
      try {
        await forceSave(currentContent);
        setSaveStatus('saved');
      } catch (error) {
        setSaveStatus('error');
      }
    }
  };

  const SaveStatusIndicator = () => {
    const getStatusIcon = () => {
      switch (saveStatus) {
        case 'saved':
          return <CheckCircle className="w-4 h-4 text-green-600" />;
        case 'saving':
          return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
        case 'unsaved':
          return <Save className="w-4 h-4 text-yellow-600" />;
        case 'error':
          return <AlertCircle className="w-4 h-4 text-red-600" />;
        default:
          return null;
      }
    };

    const getStatusText = () => {
      switch (saveStatus) {
        case 'saved':
          return 'All changes saved';
        case 'saving':
          return 'Saving...';
        case 'unsaved':
          return 'Unsaved changes';
        case 'error':
          return 'Save failed';
        default:
          return '';
      }
    };

    return (
      <div className="flex items-center gap-2 text-sm">
        {getStatusIcon()}
        <span className={`${
          saveStatus === 'error' ? 'text-red-600' : 
          saveStatus === 'saved' ? 'text-green-600' : 
          saveStatus === 'saving' ? 'text-blue-600' : 
          'text-yellow-600'
        }`}>
          {getStatusText()}
        </span>
      </div>
    );
  };

  return (
    <div className={`w-full max-w-none ${className}`}>
      {/* Header with save status and manual save button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <SaveStatusIndicator />
        
        {!autoSave && (
          <button
            onClick={handleManualSave}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveStatus === 'saving' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </button>
        )}
      </div>

      {/* Editor Toolbar */}
      {editor ? (
        <EditorToolbar editor={editor} />
      ) : (
        <div className="border-b border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800">
          <div className="text-sm text-gray-500">Loading toolbar...</div>
        </div>
      )}

      {/* Editor Content */}
      <div className="bg-white dark:bg-gray-900">
        <EditorContent 
          editor={editor} 
          className="min-h-[500px] w-full"
        />
      </div>
    </div>
  );
}
