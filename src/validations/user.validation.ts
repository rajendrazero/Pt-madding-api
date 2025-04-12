import { z } from 'zod';

// Validasi untuk membuat user baru
export const createUserSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter")
});

// Validasi untuk update user (boleh sebagian)
export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: "Minimal satu field harus diisi"
});