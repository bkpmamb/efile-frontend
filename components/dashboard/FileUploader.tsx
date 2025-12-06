// components/dashboard/FileUoloader.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const fileSchema = z.object({
  name: z.string(),
  size: z.number().max(5 * 1024 * 1024, "Max 5MB per file"),
  type: z
    .string()
    .refine(
      (type) =>
        [
          "image/jpeg",
          "image/png",
          "image/heic",
          "image/heif",
          "application/pdf",
        ].includes(type),
      { message: "Format harus JPG, PNG, HEIC, HEIF, atau PDF" }
    ),
});

export default function FileUploader() {
  const { data: session } = useSession();
  console.log(session?.user.role);

  const userId = session?.user?.id;

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    for (const f of selectedFiles) {
      const parse = fileSchema.safeParse(f);
      if (!parse.success) {
        setMessage(parse.error.issues[0].message);
        return;
      }
    }

    setMessage("");

    setFiles((prev) => [...prev, ...selectedFiles]);

    const newPreviews = selectedFiles.map((file) =>
      file.type.includes("image") ? URL.createObjectURL(file) : ""
    );

    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleUpload = async () => {
    if (!userId) {
      setMessage("Login terlebih dahulu.");
      return;
    }

    if (files.length === 0) {
      setMessage("Pilih minimal satu file.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const form = new FormData();

      // FILES
      files.forEach((file) => form.append("files", file));

      // EXTRA FORM FIELDS
      form.append("userId", userId);
      form.append("category", "profile-document");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Upload gagal");

      toast.success("Berhasi Upload");
      setMessage("");
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      setMessage("Terjadi kesalahan saat upload.");
      console.log(error);
    }

    setUploading(false);
  };

  console.log("Session client:", session);

  return (
    <Card className="max-w-xl mx-auto p-4 border">
      <CardContent className="space-y-4">
        <label
          htmlFor="upload"
          className="border-2 border-dashed p-10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
        >
          <Upload className="w-10 h-10 mb-3 text-gray-500" />
          <p className="text-gray-600">Klik atau drag & drop file</p>

          <input
            id="upload"
            type="file"
            className="hidden"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            multiple
          />
        </label>

        {files.length > 0 && (
          <div className="space-y-3">
            {files.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-gray-100 p-3 rounded"
              >
                {file.type.includes("image") ? (
                  <Image
                    src={previews[i]}
                    className="w-12 h-12 rounded object-cover"
                    alt="preview"
                    width={48}
                    height={48}
                    unoptimized
                  />
                ) : (
                  <FileText className="w-10 h-10 text-red-600" />
                )}

                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-600">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {message && (
          <p className="text-sm text-center text-red-600">{message}</p>
        )}

        <Button onClick={handleUpload} disabled={uploading} className="w-full">
          {uploading ? "Uploading..." : "Upload File"}
        </Button>
      </CardContent>
    </Card>
  );
}
