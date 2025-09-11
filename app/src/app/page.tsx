"use client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { GitHubSignIn } from "@/components/auth/github-sign-in";
import { useRouter } from "next/navigation";

export default function Home() {
  const user = useQuery(api.users.current);
  const router = useRouter();

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

  // Redirect signed-in users to dashboard
  if (user) {
    router.replace("/dashboard");
    return null;
  }

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