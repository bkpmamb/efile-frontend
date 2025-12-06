// /app/api/upload/route.ts

import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { connectDB } from "@/lib/db";
import DocumentFile from "@/models/DocumentFiles";
import { v4 as uuid } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const BUCKET = "user-documents";

export async function POST(req: Request) {
  try {
    await connectDB();

    // 📌 Ambil session server-side
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const form = await req.formData();
    const files = form.getAll("files") as File[];
    const category = (form.get("category") as string) || "general";

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const results = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const ext = file.name.split(".").pop();
      const filename = `${uuid()}.${ext}`;

      // Upload ke S3 Biznet
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: filename,
          Body: buffer,
          ContentType: file.type,
          ACL: "public-read",
        })
      );

      const fileUrl = `https://nos.wjv-1.neo.id/${BUCKET}/${filename}`;

      // Simpan ke MongoDB
      const saved = await DocumentFile.create({
        filename,
        originalFilename: file.name,
        url: fileUrl,
        uploadedBy: userId, // ← sekarang aman
        category,
        size: file.size,
      });

      results.push(saved);
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
