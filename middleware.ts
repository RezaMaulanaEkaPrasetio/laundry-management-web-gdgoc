import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

const roleRoutes: Record<string, string[]> = {
  ADMIN:        ['/admin'],
  KASIR:        ['/kasir'],
  PETUGAS_CUCI: ['/petugas'],
  KURIR:        ['/kurir'],
  PENGGUNA:     ['/lacak'],
}

const publicRoutes = ['/register', '/lacak', '/syarat']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/api/auth')) return NextResponse.next()
  if (pathname.startsWith('/api/orders/track')) return NextResponse.next()

  const token = req.cookies.get('auth_token')?.value

  // If user visits /login and already has a valid token, redirect to their role dashboard
  if (pathname === '/login') {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        const role = payload.role as string
        const ownDashboard = roleRoutes[role]?.[0] ?? '/kasir'
        return NextResponse.redirect(new URL(ownDashboard, req.url))
      } catch {
        // Token invalid, proceed to login page
        return NextResponse.next()
      }
    }
    return NextResponse.next()
  }

  if (publicRoutes.some(r => pathname.startsWith(r))) return NextResponse.next()

  if (!token) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const role = payload.role as string

    // API routes are accessible for authenticated users
    if (pathname.startsWith('/api')) {
      // Protect admin-only API routes
      if (pathname.startsWith('/api/users') && role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      return NextResponse.next()
    }

    const allowedPaths = roleRoutes[role] ?? []
    const isAllowed = allowedPaths.some(p => pathname.startsWith(p))

    if (!isAllowed && pathname !== '/') {
      const ownDashboard = allowedPaths[0] ?? '/login'
      return NextResponse.redirect(new URL(ownDashboard, req.url))
    }

    return NextResponse.next()
  } catch {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    const response = NextResponse.redirect(new URL('/login', req.url))
    response.cookies.delete('auth_token')
    return response
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
