import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET() {
  try {
    const prices = await prisma.servicePrice.findMany({
      orderBy: [{ serviceType: 'asc' }, { serviceSpeed: 'asc' }],
    })
    return NextResponse.json(prices)
  } catch (error) {
    console.error('Fetch prices error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data tarif' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { serviceType, serviceSpeed, pricePerKg, updatedById } = await req.json()

    if (!serviceType || !serviceSpeed || pricePerKg === undefined) {
      return NextResponse.json(
        { error: 'Parameter layanan dan harga wajib diisi' },
        { status: 400 }
      )
    }

    let resolvedAdminId = updatedById
    if (!resolvedAdminId) {
      const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN', isActive: true },
      })
      resolvedAdminId = adminUser?.id
    }

    if (!resolvedAdminId) {
      return NextResponse.json({ error: 'Admin ID tidak valid' }, { status: 400 })
    }

    const updated = await prisma.servicePrice.upsert({
      where: {
        serviceType_serviceSpeed: { serviceType, serviceSpeed },
      },
      update: {
        pricePerKg: Number(pricePerKg),
        updatedById: resolvedAdminId,
      },
      create: {
        serviceType,
        serviceSpeed,
        pricePerKg: Number(pricePerKg),
        updatedById: resolvedAdminId,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update price error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat memperbarui tarif' },
      { status: 500 }
    )
  }
}
