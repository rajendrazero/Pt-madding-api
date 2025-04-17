import { Request, Response, RequestHandler } from 'express';
import { 
fetchAllUsers, 
updateUserById, 
softDeleteUserById,
getUsersWithFilterAndPagination,
recoverUserById,
updateOwnProfileById,
getDeletedUsersService,
getUserById,
} from '../services/user.service';
import { v4 as uuidv4 } from 'uuid';
import { 
  createUserSchema, 
  updateUserSchema,
  updateOwnProfileSchema
   } from
'../validations/user.validation';
import { z } from 'zod';
import { pool } from '../utils/db'; 
import { supabase } from '../utils/supabaseClient';
import sharp from 'sharp';
/**
 * Handler untuk mengambil semua user dari database
 */
export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = await fetchAllUsers(); // Ambil semua user dari service
    res.status(200).json(users);         // Kirim response 200 OK dengan data user
  } catch (error) {
    console.error('Gagal mengambil user:', error); // Logging jika error
    res.status(500).json({ error: 'Internal Server Error' }); // Kirim response 500
  }
};


export const getUsersPaginated: RequestHandler = async (req, res) => {
  try {
    const {
      keyword,
      role,
      is_verified,
      page = '1',
      limit = '10'
    } = req.query;

    const data = await getUsersWithFilterAndPagination({
      keyword: keyword?.toString(),
      role: role?.toString(),
      is_verified: is_verified === 'true' ? true : is_verified === 'false' ? false : undefined,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });

    res.status(200).json(data);
  } catch (error) {
    console.error('Gagal filter + pagination:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat filter data user' });
  }
};


export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const parsed = updateUserSchema.parse(req.body); // Validasi update
    await updateUserById({ id, ...parsed }); // Lakukan update

    const updatedUser = await getUserById(id); // Ambil user yang sudah diperbarui
    res.status(200).json({
      message: 'User berhasil diupdate',
      user: updatedUser
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors.map(e => e.message) });
      return;
    }
    console.error('Gagal update user:', error);
    res.status(500).json({ error: 'Gagal update user' });
  }
};


export const updateOwnProfile: RequestHandler = async (req, res): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized: user ID not found' });
    return;
  }

  try {
    const parsed = updateOwnProfileSchema.parse(req.body);
    await updateOwnProfileById({ id: userId, ...parsed });

    const updatedUser = await getUserById(userId); // Ambil data terbaru
    res.status(200).json({
      message: 'Profil berhasil diperbarui',
      user: updatedUser
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors.map(e => e.message) });
      return;
    }
    console.error('Gagal update profil:', error);
    res.status(500).json({ error: 'Gagal update profil' });
  }
};


// Hapus akun (soft delete) - untuk pengguna dan admin
export const deleteUser: RequestHandler = async (req, res): Promise<void> => {
  const userId = req.user?.userId; // ID pengguna yang sedang login
  const targetUserId = req.params.id; // ID pengguna yang ingin dihapus

  // Cek apakah role adalah admin atau jika pengguna adalah user biasa dan mencoba menghapus dirinya sendiri
  if (req.user?.role === 'admin' || userId === targetUserId) {
    try {
      await softDeleteUserById(targetUserId); // Menghapus akun dengan soft delete
      res.status(200).json({ message: 'User berhasil dihapus (soft delete)' });
    } catch (error) {
      console.error('Gagal hapus user:', error);
      res.status(500).json({ error: 'Gagal hapus user' });
    }
  } else {
    res.status(403).json({ error: 'Forbidden: hanya admin yang bisa menghapus pengguna lain' });
  }
};


export const recoverUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await recoverUserById(id);
    res.status(200).json({ message: 'User berhasil dipulihkan' });
  } catch (error) {
    console.error('Gagal recovery user:', error);
    res.status(500).json({ error: 'Gagal memulihkan user' });
  }
};


export const getDeletedUsers: RequestHandler = async (req, res): Promise<void> => {
  try {
    const result = await getDeletedUsersService(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error('Gagal ambil user terhapus:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat ambil user terhapus' });
  }
};


export const getUserByIdHandler: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { includeDeleted } = req.query; // Menggunakan query untuk menentukan apakah termasuk yang terhapus

  try {
    const user = await getUserById(id, includeDeleted === 'true'); // Cek apakah includeDeleted = 'true'
    if (user) {
      res.status(200).json(user); // Jika user ditemukan, kirimkan data
    } else {
      res.status(404).json({ error: 'User tidak ditemukan' }); // Jika tidak ditemukan
    }
  } catch (error) {
    console.error('Gagal mengambil user:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil user' });
  }
};


export const uploadProfileImage: RequestHandler = async (req, res): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized: user ID not found' });
    return;
  }

  if (!req.file) {
    res.status(400).json({ message: 'Tidak ada file yang diupload.' });
    return;
  }

  const file = req.file;
  const fileExt = file.originalname.split('.').pop();
  const fileName = `avatars/${userId}_${Date.now()}.${fileExt}`;

  try {
    // Resize gambar ke max width/height 300px dengan kualitas bagus
    const resizedBuffer = await sharp(file.buffer)
      .resize(300, 300, { fit: 'cover' })
      .toFormat('jpeg')
      .jpeg({ quality: 80 })
      .toBuffer();

    // Ambil data user untuk mengetahui photo_url lama (jika ada)
    const user = await getUserById(userId);
    const oldPhotoUrl = user?.photo_url;

    // Upload gambar baru ke Supabase
    const { data, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, resizedBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload gagal:', uploadError);
      res.status(500).json({ error: 'Gagal upload gambar ke Supabase' });
      return;
    }

    // Ambil public URL file baru
    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
    const photo_url = publicUrlData.publicUrl;

    // Hapus foto lama (jika ada dan bukan default)
    if (oldPhotoUrl && oldPhotoUrl.includes('avatars/')) {
      const oldFile = oldPhotoUrl.split('/').pop();
      if (oldFile) {
        await supabase.storage.from('avatars').remove([`avatars/${oldFile}`]);
      }
    }

    // Simpan ke database
    await updateOwnProfileById({ id: userId, photo_url });

    const updatedUser = await getUserById(userId);
    res.status(200).json({
      message: 'Upload berhasil & profil diperbarui',
      url: photo_url,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Gagal proses upload:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat upload gambar' });
  }
};
