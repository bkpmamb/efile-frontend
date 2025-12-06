import { X } from "lucide-react";
import Image from "next/image";

interface PreviewModalProps {
  url: string;
  type: "image" | "pdf" | null;
  filename: string;
  onClose: () => void;
}

export default function PreviewModal({
  url,
  type,
  filename,
  onClose,
}: PreviewModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg truncate flex-1">{filename}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {type === "image" && (
            <div className="flex justify-center">
              <Image
                src={url}
                width={800}
                height={600}
                alt="Preview"
                className="rounded max-w-full h-auto"
                unoptimized
              />
            </div>
          )}

          {type === "pdf" && (
            <iframe
              src={url}
              className="w-full h-[70vh] rounded border"
              title="PDF Preview"
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <a
            href={url}
            download
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Download
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
