import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

async function testAuth() {
  const connectionString = process.env.DATABASE_URL
  console.log('DB URL:', connectionString?.split('@')[1]) // Log only the host part for safety

  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  const email = 'admin@lms.com'
  const password = 'admin123'

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      console.log('User not found in DB')
      return
    }

    console.log('User found:', user.email)
    const match = await bcrypt.compare(password, user.passwordHash)
    console.log('Password match:', match)
  } catch (err) {
    console.error('Error during test:', err)
  } finally {
    await pool.end()
  }
}

testAuth()
