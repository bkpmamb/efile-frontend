"use client";

import { useState, useEffect } from "react";
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
  Trash2,
  Eye,
  Download,
  Search,
  Filter,
  FileText,
  Image as ImageIcon,
  File,
  Calendar,
  User,
  MoreVertical,
  ChevronDown,
  Loader2,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Image from "next/image";

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "pdf" | null>(null);
  const [previewFilename, setPreviewFilename] = useState<string>("");

  // Helper functions (defined first)
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

  // Filter documents based on search and category
  const filteredDocuments = documents.filter((doc) => {
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

  // Get unique categories for filter
  const categories = Array.from(
    new Set(documents.map((doc) => getFileType(doc.filename)))
  );

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Hapus dokumen ini?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/documents/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      const data = await res.json();
      console.log(data); // { success: true, message: "...", s3Deleted: true }

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
              Document Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and organize all uploaded documents
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search documents by filename or uploader..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
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
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                {filteredDocuments.length} document
                {filteredDocuments.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Document</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Uploaded By</TableHead>
                  <TableHead className="font-semibold">Size</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FileText className="w-12 h-12 mb-4 text-gray-300" />
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
                      <TableRow key={doc._id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {getCategoryIcon(fileType)}
                            </div>
                            <div>
                              <p className="font-medium">
                                {doc.originalFilename || doc.filename}
                              </p>
                              <p className="text-sm text-gray-500 truncate max-w-xs">
                                {doc.category}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getCategoryColor(fileType)} gap-1`}
                          >
                            {getCategoryIcon(fileType)}
                            {fileType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            {doc.uploadedBy}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-sm">
                            {formatFileSize(doc.size)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(doc.createdAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview(doc)}
                              className="h-8 w-8 p-0"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(doc.url, "_blank")}
                              className="h-8 w-8 p-0"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
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
      <div className="mt-6 text-sm text-gray-500">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>
              PDF (
              {
                documents.filter((d) => getFileType(d.filename) === "PDF")
                  .length
              }
              )
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>
              Images (
              {
                documents.filter((d) => getFileType(d.filename) === "Image")
                  .length
              }
              )
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>
              Documents (
              {
                documents.filter((d) => getFileType(d.filename) === "Document")
                  .length
              }
              )
            </span>
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
