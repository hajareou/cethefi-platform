import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Create axios instance with default configuration
const api = axios.create({
  // baseURL: import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:8091',
  baseURL: import.meta.env.VITE_AUTH_API_BASE_URL || 'http://192.168.196.89:8091',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Allow sending cookies and auth headers
})

// Request interceptor - runs before every API request
api.interceptors.request.use(
  (config) => {
    // Get auth token from localStorage
    const token = localStorage.getItem('auth_token')

    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log request in development mode (helpful for debugging)
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data)
    }

    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  },
)

// Response interceptor - runs after every API response
api.interceptors.response.use(
  (response) => {
    // Log response in development mode
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, response.data)
    }
    return response
  },
  (error) => {
    // Handle common error cases
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const message = error.response.data?.message || error.message

      console.error(`[API Error ${status}]`, message)

      // Handle 401 Unauthorized - token expired or invalid
      if (status === 401) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        // You can redirect to login page here if needed
        // router.push('/login')
      }

      // Handle 403 Forbidden - insufficient permissions
      if (status === 403) {
        console.error('[Permission Denied]', message)
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('[Network Error] Backend server is not responding')
      console.error('Make sure the backend is running at:', import.meta.env.VITE_AUTH_API_BASE_URL)
    } else {
      // Something else happened
      console.error('[API Error]', error.message)
    }

    return Promise.reject(error)
  },
)

export default boot(({ app }) => {
  // Make axios available globally in the app
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

// Export the API instance for direct import in components
export { api }
