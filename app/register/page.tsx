// app/register/page.tsx

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";

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

// Infer type dari schema untuk kemudahan penggunaan
type RegisterFormData = z.infer<typeof registerSchema>;

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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white shadow-xl rounded-lg border border-gray-200">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Daftar Akun Baru 📝
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Silakan isi detail Anda untuk mendaftar.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Input Nama Lengkap */}
          <div>
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
              className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />
          </div>

          {/* Input Username */}
          <div>
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
              className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />
          </div>

          {/* Input Password */}
          <div>
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
              className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />
          </div>

          {/* Input Konfirmasi Password BARU */}
          <div>
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
              className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />
          </div>

          {/* Tombol Register */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition duration-150 ease-in-out ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
        <div className="text-sm text-center">
          Sudah punya akun?{" "}
          <button
            onClick={() => router.push("/login")}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Login di sini
          </button>
        </div>
      </div>
    </div>
  );
}
