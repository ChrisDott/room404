"use client";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { AppLayout } from "@/components/layout/AppLayout";
import DocumentEditor from "@/components/editor/DocumentEditor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DocumentPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const documentId = params?.documentId as string;
  
  const document = useQuery(api.documents.get, documentId ? { id: documentId as any } : "skip");
  const project = useQuery(api.projects.get, projectId ? { id: projectId as any } : "skip");
  const updateDocument = useMutation(api.documents.update);

  const handleSave = async (content: string) => {
    if (!document) return;
    
    try {
      // Calculate word count more accurately
      const textContent = content.replace(/<[^>]*>/g, '').trim();
      const wordCount = textContent ? textContent.split(/\s+/).length : 0;

      await updateDocument({
        id: document._id,
        content,
        metadata: {
          wordCount,
          lastEditor: document.authorId, // In a real app, this would be the current user
          version: document.metadata.version + 1,
        }
      });
    } catch (error) {
      console.error('Failed to save document:', error);
      throw error;
    }
  };

  if (document === undefined || project === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!document || !project) {
    return (
      <AppLayout>
        <div className="text-gray-600">Document or project not found.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link 
            href={`/project/${projectId}`}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{document.name}</h1>
            <div className="text-sm text-gray-500">
              in {project.name} • {document.path}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
          <DocumentEditor
            initialContent={document.content}
            onSave={handleSave}
            placeholder={`Start writing in ${document.name}...`}
            autoSave={true}
            className="min-h-[600px]"
          />
        </div>

        {/* Document Info */}
        <div className="text-xs text-gray-500 flex gap-4">
          <span>Words: {document.metadata.wordCount}</span>
          <span>Version: {document.metadata.version}</span>
          <span>Updated: {new Date(document.updatedAt).toLocaleString()}</span>
        </div>
      </div>
    </AppLayout>
  );
}
