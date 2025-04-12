import { pool } from '../utils/db';
// Pool adalah koneksi ke PostgreSQL

export async function fetchAllUsers() {
  const res = await pool.query(`
    SELECT id, username, email, role, is_verified, created_at
    FROM users
    WHERE is_deleted = false
  `);
  return res.rows;
}


export async function updateUserById({
  id,
  username,
  email,
  password,
}: {
  id: string;
  username?: string;
  email?: string;
  password?: string;
}) {
  const fields = [];
  const values = [];
  let idx = 1;

  if (username) {
    fields.push(`username = $${idx++}`);
    values.push(username);
  }
  if (email) {
    fields.push(`email = $${idx++}`);
    values.push(email);
  }
  if (password) {
    fields.push(`password = $${idx++}`);
    values.push(password);
  }

  if (fields.length === 0) return;

  values.push(id);
  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx}`;
  await pool.query(query, values);
}

export async function softDeleteUserById(id: string) {
  await pool.query(
    `UPDATE users SET is_deleted = true WHERE id = $1`,
    [id]
  );
}

export async function getUsersWithFilterAndPagination({
  keyword,
  role,
  is_verified,
  page = 1,
  limit = 10
}: {
  keyword?: string;
  role?: string;
  is_verified?: boolean;
  page?: number;
  limit?: number;
}) {
  const values: any[] = [];
  const filters: string[] = ['is_deleted = false'];
  let idx = 1;

  if (keyword) {
    filters.push(`(username ILIKE $${idx} OR email ILIKE $${idx})`);
    values.push(`%${keyword}%`);
    idx++;
  }

  if (role) {
    filters.push(`role = $${idx}`);
    values.push(role);
    idx++;
  }

  if (typeof is_verified === 'boolean') {
    filters.push(`is_verified = $${idx}`);
    values.push(is_verified);
    idx++;
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  // Ambil total count
  const countQuery = `SELECT COUNT(*) FROM users ${whereClause}`;
  const countRes = await pool.query(countQuery, values);
  const total = parseInt(countRes.rows[0].count, 10);

  // Ambil data pengguna
  const dataQuery = `
    SELECT id, username, email, role, is_verified, created_at
    FROM users
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;
  const dataRes = await pool.query(dataQuery, [...values, limit, offset]);

  return {
    data: dataRes.rows,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
}


export async function recoverUserById(id: string) {
  await pool.query(
    `UPDATE users SET is_deleted = false WHERE id = $1`,
    [id]
  );
}

export async function deleteOldSoftDeletedUsers(): Promise<void> {
  console.log('Menghapus pengguna soft-deleted lebih dari 1 hari');

  try {
    const result = await pool.query(`
      DELETE FROM users
      WHERE is_deleted = true AND updated_at < NOW() - INTERVAL '1 DAY'
    `);
    console.log(`${result.rowCount} pengguna dihapus`);
  } catch (error) {
    console.error('Error saat menghapus pengguna:', error);
  }
}