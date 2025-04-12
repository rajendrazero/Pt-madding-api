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