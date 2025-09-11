'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import Link from 'next/link';
import { 
  Search, 
  Grid3X3, 
  List, 
  Plus, 
  FileText, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Calendar,
  User,
  Hash
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface DocumentListProps {
  projectId: Id<'projects'>;
  onCreateDocument?: () => void;
  showCreateButton?: boolean;
}

type ViewMode = 'list' | 'grid';

export function DocumentList({ 
  projectId, 
  onCreateDocument, 
  showCreateButton = true 
}: DocumentListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<Id<'documents'> | null>(null);
  const [editingName, setEditingName] = useState('');

  const documents = useQuery(api.documents.listByProject, { projectId });
  const searchResults = useQuery(
    api.documents.search, 
    searchTerm.trim() ? { projectId, searchTerm: searchTerm.trim() } : 'skip'
  );
  const renameDocument = useMutation(api.documents.rename);
  const deleteDocument = useMutation(api.documents.remove);

  const displayDocuments = searchTerm.trim() ? searchResults : documents;

  const handleStartRename = (doc: any) => {
    setEditingId(doc._id);
    setEditingName(doc.name);
  };

  const handleSaveRename = async () => {
    if (!editingId || !editingName.trim()) return;
    
    try {
      await renameDocument({ id: editingId, name: editingName.trim() });
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      console.error('Failed to rename document:', error);
    }
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = async (docId: Id<'documents'>) => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDocument({ id: docId });
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const DocumentCard = ({ doc }: { doc: any }) => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          {editingId === doc._id ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveRename();
                  if (e.key === 'Escape') handleCancelRename();
                }}
                className="text-sm font-medium bg-transparent border-b border-blue-600 focus:outline-none"
                autoFocus
                onBlur={handleSaveRename}
              />
            </div>
          ) : (
            <Link 
              href={`/project/${projectId}/document/${doc._id}`}
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              {doc.name}
            </Link>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <MoreHorizontal className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleStartRename(doc)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDelete(doc._id)}
              className="text-red-600 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(doc.updatedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Hash className="w-3 h-3" />
            {doc.metadata.wordCount} words
          </span>
        </div>
        <div className="text-gray-400 truncate">
          {doc.path}
        </div>
      </div>
    </div>
  );

  const DocumentRow = ({ doc }: { doc: any }) => (
    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
      <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        {editingId === doc._id ? (
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveRename();
              if (e.key === 'Escape') handleCancelRename();
            }}
            className="text-sm font-medium bg-transparent border-b border-blue-600 focus:outline-none w-full"
            autoFocus
            onBlur={handleSaveRename}
          />
        ) : (
          <Link 
            href={`/project/${projectId}/document/${doc._id}`}
            className="text-sm font-medium hover:text-blue-600 transition-colors block truncate"
          >
            {doc.name}
          </Link>
        )}
        <div className="text-xs text-gray-500 truncate">{doc.path}</div>
      </div>

      <div className="text-xs text-gray-500 text-right flex-shrink-0">
        <div>{formatDate(doc.updatedAt)}</div>
        <div>{doc.metadata.wordCount} words</div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex-shrink-0">
          <MoreHorizontal className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleStartRename(doc)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleDelete(doc._id)}
            className="text-red-600 dark:text-red-400"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  if (documents === undefined) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-pulse text-gray-500">Loading documents...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with search and controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-l-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>

          {showCreateButton && onCreateDocument && (
            <button
              onClick={onCreateDocument}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Document
            </button>
          )}
        </div>
      </div>

      {/* Document display */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {displayDocuments && displayDocuments.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {displayDocuments.map((doc) => (
                <DocumentCard key={doc._id} doc={doc} />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {displayDocuments.map((doc) => (
                <DocumentRow key={doc._id} doc={doc} />
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm.trim() ? 'No documents found' : 'No documents yet'}
            </h3>
            <p className="text-sm text-center max-w-md">
              {searchTerm.trim() 
                ? `No documents match "${searchTerm.trim()}". Try a different search term.`
                : 'Create your first document to get started with your project.'
              }
            </p>
            {showCreateButton && onCreateDocument && !searchTerm.trim() && (
              <button
                onClick={onCreateDocument}
                className="mt-4 flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Document
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      {displayDocuments && displayDocuments.length > 0 && (
        <div className="text-xs text-gray-500 text-center">
          {searchTerm.trim() 
            ? `Found ${displayDocuments.length} document${displayDocuments.length === 1 ? '' : 's'} matching "${searchTerm.trim()}"`
            : `${displayDocuments.length} document${displayDocuments.length === 1 ? '' : 's'} total`
          }
        </div>
      )}
    </div>
  );
}
