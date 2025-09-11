"use client";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";

export default function DashboardPage() {
  const user = useQuery(api.users.current);
  const projects = useQuery(
    api.projects.listByOwner,
    user ? { ownerId: user._id } : "skip"
  );
  const recentDocs: any[] | undefined = undefined;

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

  return (
    <AppLayout>
      <div className="space-y-8">
        <section>
          <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
          <p className="text-gray-600">Here are your projects and recent activity.</p>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Your Projects</h2>
            <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">New Project</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects === undefined ? (
              <div className="col-span-full text-gray-500">Loading projects...</div>
            ) : projects && projects.length > 0 ? (
              projects.map((p: any) => (
                <Link key={p._id} href={`/project/${p._id}`} className="block bg-white border rounded-lg p-4 hover:shadow-sm">
                  <div className="font-medium">{p.name}</div>
                  {p.description && <div className="text-sm text-gray-600 mt-1 line-clamp-2">{p.description}</div>}
                </Link>
              ))
            ) : (
              <div className="col-span-full text-gray-500">No projects yet.</div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Recent Documents</h2>
          <div className="bg-white border rounded-lg p-4 text-sm text-gray-500">Coming soon</div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Development Tools</h2>
          <div className="bg-white border rounded-lg p-4">
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
      </div>
    </AppLayout>
  );
}


