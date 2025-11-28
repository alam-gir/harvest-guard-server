import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { env } from "../../config/env";
import crypto from "crypto";

const { endpoint, accessKeyId, secretAccessKey, bucket, publicUrl } = env.r2;

const s3Client = new S3Client({
  region: "auto",
  endpoint: endpoint,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
  }
});

interface UploadFileInput {
  buffer: Buffer;
  mimetype: string;
  folder?: string;
  fileName?: string;
}

/**
 * Uploads a file to Cloudflare R2.
 * @param input - The file buffer, mimetype, and optional folder/filename.
 * @returns The public URL of the uploaded file.
 */
export const uploadFile = async (input: UploadFileInput): Promise<string> => {
  const { buffer, mimetype, folder = "other", fileName } = input;

  const key = `${folder}/${fileName || crypto.randomUUID()}`;

  const putCommand = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: mimetype
  });

  await s3Client.send(putCommand);

  return `${publicUrl}/${key}`;
};

/**
 * Deletes a file from Cloudflare R2 using its public URL.
 * @param url - The public URL of the file to delete.
 */
export const deleteFile = async (url: string): Promise<void> => {
  if (!url.startsWith(publicUrl)) {
    console.error("URL does not match R2 public URL. Skipping delete.");
    return;
  }

  // Extract the key from the URL. e.g., https://pub-....gateway.dev/folder/file.jpg -> folder/file.jpg
  const key = url.substring(publicUrl.length + 1);

  const deleteCommand = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key
  });

  await s3Client.send(deleteCommand);
};
