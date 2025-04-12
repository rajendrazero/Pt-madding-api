import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


// Konfigurasi transporter untuk menggunakan Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rajendrasekolah@gmail.com', // Gantilah dengan alamat email pengirim
    pass: 'iwzqygdkiqviusbp', // Gantilah dengan App Password yang kamu buat di Google Account
  },
});

// Fungsi untuk mengirim email
const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const info = await transporter.sendMail({
      from: 'rajendrasekolah@gmail.com', // Pengirim (gunakan email yang sama dengan di auth)
      to, // Penerima
      subject, // Subjek email
      text, // Isi pesan
    });

    console.log('Email berhasil dikirim:', info.response);
  } catch (error) {
    console.error('Gagal mengirim email:', error);
    throw new Error('Gagal mengirim email');
  }
};

// Tes pengiriman email
(async () => {
  try {
    await sendEmail('rajendraathallahfawwaz08@gmail.com', 'Test Email', 'Halo, ini adalah percakapan tes pengiriman email!');
    console.log('Tes berhasil dikirim');
  } catch (err) {
    console.error('Tes gagal:', err);
  }
})();