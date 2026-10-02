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
    const { weightKg, petugasId } = await req.json()

    const numWeight = Number(weightKg)
    if (isNaN(numWeight) || numWeight < 0.1) {
      return NextResponse.json({ error: 'Berat minimal 0.1 kg' }, { status: 400 })
    }

    if (numWeight > 200) {
      return NextResponse.json({ error: 'Berat maksimal 200 kg per penimbangan' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) {
      return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 })
    }

    // Resolve petugas ID fallback
    let resolvedPetugasId = petugasId || order.petugasId
    if (!resolvedPetugasId) {
      const fallbackUser = await prisma.user.findFirst({
        where: { role: { in: ['PETUGAS_CUCI', 'ADMIN'] }, isActive: true },
      })
      resolvedPetugasId = fallbackUser?.id
    }

    if (!resolvedPetugasId) {
      return NextResponse.json({ error: 'Petugas workshop tidak valid' }, { status: 400 })
    }

    const price = await prisma.servicePrice.findUnique({
      where: {
        serviceType_serviceSpeed: {
          serviceType: order.serviceType,
          serviceSpeed: order.serviceSpeed,
        },
      },
    })

    const pricePerKg = Number(price?.pricePerKg ?? 7000)
    const totalAmount = Math.round(numWeight * pricePerKg)

    const updated = await prisma.order.update({
      where: { id },
      data: {
        weightKg: numWeight,
        pricePerKg,
        totalAmount,
        petugasId: resolvedPetugasId,
        status: 'SEDANG_DICUCI',
        updatedAt: new Date(),
      },
    })

    await prisma.statusLog.create({
      data: {
        orderId: id,
        statusFrom: order.status,
        statusTo: 'SEDANG_DICUCI',
        changedById: resolvedPetugasId,
        notes: `Timbang: ${numWeight.toFixed(1)} kg, Total: Rp ${totalAmount.toLocaleString('id-ID')}`,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Weight update error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat memperbarui berat pesanan' },
      { status: 500 }
    )
  }
}
