import { api } from 'boot/axios'

/**
 * Authentication API service
 * Contains all authentication-related API calls
 */

export const authApi = {
  /**
   * Get authentication configuration from backend
   * Returns GitHub OAuth settings and redirect URLs
   */
  async getConfig() {
    const response = await api.get('/api/auth/config')
    return response.data
  },

  /**
   * Create a guest session
   * @param {string} name - Guest user's display name
   */
  async loginAsGuest(name = 'Guest') {
    const response = await api.post('/api/auth/guest', { name })
    return response.data
  },

  /**
   * Start GitHub OAuth flow
   * Redirects to GitHub authorization page
   * @param {string} frontendRedirectUrl - URL to redirect after successful auth
   */
  startGithubLogin(frontendRedirectUrl) {
    // const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8091'
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://192.168.196.89:8091'
    const url = `${baseUrl}/api/auth/github/start?frontendRedirectUrl=${encodeURIComponent(frontendRedirectUrl)}`
    window.location.href = url
  },

  /**
   * Get current user session information
   * Requires valid auth token in localStorage
   */
  async getCurrentUser() {
    const response = await api.get('/api/auth/me')
    return response.data
  },

  /**
   * Get user permissions
   * Requires valid auth token
   */
  async getPermissions() {
    const response = await api.get('/api/auth/permissions')
    return response.data
  },

  /**
   * Logout current user
   * Revokes the session token on backend
   */
  async logout() {
    const response = await api.post('/api/auth/logout')
    // Clear local storage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    return response.data
  },

  /**
   * Save authentication data to localStorage
   * @param {object} authData - Contains token, user, permissions, expiresAt
   */
  saveAuthData(authData) {
    if (authData.token) {
      localStorage.setItem('auth_token', authData.token)
    }
    if (authData.user) {
      localStorage.setItem('user', JSON.stringify(authData.user))
    }
    if (authData.permissions) {
      localStorage.setItem('permissions', JSON.stringify(authData.permissions))
    }
    if (authData.expiresAt) {
      localStorage.setItem('token_expires_at', authData.expiresAt)
    }
  },

  /**
   * Get saved authentication data from localStorage
   */
  getSavedAuthData() {
    const token = localStorage.getItem('auth_token')
    const userStr = localStorage.getItem('user')
    const permissionsStr = localStorage.getItem('permissions')
    const expiresAt = localStorage.getItem('token_expires_at')

    return {
      token,
      user: userStr ? JSON.parse(userStr) : null,
      permissions: permissionsStr ? JSON.parse(permissionsStr) : [],
      expiresAt,
      isAuthenticated: !!token,
    }
  },

  /**
   * Check if current token is expired
   */
  isTokenExpired() {
    const expiresAt = localStorage.getItem('token_expires_at')
    if (!expiresAt) return true
    return new Date(expiresAt) < new Date()
  },
}

export default authApi
