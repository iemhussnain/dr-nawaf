import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
                       req.nextUrl.pathname.startsWith('/register')
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')

    // Redirect to login if accessing admin page without auth
    if (isAdminPage && !isAuth) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Redirect to dashboard if accessing admin page without admin role
    if (isAdminPage && isAuth && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Redirect to homepage if accessing auth pages while authenticated
    if (isAuthPage && isAuth) {
      if (token.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true, // We handle authorization in the middleware function
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/login', '/register']
}
