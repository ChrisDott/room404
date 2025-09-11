"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function ProjectSidebar() {
  const user = useQuery(api.users.current);
  const projects = useQuery(
    api.projects.listByOwner,
    user ? { ownerId: user._id } : undefined
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!projects) return projects;
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p: any) => p.name.toLowerCase().includes(q));
  }, [projects, query]);

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Projects</h2>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects..."
          className="mt-2 w-full rounded border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      {projects === undefined ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : filtered && filtered.length > 0 ? (
        <ul className="space-y-1">
          {filtered.map((p: any) => (
            <li key={p._id}>
              <Link
                href={`/project/${p._id}`}
                className="block px-2 py-1.5 rounded hover:bg-gray-100 text-sm text-gray-800 truncate"
              >
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-500">No projects found.</div>
      )}
    </div>
  );
}


