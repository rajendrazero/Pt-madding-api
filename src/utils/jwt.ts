import jwt from 'jsonwebtoken';

interface Payload {
  userId: string;
  email: string;
  role: 'admin' | 'user';
}

// Generate access token dan refresh token
export const generateToken = (userId: string, email: string, role: 'admin' | 'user'): { accessToken: string, refreshToken: string } => {
  // Generate access token dengan waktu kadaluarsa 30 hari
  const accessToken = jwt.sign({ userId, email, role }, process.env.JWT_SECRET as string, {
    expiresIn: '30d', // Access token kadaluarsa dalam 30 hari
  });

  // Generate refresh token dengan waktu kadaluarsa 60 hari
  const refreshToken = jwt.sign({ userId, email, role }, process.env.JWT_SECRET as string, {
    expiresIn: '60d', // Refresh token kadaluarsa dalam 60 hari
  });

  // Return access token dan refresh token
  return { accessToken, refreshToken };
};

// Fungsi untuk decode token (untuk akses token)
export const decodeToken = (token: string): Payload => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as Payload;
};