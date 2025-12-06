import { DocumentFile } from "@/types/documents";
import { FileText, Image as ImageIcon, BarChart3, File } from "lucide-react";

// Filter documents by search & category
export const filterDocuments = (
  documents: DocumentFile[],
  searchQuery: string,
  selectedCategory: string | null
) => {
  return documents.filter((doc) => {
    const matchesSearch =
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
};

// Get unique categories
export const getCategories = (documents: DocumentFile[]) => {
  return Array.from(new Set(documents.map((doc) => doc.category)));
};

// Document stats
export const getDocumentStats = (documents: DocumentFile[]) => ({
  total: documents.length,
  pdfCount: documents.filter((doc) => doc.category === "PDF").length,
  imageCount: documents.filter((doc) => doc.category === "Image").length,
  todayUploads: documents.filter(
    (doc) => doc.createdAt === new Date().toISOString().split("T")[0]
  ).length,
  totalSize: documents.reduce((acc, doc) => acc + doc.size, 0),
});

// Format bytes
export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
};

// Get category icon
export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "PDF":
      return <FileText className="w-4 h-4" />;
    case "Image":
      return <ImageIcon className="w-4 h-4" />;
    case "Spreadsheet":
      return <BarChart3 className="w-4 h-4" />;
    case "Presentation":
    case "Document":
    default:
      return <File className="w-4 h-4" />;
  }
};

// Get category color
export const getCategoryColor = (category: string) => {
  switch (category) {
    case "PDF":
      return "bg-red-100 text-red-800 border-red-200";
    case "Image":
      return "bg-green-100 text-green-800 border-green-200";
    case "Spreadsheet":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Presentation":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Document":
      return "bg-amber-100 text-amber-800 border-amber-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};
