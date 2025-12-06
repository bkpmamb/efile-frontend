// app/api/admin/documents/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import DocumentFile from "@/models/DocumentFiles";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // Ambil session user yang login
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Cek apakah user adalah admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch semua dokumen dengan populate user info
    const documents = await DocumentFile.find()
      .populate("uploadedBy", "username name") // Ambil info user
      .sort({ createdAt: -1 })
      .lean();

    // Format data untuk frontend
    const formattedDocs = documents.map((doc: any) => ({
      _id: doc._id.toString(),
      filename: doc.filename,
      originalFilename: doc.originalFilename,
      url: doc.url,
      uploadedBy: doc.uploadedBy?.username || doc.uploadedBy?.name || "Unknown",
      category: doc.category,
      size: doc.size,
      createdAt: doc.createdAt,
    }));

    return NextResponse.json(formattedDocs);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
