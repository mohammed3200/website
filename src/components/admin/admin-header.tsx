"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { NotificationBell } from "@/features/admin/components/notification-bell";

export function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationBell />

          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              {session?.user?.name}
            </span>
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
              {session?.user?.role}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut()}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
