import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, UserRole } from '@prisma/client'
import { hash } from 'bcryptjs'
import * as dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const password = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.com' },
    update: {},
    create: {
      email: 'admin@lms.com',
      name: 'Super Admin',
      passwordHash: password,
      role: UserRole.ADMIN,
    },
  })
  console.log({ admin })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
