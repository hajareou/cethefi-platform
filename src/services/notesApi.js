import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8091';

export async function fetchDocNote(docId) {
  const { data } = await axios.get(`${API_BASE}/api/notes/${encodeURIComponent(docId)}`);
  return data;
}

export async function saveDocNote(docId, note) {
  const { data } = await axios.put(`${API_BASE}/api/notes/${encodeURIComponent(docId)}`, {
    note,
  });
  return data;
}