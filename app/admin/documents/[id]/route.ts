// app/api/admin/documents/[id]/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import DocumentFile from "@/models/DocumentFiles";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

const BUCKET = process.env.NOS_BUCKET ?? "user-documents";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin only" },
        { status: 401 }
      );
    }

    // ✅ Wajib unwrap params (promises)
    const { id } = await params;

    // ✅ Gunakan id yang sudah di-unwrapped
    const document = await DocumentFile.findById(id);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    let s3DeleteSuccess = false;

    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: BUCKET,
          Key: document.filename,
        })
      );

      s3DeleteSuccess = true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("S3 delete error:", error.message);
      } else {
        console.error("Unknown S3 error:", error);
      }
    }

    await DocumentFile.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
      s3Deleted: s3DeleteSuccess,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to delete document",
        details: message,
      },
      { status: 500 }
    );
  }
}
