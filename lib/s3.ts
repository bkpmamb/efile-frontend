// lib/s3.ts
import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.NOS_REGION || "IDN",
  endpoint: process.env.NOS_ENDPOINT || "https://nos.wjv-1.neo.id",
  credentials: {
    accessKeyId: process.env.NOS_ACCESS_KEY!,
    secretAccessKey: process.env.NOS_SECRET_KEY!,
  },
  forcePathStyle: true,
});
