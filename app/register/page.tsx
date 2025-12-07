// app/register/page.tsx

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { cn } from "@/lib/utils";

// Schema Zod
// Menambahkan .refine() untuk memastikan password dan confirmPassword sama
const registerSchema = z
  .object({
    name: z.string().min(1, "Nama wajib diisi"),
    username: z.string().min(3, "Username minimal 3 karakter"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Konfirmasi Password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan Konfirmasi Password tidak sama",
    path: ["confirmPassword"], // Menghubungkan error ke bidang confirmPassword
  });

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State baru
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Data yang akan divalidasi dan dikirim
    const formData = { name, username, password, confirmPassword };

    // Validasi dengan Zod
    const parsed = registerSchema.safeParse(formData);
    if (!parsed.success) {
      // Mengambil pesan error dari Zod dan menggabungkannya
      const messages = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");
      setError(messages);
      setLoading(false);
      return;
    }

    try {
      // Kirim hanya name, username, dan password ke API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Pastikan hanya data yang dibutuhkan server yang dikirim
        body: JSON.stringify({
          name: parsed.data.name,
          username: parsed.data.username,
          password: parsed.data.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Jika gagal registrasi, tampilkan toast error
        toast.error(data.error || "Gagal registrasi.");
        setError(data.error || "Gagal registrasi.");
        setLoading(false);
        return;
      }

      // Jika berhasil registrasi
      toast.success(data.message || "Registrasi berhasil!");

      // Clear form
      setName("");
      setUsername("");
      setPassword("");
      setConfirmPassword(""); // Clear state baru

      // Redirect ke login page setelah 1.5 detik
      setTimeout(() => {
        router.push("/login");
      }, 1500);
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
      {/* Grid Background - Same as login page */}
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
              Bergabung dengan Kami
            </h1>
            <p className="text-xl text-gray-600 font-medium">Upload E-File</p>
            <p className="text-gray-500 mt-4">
              Daftarkan akun Anda untuk mulai menggunakan sistem upload E-File
            </p>
            <div className="pt-8">
              <div className="h-1 w-20 bg-gray-300 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Right Section - Register Form */}
        <div className="p-8">
          <div className="text-center md:text-left">
            <div className="flex justify-center md:justify-start mb-4 md:hidden">
              <div className="w-12 h-12 bg-black rounded-full" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Daftar Akun Baru
            </h1>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 mt-6">
            {/* Input Nama Lengkap */}
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                placeholder="Masukkan Nama Lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-50 focus:ring-gray-500 focus:border-gray-500 transition duration-150 ease-in-out"
              />
            </div>

            {/* Input Username */}
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
                placeholder="Buat Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-50 focus:ring-gray-500 focus:border-gray-500 transition duration-150 ease-in-out"
              />
            </div>

            {/* Input Password */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Buat Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-50 focus:ring-gray-500 focus:border-gray-500 transition duration-150 ease-in-out"
              />
            </div>

            {/* Input Konfirmasi Password BARU */}
            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Konfirmasi Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Ulangi Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-50 focus:ring-gray-500 focus:border-gray-500 transition duration-150 ease-in-out"
              />
            </div>

            {/* Tombol Register */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition duration-150 ease-in-out mt-6 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 1116 0A8 8 0 014 12z"
                    ></path>
                  </svg>
                  Mendaftarkan...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          {/* Link ke Login */}
          <div className="mt-6 text-center space-y-3 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{" "}
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
