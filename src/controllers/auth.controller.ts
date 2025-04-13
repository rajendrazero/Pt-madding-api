import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { registerSchema, verifyCodeSchema, resendCodeSchema, loginSchema } from '../validations/auth.validation';
import { registerUser,
         verifyUserCode,  
         resendVerificationCode, 
         loginUser,
         
} from '../services/auth.service';
import { ZodError } from 'zod'; // Pastikan ZodError diimpor dari Zod
import { handleRefreshToken } from '../middlewares/auth.middleware.js'; 


export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validasi input
    const validatedData = registerSchema.parse(req.body);

    const { username, email, password } = validatedData;

    // Panggil service untuk registrasi
    await registerUser(username, email, password);

    res.status(201).json({ message: 'Registrasi berhasil. Cek email untuk kode verifikasi.' });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.errors });
    } else if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Terjadi kesalahan yang tidak diketahui' });
    }
  }
};

export const verifyCode = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validasi input
    const validatedData = verifyCodeSchema.parse(req.body);

    const { email, code } = validatedData;

    // Panggil service untuk verifikasi kode
    await verifyUserCode(email, code);

    res.status(200).json({ message: 'Akun berhasil diverifikasi' });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.errors });
    } else if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Terjadi kesalahan yang tidak diketahui' });
    }
  }
};

export const resendCode = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validasi input
    const validatedData = resendCodeSchema.parse(req.body);

    const { email } = validatedData;

    // Panggil service untuk mengirim ulang kode
    await resendVerificationCode(email);

    res.status(200).json({ message: 'Kode verifikasi baru telah dikirimkan ke email.' });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.errors });
    } else if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Terjadi kesalahan yang tidak diketahui' });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validasi input
    const validatedData = loginSchema.parse(req.body);

    const { email, password } = validatedData;

    // Panggil service untuk login dan mendapatkan access token serta refresh token
    const { accessToken, refreshToken } = await loginUser(email, password);

    res.status(200).json({ message: 'Login berhasil', accessToken, refreshToken });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.errors });
    } else if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Terjadi kesalahan yang tidak diketahui' });
    }
  }
};


// Endpoint untuk refresh token
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.body.refreshToken;

  try {
    // Panggil service untuk menangani refresh token
    const { accessToken, refreshToken: newRefreshToken } = await handleRefreshToken(refreshToken);
    
    // Kirimkan kembali access token dan refresh token baru ke client
    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (err: any) {
    // Jika terjadi error, kirimkan response error dengan status 401
    res.status(401).json({ error: err.message });
  }
};