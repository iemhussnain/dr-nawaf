import axios from 'axios'
import { toast } from 'sonner'

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available (from session storage or cookies)
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, config.data || '')
    }

    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📥 ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    }

    return response
  },
  (error) => {
    // Handle different error types
    let errorMessage = 'An unexpected error occurred'

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response

      switch (status) {
        case 400:
          errorMessage = data.error || 'Bad request - please check your input'
          break
        case 401:
          errorMessage = data.error || 'Unauthorized - please login again'
          // Redirect to login if needed
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            setTimeout(() => {
              window.location.href = '/login'
            }, 2000)
          }
          break
        case 403:
          errorMessage = data.error || 'Forbidden - you do not have permission'
          break
        case 404:
          errorMessage = data.error || 'Resource not found'
          break
        case 409:
          errorMessage = data.error || 'Conflict - resource already exists'
          break
        case 422:
          errorMessage = data.error || 'Validation failed'
          // If there are validation details, show them
          if (data.errors && Array.isArray(data.errors)) {
            errorMessage = data.errors.map((e) => e.message).join(', ')
          }
          break
        case 429:
          errorMessage = 'Too many requests - please try again later'
          break
        case 500:
        case 502:
        case 503:
        case 504:
          errorMessage = 'Server error - please try again later'
          break
        default:
          errorMessage = data.error || `Error ${status}: ${error.message}`
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'Network error - please check your connection'
    } else {
      // Something else happened
      errorMessage = error.message || errorMessage
    }

    // Show toast notification
    if (typeof window !== 'undefined') {
      toast.error(errorMessage)
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Response error:', {
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      })
    }

    // Attach formatted error message to error object
    error.userMessage = errorMessage

    return Promise.reject(error)
  }
)

export default axiosInstance
