import { prisma } from '../utils/prismaClient';
import { Role } from '@prisma/client';

// Interface untuk parameter insertUser
interface InsertUserParams {
  id: string;
  username: string;
  email: string;
  password: string;
  role?: Role;
  isVerified?: boolean;
}

export const findUserById = async (id: number) => {
  return await prisma.user.findUnique({ where: { id } });
};

// Mengambil semua user yang tidak dihapus (isDeleted false)
export async function fetchAllUsers() {
  return await prisma.user.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Menambahkan user baru ke database
export async function insertUser(params: InsertUserParams) {
  const { id, username, email, password, role = Role.user, isVerified = false } = params;
  
  return await prisma.user.create({
    data: {
      id,
      username,
      email,
      password,
      role,
      isVerified,
    },
  });
}

// Interface untuk parameter update user
interface UpdateUserParams {
  id: string;
  username?: string;
  email?: string;
  password?: string;
  role?: Role;
  isVerified?: boolean;
}

// Memperbarui data user berdasarkan ID
export async function updateUserById(params: UpdateUserParams) {
  const { id, username, email, password, role, isVerified } = params;
  
  // Kumpulkan field yang akan diupdate
  const data: Partial<{
    username: string;
    email: string;
    password: string;
    role: Role;
    isVerified: boolean;
  }> = {};

  if (username) data.username = username;
  if (email) data.email = email;
  if (password) data.password = password;
  if (role) data.role = role;
  if (typeof isVerified === 'boolean') data.isVerified = isVerified;

  // Jika tidak ada field yang diupdate, lempar error atau kembalikan hasil
  if (Object.keys(data).length === 0) {
    throw new Error('Tidak ada data yang diperbarui.');
  }

  return await prisma.user.update({
    where: { id },
    data,
  });
}

// Melakukan soft delete pada user dengan merubah status isDeleted menjadi true
export async function softDeleteUserById(id: string) {
  return await prisma.user.update({
    where: { id },
    data: { isDeleted: true },
  });
}

// Interface untuk filter parameter getUsersWithFilterAndPagination
interface UserFilterParams {
  keyword?: string;
  role?: Role;
  isVerified?: boolean;
  page?: number;
  limit?: number;
}

// Mengambil user berdasarkan filter dan pagination
export async function getUsersWithFilterAndPagination({
  keyword,
  role,
  isVerified,
  page = 1,
  limit = 10,
}: UserFilterParams) {
  // Membuat filter dasar: hanya user yang belum dihapus
  const filters: any = { isDeleted: false };

  // Jika ada keyword, cari berdasarkan username atau email (pencarian case-insensitive)
  if (keyword) {
    filters.OR = [
      { username: { contains: keyword, mode: 'insensitive' } },
      { email: { contains: keyword, mode: 'insensitive' } },
    ];
  }

  // Jika filter role ditentukan, tambahkan ke filter
  if (role) {
    filters.role = role;
  }

  // Filter untuk status verifikasi
  if (typeof isVerified === 'boolean') {
    filters.isVerified = isVerified;
  }

  // Hitung total user berdasarkan filter
  const total = await prisma.user.count({ where: filters });

  // Ambil data user dengan filter, diurutkan berdasarkan tanggal pembuatan (desc)
  const users = await prisma.user.findMany({
    where: filters,
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    data: users,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
}