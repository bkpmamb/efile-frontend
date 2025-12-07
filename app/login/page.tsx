"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Username atau password salah");
      return;
    }

    toast.success("Login berhasil! Mengarahkan ke dashboard");

    // beri waktu next-auth update session
    setTimeout(() => {
      router.refresh();
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-white">
      {/* Grid Background */}
      <div className="absolute inset-0">
        <div
          className={cn(
            "absolute inset-0",
            "bg-size-[40px_40px]",
            "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]"
          )}
        />
        {/* White gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-white via-white/80 to-gray-50/50" />
      </div>

      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-0 shadow-2xl rounded-2xl overflow-hidden bg-white z-10">
        {/* Left Section - Welcome Message */}
        <div className="hidden md:flex flex-col items-center justify-center p-8 bg-linear-to-br from-gray-50 to-gray-100">
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Selamat Datang di Website
            </h1>
            <p className="text-xl text-gray-600 font-medium">Upload E-File</p>
            <p className="text-gray-500 mt-4">
              Silahkan login untuk mengakses sistem upload file elektronik
            </p>
            <div className="pt-8">
              <div className="h-1 w-20 bg-gray-300 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <Card className="border-0 shadow-none rounded-none">
          <CardHeader className="text-center md:text-left">
            <div className="flex justify-center md:justify-start mb-4 md:hidden">
              <div className="w-12 h-12 bg-black rounded-full" />
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Login
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label className="text-gray-700">Username</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="bg-gray-50 border-gray-300"
                />
              </div>

              <div className="space-y-1 relative">
                <Label className="text-gray-700">Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="bg-gray-50 border-gray-300"
                />
                <button
                  type="button"
                  className="absolute right-3 top-7 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gray-800 hover:bg-gray-900"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              <div className="mt-6 text-center space-y-3 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Belum punya akun?{" "}
                  <Link
                    href="/register"
                    className="text-gray-800 font-medium hover:underline hover:text-gray-900"
                  >
                    Daftar Akun
                  </Link>
                </p>

                <p className="text-sm text-gray-600">
                  Lupa password?{" "}
                  <Link
                    href="/forgot-password"
                    className="text-gray-800 font-medium hover:underline hover:text-gray-900"
                  >
                    Reset di sini
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
