import { pool } from '../utils/db'

export async function getAllUsers() {
  const res = await pool.query('SELECT * FROM "User" WHERE "isDeleted" = false')
  return res.rows
}