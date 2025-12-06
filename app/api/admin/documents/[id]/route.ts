// app/api/admin/documents/[id]/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import DocumentFile from "@/models/DocumentFiles";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

const BUCKET = process.env.NOS_BUCKET || "user-documents";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const document = await DocumentFile.findById(params.id);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Hapus file dari S3
    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: BUCKET,
          Key: document.filename,
        })
      );
    } catch (s3Error) {
      console.error("Error deleting from S3:", s3Error);
      // Lanjutkan hapus dari database meskipun S3 gagal
    }

    // Hapus dari database
    await DocumentFile.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true, message: "Document deleted" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
