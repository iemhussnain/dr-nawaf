"use client"

import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axios'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const login = async (email, password) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  const register = async (userData) => {
    try {
      const response = await axiosInstance.post('/api/auth/register', userData)
      return { success: true, message: response.data.message }
    } catch (error) {
      return { success: false, error: error.userMessage || error.message }
    }
  }

  const verifyEmail = async (token) => {
    try {
      const response = await axiosInstance.post('/api/auth/verify-email', { token })
      return { success: true, message: response.data.message }
    } catch (error) {
      return { success: false, error: error.userMessage || error.message }
    }
  }

  const forgotPassword = async (email) => {
    try {
      const response = await axiosInstance.post('/api/auth/forgot-password', { email })
      return { success: true, message: response.data.message }
    } catch (error) {
      return { success: false, error: error.userMessage || error.message }
    }
  }

  const resetPassword = async (token, password) => {
    try {
      const response = await axiosInstance.post('/api/auth/reset-password', { token, password })
      return { success: true, message: response.data.message }
    } catch (error) {
      return { success: false, error: error.userMessage || error.message }
    }
  }

  return {
    user: session?.user,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    login,
    logout,
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
  }
}
