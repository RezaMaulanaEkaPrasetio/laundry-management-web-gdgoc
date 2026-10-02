import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status, changedById, notes } = await req.json()

    const current = await prisma.order.findUnique({ where: { id } })
    if (!current) {
      return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 })
    }

    if (current.status === 'DIBATALKAN') {
      return NextResponse.json(
        { error: 'Pesanan yang telah dibatalkan tidak dapat diubah statusnya' },
        { status: 400 }
      )
    }

    // Resolve operator ID
    let resolvedOperatorId = changedById
    if (!resolvedOperatorId) {
      const fallbackUser = await prisma.user.findFirst({
        where: { role: { in: ['KURIR', 'PETUGAS_CUCI', 'KASIR', 'ADMIN'] }, isActive: true },
      })
      resolvedOperatorId = fallbackUser?.id
    }

    if (!resolvedOperatorId) {
      return NextResponse.json({ error: 'Operator ID tidak valid' }, { status: 400 })
    }

    // If order already has this status, return without creating duplicate log
    if (current.status === status) {
      return NextResponse.json(current)
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    })

    await prisma.statusLog.create({
      data: {
        orderId: id,
        statusFrom: current.status,
        statusTo: status,
        changedById: resolvedOperatorId,
        notes: notes || null,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update status error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat memperbarui status' },
      { status: 500 }
    )
  }
}
