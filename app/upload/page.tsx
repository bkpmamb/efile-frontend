"use client";

import FileUploader from "@/components/dashboard/FileUploader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();

  useEffect(() => {
    const role = document.cookie
      .split("; ")
      .find((c) => c.startsWith("role="))
      ?.split("=")[1];

    if (role === "admin") {
      router.replace("/admin"); // redirect admin
    }
  }, [router]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Upload File</h1>
      <p className="text-gray-600 mb-6">
        Unggah file JPG, PNG, atau PDF ke sistem e-file.
      </p>

      <FileUploader />
    </div>
  );
}
