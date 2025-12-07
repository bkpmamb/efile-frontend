import { cn } from "@/lib/utils";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen">
      {/* Grid Background - Same as other pages */}
      <div className="absolute inset-0">
        <div
          className={cn(
            "absolute inset-0",
            "bg-size-[40px_40px]",
            "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]"
          )}
        />
        {/* White gradient overlay - lighter version for dashboard */}
        <div className="absolute inset-0 bg-linear-to-br from-white via-white/90 to-gray-50/30" />
      </div>

      {/* Sidebar */}
      <div className="relative z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
