const API = import.meta.env.VITE_AUTH_API_BASE_URL

function getToken() {
  return localStorage.getItem('authToken')
}

function authHeaders() {
  const token = getToken()
  if (!token) return null

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

async function parseError(res, fallbackMessage) {
  const payload = await res.json().catch(() => ({}))
  return payload?.message || fallbackMessage
}

export async function loadUsers() {
  if (!API) throw new Error('VITE_AUTH_API_BASE_URL is not configured')

  const headers = authHeaders()
  if (!headers) throw new Error('You must be logged in to manage users')

  const res = await fetch(`${API}/api/users`, {
    method: 'GET',
    headers,
  })

  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to load users'))
  }

  const data = await res.json()
  return Array.isArray(data?.users) ? data.users : []
}

export async function saveUsers(users) {
  if (!API) throw new Error('VITE_AUTH_API_BASE_URL is not configured')

  const headers = authHeaders()
  if (!headers) throw new Error('You must be logged in to manage users')

  const res = await fetch(`${API}/api/users`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ users }),
  })

  if (!res.ok) {
    throw new Error(await parseError(res, 'Failed to save users'))
  }

  const data = await res.json()
  return Array.isArray(data?.users) ? data.users : []
}
