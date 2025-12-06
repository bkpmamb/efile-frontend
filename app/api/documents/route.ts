// app/api/documents/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import DocumentFile from "@/models/DocumentFiles";

export async function GET() {
  try {
    await connectDB();

    // Ambil session user yang login
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch hanya dokumen milik user ini
    const documents = await DocumentFile.find({ uploadedBy: userId })
      .sort({ createdAt: -1 }) // Urutkan dari terbaru
      .lean();

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
