import { Pool } from 'pg'

export const pool = new Pool({
  connectionString:
  'postgresql://postgres.cggkqhweatvrsalkpwrt:rajendraathallahfawwaz@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
})