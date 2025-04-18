import { z } from 'zod';

// Validasi untuk update user (boleh sebagian)
export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  photo_url: z.string().url().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  class: z.string().max(50).optional(),
  description: z.string().optional(),
}).refine(data => Object.keys(data).some(key => data[key as keyof typeof data] !== undefined), {
  message: "Minimal satu field harus diisi"
});

// Validasi untuk membuat user baru + kode verifikasi
export const createUserSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  code: z.string().length(6, "Kode verifikasi harus 6 digit angka"),
});


export const updateOwnProfileSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  photo_url: z.string().url().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  class: z.string().max(50).optional(),
  description: z.string().optional(),
}).refine(data => Object.keys(data).some(key => data[key as keyof typeof data] !== undefined), {
  message: "Minimal satu field harus diisi"
});