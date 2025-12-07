"use client";

import { useState, useEffect } from "react";
import { Eye, Loader2, X, Download, Edit2, Trash2, Save } from "lucide-react";
import Image from "next/image";
import { DocumentFile } from "@/types/documents";
import { toast } from "sonner";

export default function DashboardDocuments() {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "pdf" | null>(null);
  const [previewFilename, setPreviewFilename] = useState<string>("");

  // State untuk rename
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newFilename, setNewFilename] = useState("");
  const [renaming, setRenaming] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/documents");

      if (!res.ok) {
        throw new Error("Failed to fetch documents");
      }

      const data = await res.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (doc: DocumentFile) => {
    const fileExt = doc.filename.split(".").pop()?.toLowerCase();

    if (fileExt === "pdf") {
      setPreviewType("pdf");
      setPreviewUrl(doc.url);
      setPreviewFilename(doc.originalFilename || doc.filename);
    } else if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExt || "")) {
      setPreviewType("image");
      setPreviewUrl(doc.url);
      setPreviewFilename(doc.originalFilename || doc.filename);
    } else {
      window.open(doc.url, "_blank");
    }
  };

  const closePreview = () => {
    setPreviewUrl(null);
    setPreviewType(null);
    setPreviewFilename("");
  };

  // ✅ START RENAME
  const startRename = (doc: DocumentFile) => {
    setEditingId(doc._id);
    setNewFilename(doc.originalFilename || doc.filename);
  };

  // ✅ CANCEL RENAME
  const cancelRename = () => {
    setEditingId(null);
    setNewFilename("");
  };

  // ✅ SAVE RENAME
  const saveRename = async (id: string) => {
    if (!newFilename.trim()) {
      toast("Filename tidak boleh kosong");
      return;
    }

    try {
      setRenaming(true);

      const res = await fetch(`/api/documents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalFilename: newFilename.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to rename file");
      }

      // Update local state
      setDocuments((prev) =>
        prev.map((doc) =>
          doc._id === id
            ? { ...doc, originalFilename: newFilename.trim() }
            : doc
        )
      );

      toast("File berhasil di-rename");
      setEditingId(null);
      setNewFilename("");
    } catch (error) {
      console.error("Error renaming file:", error);
      toast("Gagal rename file");
    } finally {
      setRenaming(false);
    }
  };

  // ✅ DELETE FILE
  const handleDelete = async (id: string, filename: string) => {
    const confirmDelete = confirm(
      `Hapus file "${filename}"?\nAksi ini tidak dapat dibatalkan.`
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete file");
      }

      // Remove from local state
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));

      toast("File berhasil dihapus");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast("Gagal menghapus file");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileType = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "PDF";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || ""))
      return "Image";
    return ext?.toUpperCase() || "File";
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
        Uploaded Documents
      </h2>

      {documents.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Belum ada dokumen yang diupload</p>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW - Card Layout */}
          <div className="block md:hidden space-y-3">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Filename Section */}
                <div className="mb-3">
                  {editingId === doc._id ? (
                    <input
                      type="text"
                      value={newFilename}
                      onChange={(e) => setNewFilename(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                      disabled={renaming}
                    />
                  ) : (
                    <h3 className="font-semibold text-gray-900 break-words line-clamp-2">
                      {doc.originalFilename || doc.filename}
                    </h3>
                  )}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs">Type:</span>
                    <div className="mt-1">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {getFileType(doc.filename)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Size:</span>
                    <p className="font-medium text-gray-900 mt-1">
                      {formatSize(doc.size)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 text-xs">Uploaded:</span>
                    <p className="font-medium text-gray-900 mt-1">
                      {doc.createdAt
                        ? new Date(doc.createdAt).toLocaleDateString("id-ID")
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {editingId === doc._id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveRename(doc._id)}
                      disabled={renaming}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {renaming ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          <span>Save</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={cancelRename}
                      disabled={renaming}
                      className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      <span>Cancel</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => handlePreview(doc)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex flex-col items-center justify-center gap-1"
                      title="Preview"
                    >
                      <Eye size={18} />
                      <span className="text-xs">View</span>
                    </button>

                    <button
                      onClick={() => startRename(doc)}
                      className="p-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex flex-col items-center justify-center gap-1"
                      title="Rename"
                    >
                      <Edit2 size={18} />
                      <span className="text-xs">Edit</span>
                    </button>

                    <a
                      href={doc.url}
                      download
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex flex-col items-center justify-center gap-1"
                      title="Download"
                      rel="noreferrer"
                      target="_blank"
                    >
                      <Download size={18} />
                      <span className="text-xs">Save</span>
                    </a>

                    <button
                      onClick={() =>
                        handleDelete(
                          doc._id,
                          doc.originalFilename || doc.filename
                        )
                      }
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex flex-col items-center justify-center gap-1"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                      <span className="text-xs">Delete</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW - Table Layout */}
          <div className="hidden md:block overflow-x-auto rounded-lg border">
            <table className="w-full text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3">Filename</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Uploaded</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {documents.map((doc) => (
                  <tr key={doc._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 max-w-xs">
                      {editingId === doc._id ? (
                        <input
                          type="text"
                          value={newFilename}
                          onChange={(e) => setNewFilename(e.target.value)}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                          disabled={renaming}
                        />
                      ) : (
                        <span
                          className="truncate block"
                          title={doc.originalFilename || doc.filename}
                        >
                          {doc.originalFilename || doc.filename}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {getFileType(doc.filename)}
                      </span>
                    </td>
                    <td className="p-3">{formatSize(doc.size)}</td>
                    <td className="p-3">
                      {doc.createdAt
                        ? new Date(doc.createdAt).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="p-3">
                      {editingId === doc._id ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => saveRename(doc._id)}
                            disabled={renaming}
                            className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                            title="Save"
                          >
                            {renaming ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Save size={18} />
                            )}
                          </button>
                          <button
                            onClick={cancelRename}
                            disabled={renaming}
                            className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition disabled:opacity-50"
                            title="Cancel"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handlePreview(doc)}
                            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            title="Preview"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            onClick={() => startRename(doc)}
                            className="p-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
                            title="Rename"
                          >
                            <Edit2 size={18} />
                          </button>

                          <a
                            href={doc.url}
                            download
                            className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition inline-block"
                            title="Download"
                            rel="noreferrer"
                            target="_blank"
                          >
                            <Download size={18} />
                          </a>

                          <button
                            onClick={() =>
                              handleDelete(
                                doc._id,
                                doc.originalFilename || doc.filename
                              )
                            }
                            className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* PREVIEW MODAL */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4"
          onClick={closePreview}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-base md:text-lg truncate flex-1 pr-4">
                {previewFilename}
              </h3>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0"
                aria-label="Close preview"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {previewType === "image" && (
                <div className="flex justify-center">
                  <Image
                    src={previewUrl}
                    width={800}
                    height={600}
                    alt="Preview"
                    className="rounded max-w-full h-auto"
                    unoptimized
                  />
                </div>
              )}

              {previewType === "pdf" && (
                <iframe
                  src={previewUrl}
                  className="w-full h-[60vh] md:h-[70vh] rounded border"
                  title="PDF Preview"
                />
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 p-4 border-t">
              <a
                href={previewUrl || "#"}
                download
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center"
                rel="noreferrer"
                target="_blank"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Download size={16} />
                  <span>Download</span>
                </span>
              </a>

              <button
                onClick={closePreview}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
