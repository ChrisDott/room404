"use client";
import Link from "next/link";
import { UserMenu } from "@/components/auth/user-menu";

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">Room404</span>
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}


