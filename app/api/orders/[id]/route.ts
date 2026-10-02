import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      kasir:   { select: { name: true } },
      kurir:   { select: { name: true } },
      petugas: { select: { name: true } },
      statusLogs: {
        include: { changedBy: { select: { name: true, role: true } } },
        orderBy: { changedAt: 'asc' },
      },
    }
  })
  if (!order) return NextResponse.json(
    { error: 'Order tidak ditemukan' }, { status: 404 }
  )
  return NextResponse.json(order)
}
