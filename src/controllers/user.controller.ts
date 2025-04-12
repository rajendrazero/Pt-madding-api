import { Request, Response, RequestHandler } from 'express';
import { 
fetchAllUsers, 
updateUserById, 
softDeleteUserById,
getUsersWithFilterAndPagination,
recoverUserById,
} from '../services/user.service';
import { v4 as uuidv4 } from 'uuid';
import { createUserSchema, updateUserSchema } from
'../validations/user.validation';
import { z } from 'zod';
import { pool } from '../utils/db'; 


/**
 * Handler untuk mengambil semua user dari database
 */
export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = await fetchAllUsers(); // Ambil semua user dari service
    res.status(200).json(users);         // Kirim response 200 OK dengan data user
  } catch (error) {
    console.error('Gagal mengambil user:', error); // Logging jika error
    res.status(500).json({ error: 'Internal Server Error' }); // Kirim response 500
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const parsed = updateUserSchema.parse(req.body); // Validasi update
    await updateUserById({ id, ...parsed });
    res.status(200).json({ message: 'User berhasil diupdate' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors.map(e => e.message) });
      return;
    }
    console.error('Gagal update user:', error);
    res.status(500).json({ error: 'Gagal update user' });
  }
};


export const deleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    await softDeleteUserById(id);
    res.status(200).json({ message: 'User berhasil dihapus (soft delete)' });
  } catch (error) {
    console.error('Gagal hapus user:', error);
    res.status(500).json({ error: 'Gagal hapus user' });
  }
};


export const getUsersPaginated: RequestHandler = async (req, res) => {
  try {
    const {
      keyword,
      role,
      is_verified,
      page = '1',
      limit = '10'
    } = req.query;

    const data = await getUsersWithFilterAndPagination({
      keyword: keyword?.toString(),
      role: role?.toString(),
      is_verified: is_verified === 'true' ? true : is_verified === 'false' ? false : undefined,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });

    res.status(200).json(data);
  } catch (error) {
    console.error('Gagal filter + pagination:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat filter data user' });
  }
};


export const recoverUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await recoverUserById(id);
    res.status(200).json({ message: 'User berhasil dipulihkan' });
  } catch (error) {
    console.error('Gagal recovery user:', error);
    res.status(500).json({ error: 'Gagal memulihkan user' });
  }
};


export const getDeletedUsers: RequestHandler = async (req, res): Promise<void> => {
  try {
    const {
      keyword,
      role,
      is_verified,
      page = '1',
      limit = '10'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const values: any[] = [];
    const filters: string[] = ['is_deleted = true'];
    let idx = 1;

    if (keyword) {
      filters.push(`(username ILIKE $${idx} OR email ILIKE $${idx})`);
      values.push(`%${keyword}%`);
      idx++;
    }

    if (role) {
      filters.push(`role = $${idx}`);
      values.push(role);
      idx++;
    }

    if (typeof is_verified === 'boolean' || is_verified === 'true' || is_verified === 'false') {
      filters.push(`is_verified = $${idx}`);
      values.push(is_verified === 'true');
      idx++;
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) FROM users ${whereClause}`;
    const countRes = await pool.query(countQuery, values);
    const total = parseInt(countRes.rows[0].count, 10);

    const dataQuery = `
      SELECT id, username, email, role, is_verified, created_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${idx} OFFSET $${idx + 1}
    `;
    const dataRes = await pool.query(dataQuery, [...values, limitNum, offset]);

    res.status(200).json({
      data: dataRes.rows,
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });

  } catch (error) {
    console.error('Gagal ambil user terhapus:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat ambil user terhapus' });
  }
};