import type { NextFunction, Request, Response } from 'express';
import { readAuthCookie, verifyToken, type JwtPayload } from '../lib/jwt.js';
import { HttpError } from './error.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = readAuthCookie(req) ?? bearerToken(req);
  if (!token) return next(new HttpError(401, 'Unauthorized'));
  const payload = verifyToken(token);
  if (!payload) return next(new HttpError(401, 'Invalid or expired token'));
  req.user = payload;
  next();
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) return next(new HttpError(401, 'Unauthorized'));
  if (req.user.role !== 'ADMIN') return next(new HttpError(403, 'Admin only'));
  next();
}

function bearerToken(req: Request): string | null {
  const h = req.header('authorization');
  if (!h) return null;
  const [scheme, token] = h.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
}
