"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AppLayout } from "@/components/layout/AppLayout";
import { DocumentList } from "@/components/documents/DocumentList";
import { CreateDocumentModal } from "@/components/documents/CreateDocumentModal";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const project = useQuery(api.projects.get, projectId ? { id: projectId as any } : "skip");
  
  // For now, we'll use the project owner as current user
  // In a real app, you'd get this from authentication
  const currentUserId = project?.ownerId as Id<'users'>;

  const handleDocumentCreated = (documentId: Id<'documents'>) => {
    router.push(`/project/${projectId}/document/${documentId}`);
  };

  if (project === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <AppLayout>
        <div className="text-gray-600">Project not found.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Project Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            {project.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
            )}
          </div>
        </div>

        {/* Document List */}
        <DocumentList 
          projectId={projectId as Id<'projects'>}
          onCreateDocument={() => setIsCreateModalOpen(true)}
        />

        {/* Create Document Modal */}
        {currentUserId && (
          <CreateDocumentModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            projectId={projectId as Id<'projects'>}
            onDocumentCreated={handleDocumentCreated}
            currentUserId={currentUserId}
          />
        )}
      </div>
    </AppLayout>
  );
}


