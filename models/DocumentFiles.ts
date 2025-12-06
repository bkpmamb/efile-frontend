// models/DocumentFiles.ts
import mongoose, { Schema, Document, models } from "mongoose";

export interface IDocumentFile extends Document {
  filename: string; // UUID filename
  originalFilename: string; // Nama file asli dari user
  url: string;
  uploadedBy: mongoose.Types.ObjectId;
  category: string;
  size: number;
  createdAt: Date;
}

const DocumentFileSchema = new Schema<IDocumentFile>(
  {
    filename: { type: String, required: true },
    originalFilename: { type: String, required: true },
    url: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, default: "general" },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

const DocumentFile =
  models.DocumentFile ||
  mongoose.model<IDocumentFile>("DocumentFile", DocumentFileSchema);

export default DocumentFile;
