'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { X, FolderPlus, Lock, Users, Globe } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: (projectId: Id<'projects'>) => void;
  currentUserId: Id<'users'>;
}

type Visibility = 'private' | 'team' | 'public';
type DefaultPermissions = 'read' | 'write';

export function CreateProjectModal({ 
  isOpen, 
  onClose, 
  onProjectCreated,
  currentUserId 
}: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('private');
  const [allowComments, setAllowComments] = useState(true);
  const [defaultPermissions, setDefaultPermissions] = useState<DefaultPermissions>('write');
  const [isCreating, setIsCreating] = useState(false);

  const createProject = useMutation(api.projects.create);

  const handleCreate = async () => {
    if (!projectName.trim()) return;

    setIsCreating(true);
    try {
      const projectId = await createProject({
        name: projectName.trim(),
        description: description.trim() || undefined,
        ownerId: currentUserId,
        settings: {
          visibility,
          allowComments,
          defaultPermissions,
        }
      });

      onProjectCreated?.(projectId);
      onClose();
      
      // Reset form
      setProjectName('');
      setDescription('');
      setVisibility('private');
      setAllowComments(true);
      setDefaultPermissions('write');
    } catch (error) {
      console.error('Failed to create project:', error);
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

  const visibilityOptions = [
    {
      value: 'private' as const,
      label: 'Private',
      description: 'Only you can access this project',
      icon: <Lock className="w-4 h-4" />
    },
    {
      value: 'team' as const,
      label: 'Team',
      description: 'Team members can access this project',
      icon: <Users className="w-4 h-4" />
    },
    {
      value: 'public' as const,
      label: 'Public',
      description: 'Anyone can view this project',
      icon: <Globe className="w-4 h-4" />
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FolderPlus className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">Create New Project</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Project Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional project description..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 resize-none"
            />
          </div>

          {/* Visibility */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">Visibility</label>
            <div className="space-y-2">
              {visibilityOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => setVisibility(option.value)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    visibility === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${
                      visibility === option.value 
                        ? 'text-blue-600' 
                        : 'text-gray-400'
                    }`}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          visibility === option.value
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {visibility === option.value && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                          )}
                        </div>
                        <h3 className="font-medium text-sm">{option.label}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-6">{option.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Project Settings</h3>
            
            {/* Allow Comments */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Allow Comments</label>
                <p className="text-xs text-gray-500">Let team members add comments to documents</p>
              </div>
              <button
                onClick={() => setAllowComments(!allowComments)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  allowComments ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    allowComments ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Default Permissions */}
            <div>
              <label className="block text-sm font-medium mb-2">Default Permissions</label>
              <select
                value={defaultPermissions}
                onChange={(e) => setDefaultPermissions(e.target.value as DefaultPermissions)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-sm"
              >
                <option value="read">Read Only</option>
                <option value="write">Read & Write</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Default permission level for new team members
              </p>
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
            disabled={!projectName.trim() || isCreating}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
}
