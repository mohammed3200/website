/**
 * S3-Compatible Storage Service (MinIO/AWS S3)
 * Handles file upload, download, and deletion
 * 
 * This service works with both:
 * - MinIO (free, self-hosted, S3-compatible)
 * - AWS S3 (cloud-based, scalable)
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3StorageService {
  private client: S3Client;
  private bucket: string;
  private publicAccess: boolean;
  private cdnUrl?: string;

  constructor() {
    // Initialize S3 client (works with both MinIO and AWS S3)
    this.client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      endpoint: process.env.S3_ENDPOINT, // For MinIO: http://localhost:9000
      forcePathStyle: !!process.env.S3_ENDPOINT, // Required for MinIO
    });

    this.bucket = process.env.S3_BUCKET_NAME || 'website-media';
    this.publicAccess = process.env.S3_PUBLIC_ACCESS === 'true';
    this.cdnUrl = process.env.CDN_URL;
  }

  /**
   * Upload file to S3/MinIO
   * @param file - Buffer containing file data
   * @param key - S3 object key (path/filename)
   * @param contentType - MIME type
   * @returns URL and S3 key
   */
  async uploadFile(
    file: Buffer,
    key: string,
    contentType: string
  ): Promise<{ url: string; s3Key: string; bucket: string }> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: this.publicAccess ? 'public-read' : 'private',
      CacheControl: 'max-age=31536000', // Cache for 1 year
    });

    await this.client.send(command);

    // Generate URL
    const url = this.generatePublicUrl(key);

    return {
      url,
      s3Key: key,
      bucket: this.bucket,
    };
  }

  /**
   * Generate public URL for S3 object
   */
  private generatePublicUrl(key: string): string {
    if (this.cdnUrl) {
      // Use CDN URL if configured
      return `${this.cdnUrl}/${key}`;
    }

    if (process.env.S3_ENDPOINT) {
      // MinIO URL
      return `${process.env.S3_ENDPOINT}/${this.bucket}/${key}`;
    }

    // AWS S3 URL
    return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  /**
   * Generate presigned URL for temporary access (private files)
   * @param key - S3 object key
   * @param expiresIn - Expiration time in seconds (default: 1 hour)
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return await getSignedUrl(this.client, command, { expiresIn });
  }

  /**
   * Delete file from S3/MinIO
   * @param key - S3 object key
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.client.send(command);
      console.log(`✅ Deleted file from S3: ${key}`);
    } catch (error) {
      console.error(`❌ Failed to delete file from S3: ${key}`, error);
      throw error;
    }
  }

  /**
   * Check if file exists in S3/MinIO
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate unique S3 key from file metadata
   * Format: {type}s/{id}/{timestamp}-{sanitized-filename}
   */
  generateKey(
    type: 'image' | 'media',
    filename: string,
    id: string
  ): string {
    const timestamp = Date.now();
    const sanitized = filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/__+/g, '_')
      .toLowerCase();

    return `${type}s/${id}/${timestamp}-${sanitized}`;
  }

  /**
   * Get file extension from filename
   */
  getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  }
}

// Singleton instance
export const s3Service = new S3StorageService();
