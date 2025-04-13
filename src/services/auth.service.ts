import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../utils/mailer';
import { pool } from '../utils/db';


// Generate random 6-digit code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const registerUser = async (username: string, email: string, password: string): Promise<void> => {
  const { rows: existingUsers } = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
  if (existingUsers.length > 0) throw new Error('Email sudah terdaftar');

  const id = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);
  const code = generateVerificationCode();

  await pool.query(
    'INSERT INTO users (id, username, email, password, is_verified) VALUES ($1, $2, $3, $4, false)',
    [id, username, email, hashedPassword]
  );

  await saveVerificationCode(email, code);
  await sendEmail(email, 'Kode Verifikasi', `Kode kamu: ${code}`);
};

export const verifyUserCode = async (email: string, code: string): Promise<void> => {
  const { rows } = await pool.query('SELECT * FROM verification_codes WHERE email = $1', [email]);
  if (!rows.length) throw new Error('Kode tidak ditemukan');

  const record = rows[0];
  const expired = new Date().getTime() - new Date(record.created_at).getTime() >
  10 * 60 * 1000;

  if (record.code !== code) throw new Error('Kode salah');
  if (expired) throw new Error('Kode verifikasi sudah kedaluwarsa');

  await pool.query('UPDATE users SET is_verified = true WHERE email = $1', [email]);
  await pool.query('DELETE FROM verification_codes WHERE email = $1', [email]);
};

export const resendVerificationCode = async (email: string): Promise<void> => {
  const { rows: users } = await pool.query('SELECT is_verified FROM users WHERE email = $1', [email]);
  if (!users.length) throw new Error('Email belum terdaftar');
  if (users[0].is_verified) throw new Error('Akun sudah diverifikasi');

  const code = generateVerificationCode();
  await saveVerificationCode(email, code);
  await sendEmail(email, 'Kode Verifikasi Baru', `Kode verifikasi terbaru kamu: ${code}`);
};

const saveVerificationCode = async (email: string, code: string): Promise<void> => {
  await pool.query(
    `INSERT INTO verification_codes (id, email, code)
     VALUES ($1, $2, $3)
     ON CONFLICT (email)
     DO UPDATE SET code = EXCLUDED.code, created_at = CURRENT_TIMESTAMP`,
    [uuidv4(), email, code]
  );
};

export const cleanUnverified = async (): Promise<void> => {
  await pool.query(`
    DELETE FROM users
    WHERE is_verified = false AND created_at < NOW() - INTERVAL '24 hours'
  `);
};


export const loginUser = async (email: string, password: string): Promise<{ accessToken: string, refreshToken: string }> => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (!rows.length) throw new Error('Email tidak ditemukan');

  const user = rows[0];
  if (!user.is_verified) throw new Error('Akun belum diverifikasi');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Password salah');

  // Generate JWT token
  return generateToken(user.id, user.email, user.role); // Pastikan ini mengembalikan objek dengan accessToken dan refreshToken
};