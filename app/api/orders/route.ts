import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const date = searchParams.get('date')

    const orders = await prisma.order.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(date
          ? {
              createdAt: {
                gte: new Date(date + 'T00:00:00.000Z'),
                lte: new Date(date + 'T23:59:59.999Z'),
              },
            }
          : {}),
      },
      include: {
        kasir: { select: { name: true } },
        kurir: { select: { name: true } },
        petugas: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Fetch orders error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data pesanan' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.customerName?.trim() || !body.customerPhone?.trim()) {
      return NextResponse.json(
        { error: 'Nama dan nomor telepon pelanggan wajib diisi' },
        { status: 400 }
      )
    }

    // Daily sequence generator format: LK-YYYYMMDD-XXX
    const now = new Date()
    const todayDateStr = now.toISOString().slice(0, 10)
    const codeDatePart = todayDateStr.replace(/-/g, '')
    const startOfDay = new Date(`${todayDateStr}T00:00:00.000Z`)
    const endOfDay = new Date(`${todayDateStr}T23:59:59.999Z`)

    const countToday = await prisma.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    })

    let sequence = countToday + 1
    let orderCode = `LK-${codeDatePart}-${String(sequence).padStart(3, '0')}`

    // Check collision and increment if necessary
    let codeExists = await prisma.order.findUnique({ where: { orderCode } })
    while (codeExists) {
      sequence += 1
      orderCode = `LK-${codeDatePart}-${String(sequence).padStart(3, '0')}`
      codeExists = await prisma.order.findUnique({ where: { orderCode } })
    }

    // Resolve kasir ID
    let kasirId = body.kasirId
    if (!kasirId) {
      const kasirUser = await prisma.user.findFirst({
        where: { role: { in: ['KASIR', 'ADMIN'] }, isActive: true },
      })
      kasirId = kasirUser?.id
    }

    if (!kasirId) {
      return NextResponse.json(
        { error: 'Petugas kasir tidak ditemukan' },
        { status: 400 }
      )
    }

    const order = await prisma.order.create({
      data: {
        orderCode,
        customerName: body.customerName.trim(),
        customerPhone: body.customerPhone.trim(),
        pickupAddress: body.pickupAddress?.trim() || 'Drop-off di outlet',
        deliveryAddress: body.deliveryAddress?.trim() || 'Ambil di outlet',
        serviceType: body.serviceType ?? 'CKL',
        serviceSpeed: body.serviceSpeed ?? 'REGULER',
        notes: body.notes?.trim() || null,
        pocketChecked: body.pocketChecked ?? false,
        bagReturned: body.bagReturned ?? false,
        scheduledPickupAt: body.scheduledPickupAt
          ? new Date(body.scheduledPickupAt)
          : null,
        kasirId,
        status: 'MENUNGGU_PENJEMPUTAN',
      },
    })

    await prisma.statusLog.create({
      data: {
        orderId: order.id,
        statusTo: 'MENUNGGU_PENJEMPUTAN',
        changedById: kasirId,
        notes: 'Order baru dibuat oleh kasir',
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat membuat pesanan' },
      { status: 500 }
    )
  }
}
