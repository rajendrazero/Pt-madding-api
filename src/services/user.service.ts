import { prisma } from '../utils/prismaClient';

export async function fetchAllUsers() {
  return await prisma.user.findMany({
    where: {
      isDeleted: false
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true
    }
  });
}

export async function insertUser({
  id,
  username,
  email,
  password
}: {
  id: string;
  username: string;
  email: string;
  password: string;
}) {
  await prisma.user.create({
    data: {
      id,
      username,
      email,
      password
    }
  });
}

export async function updateUserById({
  id,
  username,
  email,
  password
}: {
  id: string;
  username?: string;
  email?: string;
  password?: string;
}) {
  const data: any = {};
  if (username) data.username = username;
  if (email) data.email = email;
  if (password) data.password = password;

  if (Object.keys(data).length === 0) return;

  await prisma.user.update({
    where: { id },
    data
  });
}

export async function softDeleteUserById(id: string) {
  await prisma.user.update({
    where: { id },
    data: { isDeleted: true }
  });
}

export async function getUsersWithFilterAndPagination({
  keyword,
  role,
  isVerified,
  page = 1,
  limit = 10
}: {
  keyword?: string;
  role?: string;
  isVerified?: boolean;
  page?: number;
  limit?: number;
}) {
  const filters: any = {
    isDeleted: false
  };

  if (keyword) {
    filters.OR = [
      { username: { contains: keyword, mode: 'insensitive' } },
      { email: { contains: keyword, mode: 'insensitive' } }
    ];
  }

  if (role) {
    filters.role = role;
  }

  if (typeof isVerified === 'boolean') {
    filters.isVerified = isVerified;
  }

  const total = await prisma.user.count({ where: filters });

  const users = await prisma.user.findMany({
    where: filters,
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    skip: (page - 1) * limit,
    take: limit
  });

  return {
    data: users,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit)
  };
}