import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

// Fungsi untuk sanitasi nama file
const sanitizeFilename = (filename: string): string => {
  return filename.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    const sanitizedFilename = sanitizeFilename(file.originalname);
    const uniqueName = `${Date.now()}-${sanitizedFilename}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowed = ['.png', '.jpg', '.jpeg', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    cb(new Error('Hanya file gambar yang diperbolehkan.'));
  } else {
    cb(null, true);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB
});