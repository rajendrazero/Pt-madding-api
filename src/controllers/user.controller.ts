import { Request, Response, RequestHandler } from 'express';
import { 
fetchAllUsers, 
insertUser,
updateUserById, 
softDeleteUserById,
getUsersWithFilterAndPagination,
} from '../services/user.service';
import { v4 as uuidv4 } from 'uuid';
import { createUserSchema, updateUserSchema } from
'../validations/user.validation';
import { z } from 'zod';

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

/**
 * Handler untuk membuat user baru
 */
export const createUser: RequestHandler = async (req, res) => {
  try {
    const parsed = createUserSchema.parse(req.body); // Validasi pakai Zod
    const id = uuidv4();
    await insertUser({ id, ...parsed });

    res.status(201).json({ message: 'User berhasil ditambahkan', id });
  } catch (error) {
    if (error instanceof z.ZodError) {
       res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    console.error('Gagal menambahkan user:', error);
    res.status(500).json({ error: 'Gagal menambahkan user' });
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