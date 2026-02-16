import { defineStore } from 'pinia'

const AUTH_TOKEN_KEY = 'authToken'
const AUTH_SESSION_KEY = 'authSession'

function safeGetLocalStorage(key) {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem(key)
}

function safeSetLocalStorage(key, value) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(key, value)
}

function safeRemoveLocalStorage(key) {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(key)
}

function parseSession(raw) {
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authToken: safeGetLocalStorage(AUTH_TOKEN_KEY),
    authSession: parseSession(safeGetLocalStorage(AUTH_SESSION_KEY)),
  }),

  getters: {
    user: (state) => state.authSession?.user || { name: 'Guest' },
    isGuest: (state) => {
      if (!state.authSession) return true
      if (state.authSession.type === 'guest') return true
      return state.authSession?.user?.role === 'guest'
    },
    permissions: (state) =>
      Array.isArray(state.authSession?.permissions) ? state.authSession.permissions : [],
    hasPermission() {
      return (permission) =>
        this.permissions.includes('*') || this.permissions.includes(permission)
    },
  },

  actions: {
    hydrate() {
      this.authToken = safeGetLocalStorage(AUTH_TOKEN_KEY)
      this.authSession = parseSession(safeGetLocalStorage(AUTH_SESSION_KEY))
    },
    setSession({ token, session }) {
      this.authToken = token || null
      this.authSession = session || null

      if (token) safeSetLocalStorage(AUTH_TOKEN_KEY, token)
      else safeRemoveLocalStorage(AUTH_TOKEN_KEY)

      if (session) safeSetLocalStorage(AUTH_SESSION_KEY, JSON.stringify(session))
      else safeRemoveLocalStorage(AUTH_SESSION_KEY)
    },
    updateUser(patch = {}) {
      if (!this.authSession?.user) return

      this.authSession = {
        ...this.authSession,
        user: {
          ...this.authSession.user,
          ...patch,
        },
      }
      safeSetLocalStorage(AUTH_SESSION_KEY, JSON.stringify(this.authSession))
    },
    clearSession() {
      this.authToken = null
      this.authSession = null
      safeRemoveLocalStorage(AUTH_TOKEN_KEY)
      safeRemoveLocalStorage(AUTH_SESSION_KEY)
    },
  },
})
