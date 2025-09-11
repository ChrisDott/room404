"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;
  const [isCreating, setIsCreating] = useState(false);
  
  const project = useQuery(api.projects.get, projectId ? { id: projectId as any } : "skip");
  const docs = useQuery(api.documents.listByProject, projectId ? { projectId: projectId as any } : "skip");
  const createDocument = useMutation(api.documents.create);

  const handleCreateDocument = async () => {
    if (!project) return;
    
    setIsCreating(true);
    try {
      const docId = await createDocument({
        projectId: project._id,
        name: "Untitled Document",
        content: "<h1>New Document</h1><p>Start writing here...</p>",
        path: "/",
        type: "markdown",
        authorId: project.ownerId, // In a real app, this would be the current user
        tags: [],
        metadata: {
          wordCount: 4,
          lastEditor: project.ownerId,
          version: 1,
        }
      });
      
      router.push(`/project/${projectId}/document/${docId}`);
    } catch (error) {
      console.error('Failed to create document:', error);
    } finally {
      setIsCreating(false);
    }
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            {project.description && (
              <p className="text-gray-600 mt-1">{project.description}</p>
            )}
          </div>
          <button 
            onClick={handleCreateDocument}
            disabled={isCreating}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? "Creating..." : "New Document"}
          </button>
        </div>

        <div className="bg-white border rounded-lg">
          <div className="px-4 py-2 border-b text-sm font-medium text-gray-700">Documents</div>
          {docs === undefined ? (
            <div className="p-4 text-gray-500">Loading documents...</div>
          ) : docs && docs.length > 0 ? (
            <ul className="divide-y">
              {docs.map((d) => (
                <li key={d._id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{d.name}</div>
                      <div className="text-xs text-gray-500">{d.path}</div>
                    </div>
                    <Link href={`/project/${projectId}/document/${d._id}`} className="text-sm text-blue-600 hover:underline">Open</Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-gray-500">No documents yet.</div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}


