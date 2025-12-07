import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import DocumentFile from "@/models/DocumentFiles";
import User from "@/models/User";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // ✅ Cek apakah user exists
    const user = await User.findById(id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Fetch dokumen milik user ini
    const documents = await DocumentFile.find({ uploadedBy: id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      user: {
        _id: user._id.toString(),
        name: user.name,
        username: user.username,
        role: user.role,
      },
      documents,
    });
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }

    console.error("❌ Error fetching user documents:", message);

    return NextResponse.json(
      { error: "Failed to fetch documents", details: message },
      { status: 500 }
    );
  }
}
