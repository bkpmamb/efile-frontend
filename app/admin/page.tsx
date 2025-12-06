"use client";

import { useState, useEffect, useMemo } from "react";
import { DocumentFile } from "@/types/documents";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  Search,
  Filter,
  Image as ImageIcon,
  ChevronDown,
  FolderOpen,
  Loader2,
  File,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import DashboardHeader from "@/components/admin/DashboardHeader";
import PreviewModal from "@/components/admin/PreviewModal";
import FooterStats from "@/components/admin/FooterStats";
import DocumentsTable from "@/components/admin/DocumentsTable";

export default function AdminDashboard() {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "pdf" | null>(null);
  const [previewFilename, setPreviewFilename] = useState<string>("");

  // Helper functions
  const getFileType = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "PDF";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || ""))
      return "Image";
    return "Document";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "PDF":
        return <FileText className="w-4 h-4" />;
      case "Image":
        return <ImageIcon className="w-4 h-4" />;
      case "Document":
        return <File className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  // Fetch all documents
  useEffect(() => {
    async function loadDocs() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/documents");

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
    }
    loadDocs();
  }, []);

  // Computed values
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        (doc.originalFilename || doc.filename)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        doc.uploadedBy
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || getFileType(doc.filename) === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [documents, searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(documents.map((doc) => getFileType(doc.filename)))
    );
  }, [documents]);

  const documentStats = useMemo(() => {
    const pdfCount = documents.filter(
      (d) => getFileType(d.filename) === "PDF"
    ).length;
    const imageCount = documents.filter(
      (d) => getFileType(d.filename) === "Image"
    ).length;
    const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);

    return {
      total: documents.length,
      pdfCount,
      imageCount,
      totalSize,
    };
  }, [documents]);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Hapus dokumen ini?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/documents/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
      alert("Dokumen berhasil dihapus");
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Gagal menghapus dokumen");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <DashboardHeader />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <h3 className="text-3xl font-bold mt-2">
                  {new Set(documents.map((d) => d.uploadedBy)).size}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Active accounts</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full border border-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Documents
                </p>
                <h3 className="text-3xl font-bold mt-2">
                  {documentStats.total}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {formatFileSize(documentStats.totalSize)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-full border border-green-100">
                <FolderOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">PDF Files</p>
                <h3 className="text-3xl font-bold mt-2">
                  {documentStats.pdfCount}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Document files</p>
              </div>
              <div className="p-3 bg-red-50 rounded-full border border-red-100">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Images</p>
                <h3 className="text-3xl font-bold mt-2">
                  {documentStats.imageCount}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Photo files</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-full border border-amber-100">
                <ImageIcon className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card className="mb-6 shadow-sm border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search documents by filename or uploader..."
                className="pl-10 border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 border-gray-300">
                    <Filter className="w-4 h-4" />
                    Category
                    {selectedCategory && (
                      <Badge variant="secondary" className="ml-1">
                        {selectedCategory}
                      </Badge>
                    )}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                    All Categories
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="flex items-center gap-2"
                    >
                      {getCategoryIcon(category)}
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="border border-gray-300"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DocumentsTable
        documents={filteredDocuments}
        onDelete={handleDelete}
        onPreview={handlePreview}
      />

      <FooterStats
        filteredCount={filteredDocuments.length}
        totalCount={documents.length}
        stats={documentStats}
      />

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
