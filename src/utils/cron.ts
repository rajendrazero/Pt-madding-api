import cron from 'node-cron';
import { cleanUnverified } from '../services/auth.service';
import { deleteOldSoftDeletedUsers } from '../services/user.service';

cron.schedule('*/30 * * * *', async () => {
  console.log('Menjalankan scheduled tasks setiap 30 menit...');

  try {
    console.log('> Menjalankan cleanUnverified...');
    await cleanUnverified();
    console.log('> Selesai cleanUnverified');
  } catch (error) {
    console.error('> Gagal menjalankan cleanUnverified:', error);
  }

  try {
    console.log('> Menjalankan deleteOldSoftDeletedUsers...');
    await deleteOldSoftDeletedUsers();
    console.log('> Selesai deleteOldSoftDeletedUsers');
  } catch (error) {
    console.error('> Gagal menjalankan deleteOldSoftDeletedUsers:', error);
  }
});