"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Topbar() {
  const { data: session } = useSession();

  // Ambil data dari NextAuth session
  const displayName = session?.user?.name || session?.user?.username || "User";
  const userRole = session?.user?.role || "user";

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  };

  return (
    <header className="w-full h-16 border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center md:hidden">
              <Menu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-xs text-gray-500 hidden md:block">
                Welcome back! Here&apos;s your overview
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 pl-2 pr-3 h-auto py-2 rounded-xl hover:bg-gray-50"
              >
                <div className="w-9 h-9 bg-linear-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  {displayName ? (
                    <span className="font-bold text-blue-700 text-sm">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-900 leading-tight">
                    {displayName}
                  </p>
                  <Badge
                    variant="outline"
                    className="ml-1 hidden md:inline-flex capitalize border-blue-200 text-blue-700 bg-blue-50"
                  >
                    {userRole}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {displayName}
                  </p>
                  <p className="text-xs leading-none text-gray-500 capitalize">
                    {userRole}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
