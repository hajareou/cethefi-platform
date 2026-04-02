import { api } from 'boot/axios'

/**
 * Documents API service
 * Contains all document-related API calls
 */

export const documentsApi = {
  /**
   * Get list of documents
   * Returns public documents for unauthenticated users
   * Returns all documents for authenticated users with proper permissions
   */
  async getDocuments() {
    const response = await api.get('/api/documents')
    return response.data
  },

  /**
   * Create a new document
   * Requires authentication and documents:write permission
   * @param {string} title - Document title
   */
  async createDocument(title) {
    const response = await api.post('/api/documents', { title })
    return response.data
  },
}

export default documentsApi
