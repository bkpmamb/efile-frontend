import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import DocumentFile from "@/models/DocumentFiles";

export async function GET() {
  try {
    await connectDB();

    // ✅ Cek apakah admin
    const session = await getServerSession(authOptions);

    if (!session || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin only" },
        { status: 401 }
      );
    }

    // ✅ Fetch semua users
    const users = await User.find()
      .select("-password") // Exclude password
      .sort({ createdAt: -1 })
      .lean();

    // ✅ Hitung jumlah dokumen per user
    const usersWithDocCount = await Promise.all(
      users.map(async (user) => {
        const docCount = await DocumentFile.countDocuments({
          uploadedBy: user._id,
        });

        return {
          _id: user._id.toString(),
          name: user.name,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          documentCount: docCount,
        };
      })
    );

    return NextResponse.json(usersWithDocCount);
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }

    console.error("❌ Error fetching users:", message);

    return NextResponse.json(
      { error: "Failed to fetch users", details: message },
      { status: 500 }
    );
  }
}
