import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); 
const user = process.env.EMAIL_USER?.trim();
const pass = process.env.EMAIL_PASS?.trim();

if (!user || !pass) {
  throw new Error('EMAIL_USER atau EMAIL_PASS tidak di-set atau kosong.');
}

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user,
    pass,
  },
});

// Fungsi untuk mengirim email
export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log('Email berhasil dikirim:', info.response);
  } catch (error: any) {
  console.error('Gagal mengirim email:', error);
  console.log('ERROR MESSAGE:', error.message);
  console.log('ERROR RESPONSE:', error.response);
  console.log('ERROR CODE:', error.code);

    throw new Error('Gagal mengirim email');
  }
};