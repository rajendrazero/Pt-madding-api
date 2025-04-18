// auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/jwt';

interface UserPayload {
  userId: string;
  email: string;
  role: 'admin' | 'user';
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

// Middleware untuk memverifikasi token JWT
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(403).json({ error: 'Token tidak ditemukan' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token tidak valid atau sudah kadaluarsa' });
    return;
  }
};

// Middleware untuk memeriksa apakah role yang diberikan termasuk yang diperbolehkan
export const checkRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({ error: 'Akses ditolak. Role tidak sesuai.' });
      return;
    }
    next();
  };
};

// Fungsi untuk menangani refresh token
export const handleRefreshToken = async (refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> => {
  if (!refreshToken) {
    throw new Error('Refresh token tidak ditemukan');
  }

  try {
    // Verifikasi refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as UserPayload;

    // Generate access token baru dan refresh token baru
    return generateToken(decoded.userId, decoded.email, decoded.role);
  } catch (err) {
    throw new Error('Refresh token tidak valid atau sudah kadaluarsa');
  }
};