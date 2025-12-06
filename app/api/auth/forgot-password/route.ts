// app/api/auth/forgot-password/route.ts

import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

// Schema validasi input
const forgotPasswordSchema = z
  .object({
    username: z.string().min(3, "Username minimal 3 karakter"),
    newPassword: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak sama",
    path: ["confirmPassword"],
  });

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: messages }, { status: 400 });
    }

    const { username, newPassword } = parsed.data;

    // Cari user berdasarkan username
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: "Username tidak ditemukan." },
        { status: 404 }
      );
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password user
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      { message: "Password berhasil diubah. Silakan login!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
