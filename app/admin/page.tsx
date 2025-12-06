"use client";

import { useState, useEffect, useMemo } from "react";
import { DocumentFile } from "@/types/documents";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  Upload,
  Search,
  Filter,
  Image as ImageIcon,
  Calendar,
  User,
  MoreVertical,
  ChevronDown,
  Trash2,
  Eye,
  Download,
  FolderOpen,
  Loader2,
  X,
  File,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "PDF":
        return "bg-red-100 text-red-800";
      case "Image":
        return "bg-green-100 text-green-800";
      case "Document":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage users and their uploaded documents
            </p>
          </div>
          {/* <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
              System Online
            </span>
          </div> */}
        </div>
      </div>

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

      {/* Main Documents Table */}
      <Card className="shadow-sm border-0">
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                User Uploaded Documents
              </CardTitle>
              <CardDescription>
                {filteredDocuments.length} document
                {filteredDocuments.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-700 py-3">
                    Document
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-3">
                    Category
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-3">
                    Uploaded By
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-3">
                    Size
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-3">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-3 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 py-12">
                        <FileText className="w-16 h-16 mb-4 text-gray-300" />
                        <p className="text-lg font-medium">
                          No documents found
                        </p>
                        <p className="text-sm mt-1">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => {
                    const fileType = getFileType(doc.filename);
                    return (
                      <TableRow
                        key={doc._id}
                        className="hover:bg-gray-50 border-b border-gray-100"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg border border-gray-200">
                              {getCategoryIcon(fileType)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {doc.originalFilename || doc.filename}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {doc.category}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            className={`${getCategoryColor(
                              fileType
                            )} gap-1 border`}
                          >
                            {getCategoryIcon(fileType)}
                            {fileType}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900">
                              {doc.uploadedBy}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="font-mono text-sm text-gray-700">
                            {formatFileSize(doc.size)}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">
                              {new Date(doc.createdAt).toLocaleDateString(
                                "id-ID"
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview(doc)}
                              className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(doc.url, "_blank")}
                              className="h-8 w-8 p-0 text-gray-600 hover:text-green-600"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-gray-600"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="gap-2"
                                  onClick={() => handlePreview(doc)}
                                >
                                  <Eye className="w-4 h-4" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="gap-2"
                                  onClick={() => window.open(doc.url, "_blank")}
                                >
                                  <Download className="w-4 h-4" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="gap-2 text-red-600"
                                  onClick={() => handleDelete(doc._id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Footer Stats */}
      <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold">{filteredDocuments.length}</span> of{" "}
            <span className="font-semibold">{documents.length}</span> documents
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">
                PDF ({documentStats.pdfCount})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">
                Images ({documentStats.imageCount})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">
                Documents (
                {documentStats.total -
                  documentStats.pdfCount -
                  documentStats.imageCount}
                )
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4"
          onClick={closePreview}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg truncate flex-1">
                {previewFilename}
              </h3>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
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
                  className="w-full h-[70vh] rounded border"
                  title="PDF Preview"
                />
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 p-4 border-t">
              <a
                href={previewUrl}
                download
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Download
              </a>
              <button
                onClick={closePreview}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
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
