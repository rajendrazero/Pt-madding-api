import { Request, Response, RequestHandler } from 'express';
import * as AuthService from '../services/auth.service';
import { registerSchema, verifyCodeSchema, resendCodeSchema, loginSchema} from '../validations/auth.validation';
import { z } from 'zod';

// Fungsi untuk menangani error
const handleError = (err: any, res: Response): void => {
  if (err instanceof z.ZodError) {
    res.status(400).json({ error: err.errors.map(e => e.message) });
  } else if (err instanceof Error) {
    res.status(400).json({ error: err.message });
  } else {
    res.status(400).json({ error: 'Terjadi kesalahan tak dikenal' });
  }
};

// Register dan kirim kode verifikasi
export const register: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { username, email, password } = registerSchema.parse(req.body);
    await AuthService.registerUser(username, email, password);
    res.status(200).json({ message: 'Registrasi berhasil. Kode verifikasi telah dikirim ke email.' });
  } catch (err) {
    handleError(err, res);
  }
};

// Verifikasi kode
export const verifyCode: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { email, code } = verifyCodeSchema.parse(req.body);
    await AuthService.verifyUserCode(email, code);
    res.status(201).json({ message: 'Registrasi berhasil dan akun telah diverifikasi' });
  } catch (err) {
    handleError(err, res);
  }
};

// Kirim ulang kode verifikasi
export const resendCode: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { email } = resendCodeSchema.parse(req.body);
    await AuthService.resendVerificationCode(email);
    res.status(200).json({ message: 'Kode verifikasi berhasil dikirim ulang' });
  } catch (err) {
    handleError(err, res);
  }
};


export const login: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const token = await AuthService.loginUser(email, password);
    res.status(200).json({ message: 'Login berhasil', token });
  } catch (err) {
    handleError(err, res);
  }
};