import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // ═══ Seed Users ═══
  const users = [
    { name: 'Budi Admin',      email: 'admin@laundryku.com',     password: 'Admin123!',     role: 'ADMIN' },
    { name: 'Siti Kasir',      email: 'kasir@laundryku.com',     password: 'Kasir123!',     role: 'KASIR' },
    { name: 'Joko Petugas',    email: 'petugas@laundryku.com',   password: 'Petugas123!',   role: 'PETUGAS_CUCI' },
    { name: 'Andi Kurir',      email: 'kurir@laundryku.com',     password: 'Kurir123!',     role: 'KURIR' },
    { name: 'Rina Pelanggan',  email: 'pelanggan@laundryku.com', password: 'Pelanggan123!', role: 'PENGGUNA' },
  ]

  for (const user of users) {
    const hashed = await bcrypt.hash(user.password, 10)
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: hashed,
        role: user.role as any,
      },
    })
    console.log(`✓ ${user.role}: ${user.email}`)
  }

  // ═══ Seed Service Prices ═══
  const prices = [
    { serviceType: 'CKL', serviceSpeed: 'REGULER', pricePerKg: 7000 },
    { serviceType: 'CKL', serviceSpeed: 'EXPRESS', pricePerKg: 10500 },
    { serviceType: 'CKL', serviceSpeed: 'KILAT',   pricePerKg: 14000 },
    { serviceType: 'CKG', serviceSpeed: 'REGULER', pricePerKg: 10000 },
    { serviceType: 'CKG', serviceSpeed: 'EXPRESS', pricePerKg: 15000 },
    { serviceType: 'CKG', serviceSpeed: 'KILAT',   pricePerKg: 20000 },
  ]

  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@laundryku.com' } })

  for (const price of prices) {
    await prisma.servicePrice.upsert({
      where: {
        serviceType_serviceSpeed: {
          serviceType: price.serviceType as any,
          serviceSpeed: price.serviceSpeed as any,
        }
      },
      update: { pricePerKg: price.pricePerKg },
      create: {
        serviceType: price.serviceType as any,
        serviceSpeed: price.serviceSpeed as any,
        pricePerKg: price.pricePerKg,
        updatedById: adminUser!.id,
      }
    })
    console.log(`✓ Harga ${price.serviceType} ${price.serviceSpeed}: Rp ${price.pricePerKg}/kg`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
