import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { z } from "zod";

const registerSchema = z.object({
  username: z.string().min(3),
  name: z.string().min(2),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const messages = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return NextResponse.json({ error: messages }, { status: 400 });
    }

    const { username, name, password } = parsed.data;

    // cek apakah username sudah ada
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username sudah terdaftar." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      name,
      password: hashedPassword,
      role: "user", // role default
    });

    return NextResponse.json(
      { message: "Registrasi berhasil. Silakan login!" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
