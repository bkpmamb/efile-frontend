"use client";

import { useState, useMemo } from "react";
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
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { documents as dummyDocuments } from "@/data/documents";
import {
  filterDocuments,
  formatFileSize,
  getCategories,
  getCategoryColor,
  getCategoryIcon,
  getDocumentStats,
} from "@/utils/helpers";

export default function AdminDashboard() {
  // Stats data
  const [stats] = useState({});

  // Documents data
  const [documents, setDocuments] = useState<DocumentFile[]>(dummyDocuments);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Gunakan useMemo untuk menghitung data yang diturunkan
  const filteredDocuments = useMemo(
    () => filterDocuments(documents, searchQuery, selectedCategory),
    [documents, searchQuery, selectedCategory]
  );

  const categories = useMemo(() => getCategories(documents), [documents]);

  const documentStats = useMemo(() => getDocumentStats(documents), [documents]);

  const handleDelete = (id: string) => {
    const confirmDelete = confirm("Hapus dokumen ini?");
    if (!confirmDelete) return;

    setDocuments((prev) => prev.filter((doc) => doc._id !== id));
  };

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
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
              System Online
            </span>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                // Hapus cookie dan redirect ke login
                document.cookie = "username=; path=/; max-age=0";
                document.cookie = "role=; path=/; max-age=0";
                window.location.href = "/login";
              }}
              className="flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <h3 className="text-3xl font-bold mt-2">{stats.totalUsers}</h3>
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
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <Button variant="outline" size="sm" className="border-gray-300">
                Export CSV
              </Button>
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
                  filteredDocuments.map((doc) => (
                    <TableRow
                      key={doc._id}
                      className="hover:bg-gray-50 border-b border-gray-100"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg border border-gray-200">
                            {getCategoryIcon(doc.category)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {doc.filename}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {doc.url}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          className={`${getCategoryColor(
                            doc.category
                          )} gap-1 border`}
                        >
                          {getCategoryIcon(doc.category)}
                          {doc.category}
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
                          <span className="text-gray-700">{doc.createdAt}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(doc.url, "_blank")}
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
                              <DropdownMenuItem className="gap-2">
                                <Eye className="w-4 h-4" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
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
                  ))
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
                Spreadsheets (
                {documentStats.total -
                  documentStats.pdfCount -
                  documentStats.imageCount}
                )
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
