import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: { not: 'PENGGUNA' } },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error('Fetch users error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data user' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, phone } = await req.json()

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: 'Nama, email, dan kata sandi wajib diisi' },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim().toLowerCase()
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar. Silakan gunakan email lain.' },
        { status: 409 }
      )
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashed,
        role: role || 'KASIR',
        phone: phone?.trim() || null,
        isActive: true,
      },
    })

    return NextResponse.json(
      { id: user.id, name: user.name, role: user.role },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create user error:', error)
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email sudah terdaftar. Silakan gunakan email lain.' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat membuat pengguna' },
      { status: 500 }
    )
  }
}
