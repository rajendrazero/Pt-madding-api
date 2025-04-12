import { Request, Response } from 'express';
import { createUserSchema, updateUserSchema } from '../validations/user.validation';
import {
  fetchAllUsers,
  insertUser,
  updateUserById,
  softDeleteUserById,
  getUsersWithFilterAndPagination,
  findUserById
} from '../services/user.service';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import bcrypt from 'bcrypt';

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
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }

    const { username, email, password } = parsed.data;
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    await insertUser({ id, username, email, password: hashedPassword });

    res.status(201).json({ success: true, message: 'Pengguna berhasil ditambahkan.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan pengguna.', error: err });
  }
};


export const updateUser = async (req: Request, res: Response) => {
  try {
    // Convert id dari string ke number
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'ID tidak valid.' });
    }

    // Cek apakah user ada dan belum dihapus
    const existingUser = await findUserById(id);
    if (!existingUser || existingUser.isDeleted) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan atau sudah dihapus.' });
    }

    // Validasi data request body
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }

    const { username, email, password } = parsed.data;

    // Hash password jika ada
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    // Update data user
    const updated = await updateUserById(id, {
      username,
      email,
      ...(hashedPassword && { password: hashedPassword }),
    });

    res.status(200).json({ success: true, message: 'Pengguna berhasil diperbarui.', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui pengguna.', error: err });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingUser = await findUserById(id);
    if (!existingUser || existingUser.isDeleted) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan atau sudah dihapus.' });
    }

    await softDeleteUserById(id);
    res.status(200).json({ success: true, message: 'Pengguna berhasil dihapus (soft delete).' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal menghapus pengguna.', error: err });
  }
};


export const getUsersWithFilters = async (req: Request, res: Response) => {
  try {
    const { keyword, role, isVerified, page, limit } = req.query;

    const users = await getUsersWithFilterAndPagination({
      keyword: keyword as string,
      role: role as string,
      isVerified: isVerified === 'true' ? true : isVerified === 'false' ? false : undefined,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10
    });

    res.status(200).json({ success: true, ...users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data pengguna dengan filter.', error: err });
  }
};


