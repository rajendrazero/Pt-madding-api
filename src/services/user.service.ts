import { pool } from '../utils/db';
// Pool adalah koneksi ke PostgreSQL

export async function fetchAllUsers() {
  const res = await pool.query(`
    SELECT id, username, email, role, is_verified, created_at,
           photo_url, gender, class, description
    FROM users
    WHERE is_deleted = false AND is_verified = true
  `);
  return res.rows;
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

  // Selalu filter hanya user yang terverifikasi, default true
  filters.push(`is_verified = $${idx}`);
  values.push(is_verified ?? true);
  idx++;

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const countQuery = `SELECT COUNT(*) FROM users ${whereClause}`;
  const countRes = await pool.query(countQuery, values);
  const total = parseInt(countRes.rows[0].count, 10);

  const dataQuery = `
    SELECT id, username, email, role, is_verified, created_at,
           photo_url, gender, class, description
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


export async function updateUserById({
  id,
  username,
  email,
  password,
  photo_url,
  gender,
  class: userClass,  // `class` adalah kata kunci di JavaScript, jadi gunakan `userClass`
  description,
}: {
  id: string;
  username?: string;
  email?: string;
  password?: string;
  photo_url?: string;
  gender?: string;
  class?: string;
  description?: string;
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
  if (photo_url) {
    fields.push(`photo_url = $${idx++}`);
    values.push(photo_url);
  }
  if (gender) {
    fields.push(`gender = $${idx++}`);
    values.push(gender);
  }
  if (userClass) {
    fields.push(`class = $${idx++}`);
    values.push(userClass);
  }
  if (description) {
    fields.push(`description = $${idx++}`);
    values.push(description);
  }

  if (fields.length === 0) return;

  values.push(id);
  const query = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = $${idx} AND is_verified = true
  `;
  await pool.query(query, values);
}


export async function updateOwnProfileById({
  id,
  username,
  email,
  password,
  photo_url,
  gender,
  class: userClass,  // Gunakan `userClass` untuk menghindari bentrok dengan kata kunci `class`
  description,
}: {
  id: string;
  username?: string;
  email?: string;
  password?: string;
  photo_url?: string;
  gender?: string;
  class?: string;
  description?: string;
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
  if (photo_url) {
    fields.push(`photo_url = $${idx++}`);
    values.push(photo_url);
  }
  if (gender) {
    fields.push(`gender = $${idx++}`);
    values.push(gender);
  }
  if (userClass) {
    fields.push(`class = $${idx++}`);
    values.push(userClass);
  }
  if (description) {
    fields.push(`description = $${idx++}`);
    values.push(description);
  }

  if (fields.length === 0) return;

  values.push(id);
  const query = `
    UPDATE users
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${idx}
  `;

  await pool.query(query, values);
}


export async function softDeleteUserById(id: string) {
  await pool.query(
    `UPDATE users SET is_deleted = true WHERE id = $1 AND is_verified = true`,
    [id]
  );
}


export async function recoverUserById(id: string) {
  await pool.query(
    `UPDATE users SET is_deleted = false WHERE id = $1 AND is_verified = true`,
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


export async function getDeletedUsersService(query: any) {
  const {
    keyword,
    role,
    is_verified,
    page = '1',
    limit = '10'
  } = query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const values: any[] = [];
  const filters: string[] = ['is_deleted = true'];
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

  if (typeof is_verified === 'boolean' || is_verified === 'true' || is_verified === 'false') {
    filters.push(`is_verified = $${idx}`);
    values.push(is_verified === 'true');
    idx++;
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const countQuery = `SELECT COUNT(*) FROM users ${whereClause}`;
  const countRes = await pool.query(countQuery, values);
  const total = parseInt(countRes.rows[0].count, 10);

  const dataQuery = `
    SELECT id, username, email, role, is_verified, created_at,
           photo_url, gender, class, description
    FROM users
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;
  const dataRes = await pool.query(dataQuery, [...values, limitNum, offset]);

  return {
    data: dataRes.rows,
    total,
    currentPage: pageNum,
    totalPages: Math.ceil(total / limitNum),
  };
}


export async function getUserById(
  id: string,
  includeDeleted: boolean = false
) {
  const res = await pool.query(
    `SELECT id, username, email, role, is_verified, created_at,
            photo_url, gender, class, description
     FROM users
     WHERE id = $1 ${includeDeleted ? '' : 'AND is_deleted = false'}`,
    [id]
  );
  return res.rows[0];
}