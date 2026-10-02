import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const normalizedCode = (code || '').trim().toUpperCase()

    const order = await prisma.order.findUnique({
      where: { orderCode: normalizedCode },
      include: {
        statusLogs: {
          orderBy: { changedAt: 'asc' },
          include: { changedBy: { select: { name: true } } },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Kode order tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      orderCode: order.orderCode,
      customerName: order.customerName,
      status: order.status,
      serviceType: order.serviceType,
      serviceSpeed: order.serviceSpeed,
      weightKg: order.weightKg,
      pricePerKg: order.pricePerKg,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      statusLogs: order.statusLogs,
    })
  } catch (error) {
    console.error('Track order error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat mencari pesanan' },
      { status: 500 }
    )
  }
}
