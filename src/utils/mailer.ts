import nodemailer from 'nodemailer';

// Konfigurasi transporter email (gunakan Gmail atau SMTP lainnya)
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Gantilah dengan alamat email pengirim
    pass: process.env.EMAIL_PASS, // Gantilah dengan App Password yang kamu buat di Google Account
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
  } catch (error) {
    console.error('Gagal mengirim email:', error);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Ditemukan' : 'Kosong');
    throw new Error('Gagal mengirim email');
  }
};