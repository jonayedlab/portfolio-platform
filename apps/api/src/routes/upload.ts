import { Router } from 'express';
import multer from 'multer';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { getStorage } from '../lib/storage.js';
import { HttpError } from '../middleware/error.js';

export const uploadRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

uploadRouter.post('/', requireAuth, requireAdmin, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) throw new HttpError(400, 'No file uploaded');
    const storage = getStorage();
    const result = await storage.upload({
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname,
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});
