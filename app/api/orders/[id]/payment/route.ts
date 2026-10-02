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
    const { paymentMethod, kasirId } = await req.json()

    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) {
      return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 })
    }

    // Resolve valid operator ID for StatusLog foreign key
    let resolvedOperatorId = kasirId || order.kasirId
    if (!resolvedOperatorId) {
      const fallbackUser = await prisma.user.findFirst({
        where: { role: { in: ['KASIR', 'ADMIN'] }, isActive: true },
      })
      resolvedOperatorId = fallbackUser?.id
    }

    if (!resolvedOperatorId) {
      return NextResponse.json({ error: 'Operator ID tidak valid' }, { status: 400 })
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        paymentMethod: paymentMethod === 'QRIS' ? 'QRIS' : 'TUNAI',
        paymentStatus: 'PAID',
        status: 'SELESAI',
        updatedAt: new Date(),
      },
    })

    await prisma.statusLog.create({
      data: {
        orderId: id,
        statusFrom: order.status,
        statusTo: 'SELESAI',
        changedById: resolvedOperatorId,
        notes: `Pembayaran: ${paymentMethod || 'TUNAI'} (Lunas)`,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Payment confirmation error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat memproses pembayaran' },
      { status: 500 }
    )
  }
}
