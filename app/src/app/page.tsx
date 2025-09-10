"use client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { GitHubSignIn } from "@/components/auth/github-sign-in";
import { UserMenu } from "@/components/auth/user-menu";

export default function Home() {
  const user = useQuery(api.users.current);

  // Debug logging
  console.log("User state:", user);

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Room404</h1>
          <p className="text-gray-600 mb-8">Welcome! Please sign in to continue.</p>
          <div className="bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto">
            <GitHubSignIn />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600">Room404</h1>
            <UserMenu />
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-600 mb-8">You&apos;re successfully authenticated with GitHub.</p>
          
          <div className="bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">System Status</h3>
            <div className="text-left space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>✅ Next.js setup</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>✅ Convex backend connected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>✅ GitHub authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>🔄 Ready for TipTap editor</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}