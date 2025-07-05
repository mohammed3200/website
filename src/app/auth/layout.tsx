// src/app/admin/layout.tsx
"use client";

import { withAdminGuard } from "@/components/auth/withAdminGuard";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Admin sidebar/navigation */}
      <nav className="w-64 bg-gray-800 text-white p-4">
        {/* Navigation items */}
      </nav>
      
      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default withAdminGuard(AdminLayout);