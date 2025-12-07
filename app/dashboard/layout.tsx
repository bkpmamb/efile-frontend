// app/dashboard/layout.tsx

"use client";

import { cn } from "@/lib/utils";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className={cn(
            "absolute inset-0",
            "bg-size-[40px_40px]",
            "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]"
          )}
        />
        <div className="absolute inset-0 bg-linear-to-br from-white via-white/90 to-gray-50/30" />
      </div>

      {/* Sidebar */}
      <div className="relative z-50">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      </div>

      {/* Spacer for desktop sidebar */}
      <div className="hidden lg:block w-64 shrink-0" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col flex-1 overflow-hidden w-full">
        <Topbar onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
