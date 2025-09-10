"use client";
import { useAuthActions } from "@convex-dev/auth/react";

export function SignOutButton() {
  const { signOut } = useAuthActions();

  return (
    <button
      onClick={() => signOut()}
      className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
    >
      Sign Out
    </button>
  );
}
