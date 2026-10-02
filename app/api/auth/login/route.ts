import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// PrismaClient singleton for Next.js to prevent connection pool exhaustion
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Redirect per role setelah login
const roleRedirect: Record<string, string> = {
  ADMIN: '/admin',
  KASIR: '/kasir',
  PETUGAS_CUCI: '/petugas',
  KURIR: '/kurir',
  PENGGUNA: '/lacak',
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET || 'laundryku-secret-2025-ganti-ini',
      { expiresIn: '8h' }
    )

    const response = NextResponse.json({
      success: true,
      redirect: roleRedirect[user.role] ?? '/kasir',
      user: { id: user.id, name: user.name, role: user.role },
    })

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 })
  }
}
