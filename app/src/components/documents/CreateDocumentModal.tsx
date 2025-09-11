'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { X, FileText, File, BookOpen, Code, Lightbulb, FolderPlus } from 'lucide-react';

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: Id<'projects'>;
  onDocumentCreated?: (documentId: Id<'documents'>) => void;
  currentUserId: Id<'users'>;
}

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  content: string;
  type: 'markdown' | 'template';
}

const documentTemplates: DocumentTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Document',
    description: 'Start with an empty document',
    icon: <FileText className="w-5 h-5" />,
    content: '<h1>New Document</h1><p>Start writing here...</p>',
    type: 'markdown'
  },
  {
    id: 'readme',
    name: 'README',
    description: 'Project documentation template',
    icon: <BookOpen className="w-5 h-5" />,
    content: `<h1>Project Name</h1>
<p>Brief description of your project.</p>

<h2>Installation</h2>
<pre><code>npm install your-project</code></pre>

<h2>Usage</h2>
<p>How to use your project...</p>

<h2>Contributing</h2>
<p>Guidelines for contributors...</p>

<h2>License</h2>
<p>MIT License</p>`,
    type: 'template'
  },
  {
    id: 'api-docs',
    name: 'API Documentation',
    description: 'Document your API endpoints',
    icon: <Code className="w-5 h-5" />,
    content: `<h1>API Documentation</h1>

<h2>Overview</h2>
<p>Brief overview of your API...</p>

<h2>Authentication</h2>
<p>How to authenticate with your API...</p>

<h2>Endpoints</h2>

<h3>GET /api/endpoint</h3>
<p>Description of the endpoint...</p>

<h4>Parameters</h4>
<ul>
<li><code>param1</code> (string) - Description</li>
<li><code>param2</code> (number) - Description</li>
</ul>

<h4>Response</h4>
<pre><code>{
  "status": "success",
  "data": {}
}</code></pre>`,
    type: 'template'
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    description: 'Template for meeting minutes',
    icon: <Lightbulb className="w-5 h-5" />,
    content: `<h1>Meeting Notes - [Date]</h1>

<h2>Attendees</h2>
<ul>
<li>Name 1</li>
<li>Name 2</li>
</ul>

<h2>Agenda</h2>
<ol>
<li>Topic 1</li>
<li>Topic 2</li>
</ol>

<h2>Discussion</h2>
<p>Key points discussed...</p>

<h2>Action Items</h2>
<ul>
<li>[ ] Task 1 - Assigned to: Person</li>
<li>[ ] Task 2 - Assigned to: Person</li>
</ul>

<h2>Next Meeting</h2>
<p>Date and time of next meeting...</p>`,
    type: 'template'
  },
  {
    id: 'spec',
    name: 'Technical Specification',
    description: 'Technical specification document',
    icon: <File className="w-5 h-5" />,
    content: `<h1>Technical Specification: [Feature Name]</h1>

<h2>Overview</h2>
<p>Brief overview of the feature or system...</p>

<h2>Requirements</h2>
<h3>Functional Requirements</h3>
<ul>
<li>Requirement 1</li>
<li>Requirement 2</li>
</ul>

<h3>Non-Functional Requirements</h3>
<ul>
<li>Performance requirements</li>
<li>Security requirements</li>
</ul>

<h2>Architecture</h2>
<p>High-level architecture description...</p>

<h2>Implementation Details</h2>
<p>Detailed implementation notes...</p>

<h2>Testing Strategy</h2>
<p>How this will be tested...</p>

<h2>Deployment</h2>
<p>Deployment considerations...</p>`,
    type: 'template'
  }
];

export function CreateDocumentModal({ 
  isOpen, 
  onClose, 
  projectId, 
  onDocumentCreated,
  currentUserId 
}: CreateDocumentModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('blank');
  const [documentName, setDocumentName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<Id<'projects'> | undefined>(projectId);
  const [isCreating, setIsCreating] = useState(false);

  const createDocument = useMutation(api.documents.create);
  const projects = useQuery(api.projects.listByOwner, { ownerId: currentUserId });

  const handleCreate = async () => {
    if (!documentName.trim() || !selectedProjectId) return;

    const template = documentTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    setIsCreating(true);
    try {
      const docId = await createDocument({
        projectId: selectedProjectId,
        name: documentName.trim(),
        content: template.content,
        path: '/',
        type: template.type,
        authorId: currentUserId,
        tags: [],
        metadata: {
          wordCount: template.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length,
          lastEditor: currentUserId,
          version: 1,
        }
      });

      onDocumentCreated?.(docId);
      onClose();
      
      // Reset form
      setDocumentName('');
      setSelectedTemplate('blank');
    } catch (error) {
      console.error('Failed to create document:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.key === 'Enter' && e.metaKey) {
      handleCreate();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Create New Document</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Document Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Document Name</label>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Enter document name..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
              autoFocus
            />
          </div>

          {/* Project Selection */}
          {!projectId && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Project</label>
              {projects === undefined ? (
                <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 text-sm">
                  Loading projects...
                </div>
              ) : projects && projects.length > 0 ? (
                <select
                  value={selectedProjectId || ''}
                  onChange={(e) => setSelectedProjectId(e.target.value as Id<'projects'>)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                >
                  <option value="">Select a project...</option>
                  {projects.map(project => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-600">
                  <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300 text-sm">
                    <FolderPlus className="w-4 h-4" />
                    <span>You need to create a project first before adding documents.</span>
                  </div>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Close this dialog and click "New Project" to get started.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Template Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Choose Template</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {documentTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`${
                      selectedTemplate === template.id 
                        ? 'text-blue-600' 
                        : 'text-gray-400'
                    }`}>
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{template.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Preview</label>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 max-h-48 overflow-y-auto">
              <div 
                className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300"
                dangerouslySetInnerHTML={{ 
                  __html: documentTemplates.find(t => t.id === selectedTemplate)?.content || '' 
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!documentName.trim() || !selectedProjectId || isCreating || (!projectId && projects?.length === 0)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? 'Creating...' : 'Create Document'}
          </button>
        </div>
      </div>
    </div>
  );
}
