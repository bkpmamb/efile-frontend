// app/forgot-password/page.tsx
"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { cn } from "@/lib/utils";

// Schema Zod untuk validasi
const forgotPasswordSchema = z
  .object({
    username: z.string().min(1, "Username wajib diisi"),
    newPassword: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Konfirmasi Password wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password dan Konfirmasi Password tidak sama",
    path: ["confirmPassword"],
  });

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = { username, newPassword, confirmPassword };

    const parsed = forgotPasswordSchema.safeParse(formData);
    if (!parsed.success) {
      const messages = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");
      setError(messages);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Gagal reset password.");
        setError(data.error || "Gagal reset password.");
        setLoading(false);
        return;
      }

      toast.success(data.message || "Password berhasil diubah!");

      setUsername("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan server.");
      setError("Terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-white">
      {/* Grid Background - Same as other pages */}
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
            <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>
            <p className="text-xl text-gray-600 font-medium">
              Keamanan Akun Anda
            </p>
            <p className="text-gray-500 mt-4">
              Reset password Anda untuk mengamankan akun dan melanjutkan akses
              ke sistem
            </p>
            <div className="pt-8">
              <div className="h-1 w-20 bg-gray-300 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Right Section - Forgot Password Form */}
        <div className="p-8">
          <div className="text-center md:text-left">
            <div className="flex justify-center md:justify-start mb-4 md:hidden">
              <div className="w-12 h-12 bg-black rounded-full" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Reset Password 🔒
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Masukkan username dan password baru Anda.
            </p>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-4 mt-6">
            {/* Username */}
            <div className="space-y-1">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Masukkan Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-50 focus:ring-gray-500 focus:border-gray-500 transition duration-150 ease-in-out"
              />
            </div>

            {/* New Password */}
            <div className="space-y-1 relative">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Password Baru
              </label>
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan Password Baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-50 focus:ring-gray-500 focus:border-gray-500 transition duration-150 ease-in-out"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1 relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Konfirmasi Password Baru
              </label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Ulangi Password Baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-50 focus:ring-gray-500 focus:border-gray-500 transition duration-150 ease-in-out"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition duration-150 ease-in-out mt-6 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              }`}
            >
              {loading ? "Memproses..." : "Reset Password"}
            </button>
          </form>

          {/* Link back to Login */}
          <div className="mt-6 text-center space-y-3 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Ingat password Anda?{" "}
              <button
                onClick={() => router.push("/login")}
                className="font-medium text-gray-800 hover:text-gray-900 hover:underline"
              >
                Login di sini
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
