import { loadJson } from 'src/services/dataLoader'

export async function loadUsers() {
  const key = 'users'
  const saved = localStorage.getItem(key)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      localStorage.removeItem(key) 
    }
  }
  // fallback to default JSON
  const users = await loadJson('/data/users.json')
  localStorage.setItem(key, JSON.stringify(users))
  return users
}

export function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users))
}
