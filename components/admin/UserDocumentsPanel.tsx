import { DocumentFile } from "@/types/documents";
import { User } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Image as ImageIcon,
  File,
  Eye,
  Download,
  Trash2,
  Loader2,
  FolderOpen,
  Calendar,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface UserDocumentsPanelProps {
  selectedUser: User | null;
  documents: DocumentFile[];
  loading: boolean;
  onPreview: (doc: DocumentFile) => void;
  onDelete: (id: string) => void;
}

export default function UserDocumentsPanel({
  selectedUser,
  documents,
  loading,
  onPreview,
  onDelete,
}: UserDocumentsPanelProps) {
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
        return "bg-red-100 text-red-800 border-red-200";
      case "Image":
        return "bg-green-100 text-green-800 border-green-200";
      case "Document":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!selectedUser) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center text-gray-500 py-12">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Select a user</p>
          <p className="text-sm mt-1">
            Click on a user from the left panel to view their documents
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="border-b">
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              {selectedUser.name}&apos;s Documents
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              @{selectedUser.username} • {documents.length} document
              {documents.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Badge
            variant={selectedUser.role === "admin" ? "default" : "secondary"}
            className="capitalize"
          >
            {selectedUser.role}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-y-auto">
        {documents.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No documents uploaded</p>
            <p className="text-sm mt-1">
              This user hasn&apos;t uploaded any documents yet
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {documents.map((doc) => {
              const fileType = getFileType(doc.filename);
              return (
                <div
                  key={doc._id}
                  className="p-4 hover:bg-gray-50 transition flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-gray-100 rounded-lg border border-gray-200 shrink-0">
                      {getCategoryIcon(fileType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {doc.originalFilename || doc.filename}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge
                          className={`${getCategoryColor(
                            fileType
                          )} gap-1 border text-xs`}
                        >
                          {getCategoryIcon(fileType)}
                          {fileType}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(doc.size)}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(doc.createdAt).toLocaleDateString("id-ID")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
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
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
