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
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Calendar,
  User,
  MoreVertical,
  Trash2,
  Eye,
  Download,
  File,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface DocumentsTableProps {
  documents: DocumentFile[];
  onDelete: (id: string) => void;
  onPreview: (doc: DocumentFile) => void;
}

export default function DocumentsTable({
  documents,
  onDelete,
  onPreview,
}: DocumentsTableProps) {
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

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              User Uploaded Documents
            </CardTitle>
            <CardDescription>
              {documents.length} document
              {documents.length !== 1 ? "s" : ""} found
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
              {documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 py-12">
                      <FileText className="w-16 h-16 mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No documents found</p>
                      <p className="text-sm mt-1">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => {
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
                            onClick={() => onPreview(doc)}
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
                                onClick={() => onPreview(doc)}
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
                                onClick={() => onDelete(doc._id)}
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
  );
}
