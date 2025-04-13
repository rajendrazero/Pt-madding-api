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
  // Versi teks biasa
  const textContent = `
    Halo,

    Berikut adalah kode Anda:

    ${text}

    Jika Anda tidak merasa meminta kode ini, abaikan saja email ini.

    Salam,
    Tim Litera9
  `;

  // Versi HTML (kode bisa disalin)
  const htmlContent = `
    <p>Halo,</p>
    <p>Berikut adalah kode Anda:</p>
    <pre style="background:#f4f4f4;padding:10px;border-radius:5px;font-size:16px;border:1px solid #ddd;">${text}</pre>
    <p>Silakan salin dan tempel kode ini ke halaman verifikasi Litera9.</p>
    <p>Jika Anda tidak merasa meminta kode ini, abaikan saja email ini.</p>
    <p>Salam,<br>Tim Litera9</p>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Litera9" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: textContent,
      html: htmlContent,
      headers: {
        'X-Priority': '1 (Highest)',
        'X-Mailer': 'Nodemailer',
      },
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