// src/services/githubRepo.js

const GH_API = 'https://api.github.com'

const getHeaders = () => {
  const headers = { Accept: 'application/vnd.github+json' }
  const token = import.meta.env.VITE_GITHUB_TOKEN
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

export async function listRepoDir({ owner, repo, path = '' }) {
  const url = `${GH_API}/repos/${owner}/${repo}/contents/${path}`
  const res = await fetch(url, {
    headers: getHeaders(),
  })

  if (!res.ok) {
    throw new Error(`GitHub contents failed (HTTP ${res.status})`)
  }

  return res.json()
}

export async function getRepoFileJson({ owner, repo, path }) {
  const url = `${GH_API}/repos/${owner}/${repo}/contents/${path}`
  const res = await fetch(url, {
    headers: getHeaders(),
  })

  if (!res.ok) {
    throw new Error(`GitHub file fetch failed (HTTP ${res.status})`)
  }

  const data = await res.json()
  if (!data?.content) return null

  const decoded = atob((data.content || '').replace(/\n/g, ''))
  return JSON.parse(decoded)
}

/**
 * Récupère le dernier commit pour un fichier ou dossier donné.
 */
export async function getLastCommit({ owner, repo, path }) {
  const url = `${GH_API}/repos/${owner}/${repo}/commits?path=${encodeURIComponent(path)}&per_page=1`
  const res = await fetch(url, {
    headers: getHeaders(),
  })

  if (!res.ok) {
    // Si 404 ou vide (ca peut arriver sur des dossiers vides), on ignore ou on renvoie null
    return null
  }

  const data = await res.json()
  return data[0] // le premier élément est le commit le plus récent
}
