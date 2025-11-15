import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * Middleware to check if user is authenticated
 */
export async function requireAuth(req) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return {
      error: 'Unauthorized',
      status: 401,
    }
  }

  return { session }
}

/**
 * Middleware to check if user has required role
 */
export async function requireRole(req, allowedRoles = []) {
  const { session, error } = await requireAuth(req)

  if (error) {
    return { error, status: 401 }
  }

  if (!allowedRoles.includes(session.user.role)) {
    return {
      error: 'Forbidden - Insufficient permissions',
      status: 403,
    }
  }

  return { session }
}

/**
 * Check if user is admin
 */
export async function requireAdmin(req) {
  return requireRole(req, ['admin'])
}

/**
 * Check if user is doctor
 */
export async function requireDoctor(req) {
  return requireRole(req, ['doctor', 'admin'])
}

/**
 * Check if user is patient
 */
export async function requirePatient(req) {
  return requireRole(req, ['patient', 'admin'])
}
