import { Request, Response } from 'express';
import { pool } from '../utils/db';

// Ambil semua user dari tabel "User"
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT id, email, createdAt FROM "User" WHERE "isDeleted" = false');
    res.json(result.rows);
  } catch (error) {
    console.error('Gagal mengambil user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};