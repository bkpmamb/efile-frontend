"use client";

import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { DocumentFile } from "@/types/documents";
import DashboardHeader from "@/components/admin/DashboardHeader";
import UserList from "@/components/admin/UserList";
import UserDocumentsPanel from "@/components/admin/UserDocumentsPanel";
import PreviewModal from "@/components/admin/PreviewModal";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "pdf" | null>(null);
  const [previewFilename, setPreviewFilename] = useState<string>("");

  // Load semua users saat pertama kali
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch("/api/admin/users");

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load documents ketika user dipilih
  const handleSelectUser = async (userId: string) => {
    setSelectedUserId(userId);
    setLoadingDocuments(true);

    try {
      const res = await fetch(`/api/admin/users/${userId}/documents`);

      if (!res.ok) {
        throw new Error("Failed to fetch user documents");
      }

      const data = await res.json();
      setSelectedUser(data.user);
      setDocuments(data.documents);
    } catch (error) {
      console.error("Error loading user documents:", error);
      setDocuments([]);
    } finally {
      setLoadingDocuments(false);
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

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Hapus dokumen ini?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/documents/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      // Update local state
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));

      // Update document count di user list
      setUsers((prev) =>
        prev.map((user) =>
          user._id === selectedUserId
            ? { ...user, documentCount: (user.documentCount || 1) - 1 }
            : user
        )
      );

      alert("Dokumen berhasil dihapus");
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Gagal menghapus dokumen");
    }
  };

  if (loadingUsers) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="px-4 md:px-6 py-4">
          <DashboardHeader />
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="h-[calc(100vh-120px)] p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Side - User List */}
          <div className="lg:col-span-1 h-full overflow-hidden">
            <UserList
              users={users}
              selectedUserId={selectedUserId}
              onSelectUser={handleSelectUser}
              loading={loadingUsers}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>

          {/* Right Side - User Documents */}
          <div className="lg:col-span-2 h-full overflow-hidden">
            <UserDocumentsPanel
              selectedUser={selectedUser}
              documents={documents}
              loading={loadingDocuments}
              onPreview={handlePreview}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewUrl && (
        <PreviewModal
          url={previewUrl}
          type={previewType}
          filename={previewFilename}
          onClose={closePreview}
        />
      )}
    </div>
  );
}
