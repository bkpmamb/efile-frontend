import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import DocumentFile from "@/models/DocumentFiles";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

const BUCKET = process.env.NOS_BUCKET ?? "user-documents";

// ✅ UPDATE - Rename file
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { originalFilename } = await req.json();

    if (!originalFilename || originalFilename.trim() === "") {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    // Cari dokumen dan pastikan milik user yang login
    const document = await DocumentFile.findOne({
      _id: id,
      uploadedBy: session.user.id,
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update originalFilename
    document.originalFilename = originalFilename.trim();
    await document.save();

    return NextResponse.json({
      success: true,
      message: "File renamed successfully",
      document,
    });
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }

    console.error("❌ Error renaming document:", message);

    return NextResponse.json(
      { error: "Failed to rename document", details: message },
      { status: 500 }
    );
  }
}

// ✅ DELETE - Hapus file
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Cari dokumen dan pastikan milik user yang login
    const document = await DocumentFile.findOne({
      _id: id,
      uploadedBy: session.user.id,
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found or unauthorized" },
        { status: 404 }
      );
    }

    // Hapus file dari S3
    let s3DeleteSuccess = false;

    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: BUCKET,
          Key: document.filename,
        })
      );

      console.log(`✅ File deleted from S3: ${document.filename}`);
      s3DeleteSuccess = true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("❌ Error deleting from S3:", error.message);
      } else {
        console.error("❌ Unknown S3 error:", error);
      }
      // Tetap lanjut hapus DB
    }

    // Hapus dari database
    await DocumentFile.findByIdAndDelete(id);

    console.log(`✅ Document deleted from DB: ${id}`);

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
      s3Deleted: s3DeleteSuccess,
    });
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }

    console.error("❌ Error deleting document:", message);

    return NextResponse.json(
      { error: "Failed to delete document", details: message },
      { status: 500 }
    );
  }
}
