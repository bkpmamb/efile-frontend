export interface DocumentFile {
  _id: string;
  filename: string;
  originalFilename: string;
  url: string;
  uploadedBy: string;
  category: string;
  size: number; // bytes
  createdAt: string;
  updatedAt?: string;
}
