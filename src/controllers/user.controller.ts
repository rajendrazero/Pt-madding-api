import { Request, Response, RequestHandler } from 'express';
import { fetchAllUsers, insertUser } from '../services/user.service';
import { v4 as uuidv4 } from 'uuid';

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
  const { username, email, password } = req.body; // Ambil data dari body

  // Validasi data
  if (!username || !email || !password) {
    res.status(400).json({ error: 'Field tidak lengkap!' }); // Kirim response 400 Bad Request
    return; // Hentikan eksekusi
  }

  try {
    const id = uuidv4(); // Generate UUID unik
    await insertUser({ id, username, email, password }); // Simpan ke DB lewat service

    res.status(201).json({ message: 'User berhasil ditambahkan', id }); // Kirim response sukses
  } catch (error) {
    console.error('Gagal menambahkan user:', error); // Logging jika gagal
    res.status(500).json({ error: 'Gagal menambahkan user' }); // Kirim response 500
  }
};