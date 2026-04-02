// src/services/githubRepo.js
// GitHub API calls are proxied through the backend to keep the token server-side.

const apiBase = () => import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:8091'

export async function listRepoDir({ owner, repo, path = '' }) {
  const res = await fetch(`${apiBase()}/api/github/contents/${owner}/${repo}/${path}`)
  if (!res.ok) throw new Error(`GitHub contents failed (HTTP ${res.status})`)
  return res.json()
}

export async function getRepoFileJson({ owner, repo, path }) {
  const res = await fetch(`${apiBase()}/api/github/contents/${owner}/${repo}/${path}`)
  if (!res.ok) throw new Error(`GitHub file fetch failed (HTTP ${res.status})`)
  const data = await res.json()
  if (!data?.content) return null
  const decoded = atob((data.content || '').replace(/\n/g, ''))
  return JSON.parse(decoded)
}

export async function getLastCommit({ owner, repo, path }) {
  const url = `${apiBase()}/api/github/commits?owner=${owner}&repo=${repo}&path=${encodeURIComponent(path)}`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = await res.json()
  return data[0]
}

export async function getRepoFileText({ owner, repo, path, ref = 'main' }) {
  const res = await fetch(`${apiBase()}/api/github/raw/${owner}/${repo}/${ref}/${path}`)
  if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`)
  return res.text()
}
