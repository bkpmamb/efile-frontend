"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, FileUp, LogOut, FileText, ChevronRight } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [openLogout, setOpenLogout] = useState(false);

  const menu = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Upload Files", href: "/dashboard/upload", icon: FileUp },
    { name: "My Documents", href: "/dashboard/documents", icon: FileText },
  ];

  const handleLogout = () => {
    // Hapus cookie
    document.cookie = "username=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";

    // Opsional: jika ada context logout() (useAuth)
    if (logout) logout();

    // Feedback toast
    toast.success("Berhasil logout");

    // Tutup dialog
    setOpenLogout(false);

    // Redirect ke login
    window.location.href = "/login";
  };

  return (
    <>
      <aside className="w-64 h-screen bg-linear-to-b from-gray-900 to-gray-800 text-white border-r border-gray-700 flex flex-col fixed left-0 top-0 z-40">
        {/* Logo/Brand Section */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gralineardient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                E-File
              </h2>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 px-2">
              Navigation
            </p>
            <div className="space-y-1">
              {menu.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                      isActive
                        ? "bg-linear-to-r from-blue-600/20 to-blue-500/20 border-l-4 border-blue-500 text-white"
                        : "hover:bg-gray-800/50 text-gray-300 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          isActive
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-gray-300"
                        )}
                      >
                        <item.icon size={18} />
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-blue-400" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-700">
          <Button
            variant="ghost"
            onClick={() => setOpenLogout(true)}
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-red-600/20 hover:border-red-500/30 border border-transparent transition-all duration-200 py-5 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <LogOut className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="font-medium">Logout</p>
                <p className="text-xs text-gray-400">Sign out from system</p>
              </div>
            </div>
          </Button>
        </div>
      </aside>

      {/* Mobile Responsive - Backdrop */}
      <div className="hidden lg:block w-64"></div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={openLogout} onOpenChange={setOpenLogout}>
        <DialogContent className="max-w-md rounded-2xl border-gray-200 shadow-2xl">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <LogOut className="w-8 h-8 text-red-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Confirm Logout
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-gray-600">
              Are you sure you want to sign out from the system?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              You&apos;ll need to login again to access your documents.
            </p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button
              variant="outline"
              onClick={() => setOpenLogout(false)}
              className="w-full sm:w-auto border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full sm:w-auto bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Yes, Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
