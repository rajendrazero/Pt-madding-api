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
  await pool.query(
    `
    INSERT INTO users (id, username, email, password)
    VALUES ($1, $2, $3, $4)
  `,
    [id, username, email, password]
  );
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
