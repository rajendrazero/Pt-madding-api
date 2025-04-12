// src/validations/auth.validation.ts
import { z } from 'zod';

// Validasi untuk registrasi
export const registerSchema = z.object({
  username: z.string().min(3, { message: 'Username harus memiliki minimal 3 karakter' }),
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password harus memiliki minimal 6 karakter' })
});

// Validasi untuk verifikasi kode
export const verifyCodeSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  code: z.string().length(6, { message: 'Kode verifikasi harus memiliki 6 digit' })
});

// Validasi untuk mengirim ulang kode verifikasi
export const resendCodeSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' })
});