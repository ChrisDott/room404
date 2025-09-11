"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { CreateDocumentModal } from "@/components/documents/CreateDocumentModal";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { FileText, FolderOpen, Clock, Plus, FolderPlus } from "lucide-react";
import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const router = useRouter();
  
  const user = useQuery(api.users.current);
  const projects = useQuery(
    api.projects.listByOwner,
    user ? { ownerId: user._id } : "skip"
  );
  const recentDocuments = useQuery(api.documents.listRecent, { limit: 10 });

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Please sign in</h1>
          <p className="text-gray-600">You must be authenticated to view the dashboard.</p>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDocumentCreated = (documentId: Id<'documents'>) => {
    // Find the project for this document to navigate correctly
    if (recentDocuments) {
      const doc = recentDocuments.find(d => d._id === documentId);
      if (doc) {
        router.push(`/project/${doc.projectId}/document/${documentId}`);
      }
    }
  };

  const handleProjectCreated = (projectId: Id<'projects'>) => {
    router.push(`/project/${projectId}`);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Here's what's happening with your documents and projects.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateProjectModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <FolderPlus className="w-4 h-4" />
              New Project
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Document
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{recentDocuments?.length || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Documents</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <FolderOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{projects?.length || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {recentDocuments?.reduce((sum, doc) => sum + doc.metadata.wordCount, 0) || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Words</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Documents */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Documents
              </h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {recentDocuments === undefined ? (
                <div className="p-6 text-center text-gray-500">Loading...</div>
              ) : recentDocuments && recentDocuments.length > 0 ? (
                recentDocuments.slice(0, 8).map((doc) => (
                  <div key={doc._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <Link 
                            href={`/project/${doc.projectId}/document/${doc._id}`}
                            className="font-medium text-sm hover:text-blue-600 transition-colors truncate block"
                          >
                            {doc.name}
                          </Link>
                          <div className="text-xs text-gray-500 truncate">
                            {doc.path} • {doc.metadata.wordCount} words
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 flex-shrink-0 ml-4">
                        {formatDate(doc.updatedAt)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No documents yet</p>
                  <p className="text-sm">Create your first document to get started!</p>
                </div>
              )}
            </div>
          </div>

          {/* My Projects */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                My Projects
              </h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {projects === undefined ? (
                <div className="p-6 text-center text-gray-500">Loading...</div>
              ) : projects && projects.length > 0 ? (
                projects.map((project) => (
                  <div key={project._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <FolderOpen className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <Link 
                            href={`/project/${project._id}`}
                            className="font-medium text-sm hover:text-blue-600 transition-colors truncate block"
                          >
                            {project.name}
                          </Link>
                          {project.description && (
                            <div className="text-xs text-gray-500 truncate">
                              {project.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 flex-shrink-0 ml-4">
                        {formatDate(project.updatedAt)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No projects yet</p>
                  <p className="text-sm">Create your first project to organize documents!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Development Tools */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Development Tools</h2>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <Link 
              href="/editor-test" 
              className="inline-flex items-center px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              🧪 Test TipTap Editor
            </Link>
            <p className="text-xs text-gray-500 mt-2">
              Test the collaborative markdown editor with auto-save functionality
            </p>
          </div>
        </section>

        {/* Modals */}
        {user && (
          <>
            <CreateDocumentModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onDocumentCreated={handleDocumentCreated}
              currentUserId={user._id}
            />
            <CreateProjectModal
              isOpen={isCreateProjectModalOpen}
              onClose={() => setIsCreateProjectModalOpen(false)}
              onProjectCreated={handleProjectCreated}
              currentUserId={user._id}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
}


