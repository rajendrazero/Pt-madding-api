import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Deklarasikan properti user pada Request
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; email: string }; // Menambahkan properti user
    }
  }
}

interface UserPayload {
  userId: string;
  email: string;
}

// Middleware untuk memverifikasi JWT
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1]; // Ambil token dari header Authorization

  if (!token) {
    res.status(403).json({ error: 'Token tidak ditemukan' });
    return; // Setelah merespon error, kita cukup "return" tanpa melanjutkan ke next()
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
    req.user = decoded; // Menyimpan informasi user pada request
    next(); // Melanjutkan ke route selanjutnya
  } catch (err) {
    res.status(401).json({ error: 'Token tidak valid atau sudah kadaluarsa' });
    return; // Tidak perlu lanjutkan eksekusi, cukup "return" setelah merespons error
  }
};