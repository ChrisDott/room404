"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { 
  FolderOpen, 
  FileText, 
  ChevronRight, 
  ChevronDown 
} from "lucide-react";
import { useState } from "react";

interface ProjectNodeProps {
  project: any;
  documents: any[];
}

function ProjectNode({ project, documents }: ProjectNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();
  const paddingLeft = 8;
  
  const projectDocuments = documents.filter(doc => doc.projectId === project._id);
  const isProjectActive = pathname === `/project/${project._id}`;

  return (
    <div>
      <div className="flex items-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors flex-1"
          style={{ paddingLeft }}
        >
          {isExpanded ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
          <FolderOpen className="w-4 h-4" />
          <span className="truncate">{project.name}</span>
        </button>
        <Link
          href={`/project/${project._id}`}
          className={`px-1 py-1 rounded text-xs transition-colors ${
            isProjectActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
          }`}
        >
          →
        </Link>
      </div>
      {isExpanded && (
        <div>
          {projectDocuments.length > 0 ? (
            projectDocuments.map((doc) => (
              <DocumentNode key={doc._id} document={doc} />
            ))
          ) : (
            <div className="px-2 py-1.5 text-xs text-gray-500" style={{ paddingLeft: paddingLeft + 24 }}>
              No documents
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface DocumentNodeProps {
  document: any;
}

function DocumentNode({ document }: DocumentNodeProps) {
  const pathname = usePathname();
  const paddingLeft = 32;
  const isActive = pathname === `/project/${document.projectId}/document/${document._id}`;

  return (
    <Link
      href={`/project/${document.projectId}/document/${document._id}`}
      className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded transition-colors ${
        isActive
          ? "bg-blue-100 text-blue-700"
          : "text-gray-700 hover:bg-gray-100"
      }`}
      style={{ paddingLeft }}
    >
      <FileText className="w-4 h-4" />
      <span className="truncate">{document.name}</span>
    </Link>
  );
}

export function FileTreeSidebar() {
  const user = useQuery(api.users.current);
  const projects = useQuery(
    api.projects.listByOwner,
    user ? { ownerId: user._id } : "skip"
  );
  const documents = useQuery(api.documents.listRecent, { limit: 100 });

  return (
    <div className="bg-white border rounded-lg p-3 h-fit">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-gray-700 px-2">Projects</h2>
      </div>
      <nav className="space-y-1">
        {projects === undefined ? (
          <div className="px-2 py-1.5 text-sm text-gray-500">Loading...</div>
        ) : projects && projects.length > 0 ? (
          projects.map((project) => (
            <ProjectNode 
              key={project._id} 
              project={project} 
              documents={documents || []} 
            />
          ))
        ) : (
          <div className="px-2 py-1.5 text-sm text-gray-500">No projects found</div>
        )}
      </nav>
    </div>
  );
}
