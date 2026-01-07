
// backend/src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb, isDbReady, listNotes, createNote } from './db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- routes ---
app.get('/', (_req, res) => {
  res.json({
    message: 'DevOps Pulse API',
    health: '/api/health',
    notes: '/api/notes'
  });
});

app.get('/api/health', async (_req, res) => {
  res.json({
    status: 'ok',
    service: 'api',
    db: isDbReady(),
    time: new Date().toISOString()
  });
});

app.get('/api/notes', async (_req, res, next) => {
  try {
    const notes = await listNotes();
    res.json(notes);
  } catch (e) {
    next(e);
  }
});

app.post('/api/notes', async (req, res, next) => {
  try {
    const { title, body } = req.body || {};
    if (!title || !body) {
      return res.status(400).json({ error: 'title and body are required' });
    }
    const note = await createNote(title, body);
    res.status(201).json(note);
  } catch (e) {
    // If DB not ready, return 503 rather than crashing
    if (e.message === 'DB not ready') {
      return res.status(503).json({ error: 'Database not ready' });
    }
    next(e);
  }
});

// --- error handler ---
app.use((err, _req, res, _next) => {
  const status = 500;
  res.status(status).json({ error: err?.message || 'Internal Server Error' });
});

// --- start ---
export default app;

// Only start server if not in test mode
if (import.meta.url === `file://${process.argv[1]}`) {
  async function main() {
    await initDb(); // don't block the server if DB fails; health reports db:false
    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  }

  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
