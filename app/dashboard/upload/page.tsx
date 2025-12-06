// app/dashboard/upload/page.tsx

import FileUploader from "@/components/dashboard/FileUploader";

export default function UploadPage() {
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
