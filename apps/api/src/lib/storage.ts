import path from 'node:path';
import fs from 'node:fs/promises';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../env.js';

export interface UploadResult {
  url: string;
  publicId?: string;
}

export interface StorageAdapter {
  upload(file: { buffer: Buffer; mimetype: string; originalname: string }): Promise<UploadResult>;
}

class LocalStorage implements StorageAdapter {
  async upload(file: { buffer: Buffer; mimetype: string; originalname: string }) {
    const dir = path.resolve(process.cwd(), 'uploads');
    await fs.mkdir(dir, { recursive: true });
    const safeName =
      `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-` +
      file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const dest = path.join(dir, safeName);
    await fs.writeFile(dest, file.buffer);
    return { url: `/uploads/${safeName}` };
  }
}

class CloudinaryStorage implements StorageAdapter {
  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  }

  upload(file: { buffer: Buffer; mimetype: string; originalname: string }): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'portfolio', resource_type: 'auto' },
        (err, result) => {
          if (err || !result) return reject(err ?? new Error('Cloudinary upload failed'));
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      );
      stream.end(file.buffer);
    });
  }
}

export function getStorage(): StorageAdapter {
  if (
    env.STORAGE_DRIVER === 'cloudinary' &&
    env.CLOUDINARY_CLOUD_NAME &&
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET
  ) {
    return new CloudinaryStorage();
  }
  return new LocalStorage();
}
