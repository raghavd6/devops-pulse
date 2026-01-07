const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getHealth() {
  const res = await fetch(`${API_URL}/api/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function listNotes() {
  const res = await fetch(`${API_URL}/api/notes`);
  if (!res.ok) throw new Error('Failed to load notes');
  return res.json();
}

export async function createNote(title, body) {
  const res = await fetch(`${API_URL}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Failed to create note');
  return data;
}
