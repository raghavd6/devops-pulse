
// backend/src/db.js
import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;

// If DATABASE_URL is not set, pool will be null; API will still start and report db:false
const pool = DATABASE_URL ? new Pool({ connectionString: DATABASE_URL }) : null;

let dbReady = false;

export async function initDb() {
  if (!pool) {
    dbReady = false;
    console.warn('DATABASE_URL not set; API will run with limited functionality.');
    return;
  }

  try {
    // Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(80) NOT NULL,
        body  VARCHAR(500) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    dbReady = true;
    console.log('Postgres ready; table ensured.');
  } catch (err) {
    dbReady = false;
    console.error('Postgres init failed:', err.message);
  }
}

export function isDbReady() {
  return dbReady;
}

export async function listNotes() {
  if (!dbReady) return [];
  const { rows } = await pool.query(`
    SELECT
      id,
      title,
      body,
      created_at AS "createdAt"   -- camelCase alias for frontend
    FROM notes
    ORDER BY created_at DESC
    LIMIT 50
  `);
  return rows;
}

export async function createNote(title, body) {
  if (!dbReady) throw new Error('DB not ready');
  const { rows } = await pool.query(
    `
    INSERT INTO notes (title, body)
    VALUES ($1, $2)
    RETURNING id, title, body, created_at AS "createdAt"
    `,
    [title, body]
  );
  return rows[0];
}
