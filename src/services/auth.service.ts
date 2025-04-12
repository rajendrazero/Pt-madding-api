import { pool } from '../utils/db';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

export const registerUser = async (email: string, password: string) => {
  // Cek apakah email sudah digunakan
  const existingUser = await pool.query(
    'SELECT * FROM "User" WHERE email = $1',
    [email]
  );
  if (existingUser.rows.length > 0) {
    throw new Error('Email sudah digunakan.');
  }

  // Enkripsi password
  const hashed = await bcrypt.hash(password, 10);

  // Simpan user ke database
  const newUser = await pool.query(
    'INSERT INTO "User" (email, password) VALUES ($1, $2) RETURNING id, email',
    [email, hashed]
  );

  return newUser.rows[0]; // { id, email }
};

export const loginUser = async (email: string, password: string) => {
  // Cek user berdasarkan email
  const userResult = await pool.query(
    'SELECT * FROM "User" WHERE email = $1',
    [email]
  );
  const user = userResult.rows[0];

  if (!user) {
    throw new Error('Email tidak ditemukan.');
  }

  // Bandingkan password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Password salah.');
  }

  // Buat token
  const token = generateToken({ id: user.id, email: user.email });

  return { token };
};