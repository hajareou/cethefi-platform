import axios from 'axios'

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_AUTH_API_BASE_URL ||
  'http://localhost:8091'

export async function updateDocumentStatus(docId, status) {
  const token = localStorage.getItem('authToken')

  const { data } = await axios.put(
    `${API_BASE}/api/documents/${encodeURIComponent(docId)}/status`,
    { status },
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
      withCredentials: true,
    },
  )

  return data
}
