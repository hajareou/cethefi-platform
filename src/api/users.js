import { api } from 'boot/axios'

/**
 * Users API service
 * Contains all user-related API calls
 */

export const usersApi = {
  /**
   * Get current user profile
   * Requires authentication and profile:read permission
   */
  async getMyProfile() {
    const response = await api.get('/api/users/me')
    return response.data
  },
}

export default usersApi
