"use client";
import { GitHubSignIn } from "@/components/auth/github-sign-in";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Room404
          </h1>
          <p className="text-gray-600">
            Sign in to start collaborating on documentation
          </p>
        </div>
        
        <div className="space-y-4">
          <GitHubSignIn />
        </div>
        
        <p className="text-center text-sm text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
