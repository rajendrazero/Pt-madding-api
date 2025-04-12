import { Request, Response } from 'express';
import {
  fetchAllUsers,
  insertUser,
  updateUserById,
  softDeleteUserById,
  getUsersWithFilterAndPagination
} from '../services/user.service';
import { v4 as uuidv4 } from 'uuid';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await fetchAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data pengguna.', error: err });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
    }

    const id = uuidv4();
    await insertUser({ id, username, email, password });

    res.status(201).json({ success: true, message: 'Pengguna berhasil ditambahkan.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan pengguna.', error: err });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    await updateUserById({ id, username, email, password });
    res.status(200).json({ success: true, message: 'Pengguna berhasil diperbarui.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui pengguna.', error: err });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await softDeleteUserById(id);

    res.status(200).json({ success: true, message: 'Pengguna berhasil dihapus (soft delete).' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal menghapus pengguna.', error: err });
  }
};

export const getUsersWithFilters = async (req: Request, res: Response) => {
  try {
    const { keyword, role, is_verified, page, limit } = req.query;

    const users = await getUsersWithFilterAndPagination({
      keyword: keyword as string,
      role: role as string,
      is_verified: is_verified === 'true' ? true : is_verified === 'false' ? false : undefined,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10
    });

    res.status(200).json({ success: true, ...users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data pengguna dengan filter.', error: err });
  }
};