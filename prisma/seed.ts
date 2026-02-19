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
  const commonPassword = await hash('admin123', 12)

  // 1. Create Users
  console.log('Seeding users...')

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.com' },
    update: {},
    create: {
      email: 'admin@lms.com',
      name: 'Super Admin',
      passwordHash: commonPassword,
      role: UserRole.ADMIN,
    },
  })

  // Teachers
  const teacher1 = await prisma.user.upsert({
    where: { email: 'ivanov@lms.com' },
    update: {},
    create: {
      email: 'ivanov@lms.com',
      name: 'Иван Иванов',
      passwordHash: commonPassword,
      role: UserRole.TEACHER,
    },
  })

  const teacher2 = await prisma.user.upsert({
    where: { email: 'petrov@lms.com' },
    update: {},
    create: {
      email: 'petrov@lms.com',
      name: 'Петр Петров',
      passwordHash: commonPassword,
      role: UserRole.TEACHER,
    },
  })

  // Students
  const studentEmails = ['student1@lms.com', 'student2@lms.com', 'student3@lms.com']
  const students = []
  for (const email of studentEmails) {
    const s = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: `Студент ${email.split('@')[0]}`,
        passwordHash: commonPassword,
        role: UserRole.STUDENT,
      },
    })
    students.push(s)
  }

  // 2. Create Groups
  console.log('Seeding groups...')
  const group1 = await prisma.group.upsert({
    where: { id: 'group-frontend' },
    update: {},
    create: {
      id: 'group-frontend',
      name: 'Фронтенд Разработка',
      description: 'Изучение React, Next.js и современных инструментов',
      teacherId: teacher1.id,
    },
  })

  const group2 = await prisma.group.upsert({
    where: { id: 'group-backend' },
    update: {},
    create: {
      id: 'group-backend',
      name: 'Бэкенд Разработка',
      description: 'Изучение Node.js, PostgreSQL и Prisma',
      teacherId: teacher2.id,
    },
  })

  // 3. Create Group Memberships
  console.log('Seeding memberships...')
  await prisma.groupMember.upsert({
    where: { userId_groupId: { userId: students[0].id, groupId: group1.id } },
    update: {},
    create: { userId: students[0].id, groupId: group1.id },
  })
  await prisma.groupMember.upsert({
    where: { userId_groupId: { userId: students[1].id, groupId: group1.id } },
    update: {},
    create: { userId: students[1].id, groupId: group1.id },
  })
  await prisma.groupMember.upsert({
    where: { userId_groupId: { userId: students[1].id, groupId: group2.id } },
    update: {},
    create: { userId: students[1].id, groupId: group2.id },
  })
  await prisma.groupMember.upsert({
    where: { userId_groupId: { userId: students[2].id, groupId: group2.id } },
    update: {},
    create: { userId: students[2].id, groupId: group2.id },
  })

  // 4. Create Courses
  console.log('Seeding courses...')
  const course1 = await prisma.course.upsert({
    where: { id: 'course-react' },
    update: {},
    create: {
      id: 'course-react',
      title: 'Основы React',
      description: 'Курс по основам React.js',
      groupId: group1.id,
    },
  })

  const course2 = await prisma.course.upsert({
    where: { id: 'course-node' },
    update: {},
    create: {
      id: 'course-node',
      title: 'Node.js для начинающих',
      description: 'Серверная разработка на JavaScript',
      groupId: group2.id,
    },
  })

  // 5. Create Modules
  console.log('Seeding modules...')
  const module1 = await prisma.module.upsert({
    where: { id: 'module-react-intro' },
    update: {},
    create: {
      id: 'module-react-intro',
      title: 'Введение в React',
      courseId: course1.id,
      order: 1,
    },
  })

  const module2 = await prisma.module.upsert({
    where: { id: 'module-node-express' },
    update: {},
    create: {
      id: 'module-node-express',
      title: 'Express.js основы',
      courseId: course2.id,
      order: 1,
    },
  })

  // 6. Create Materials
  console.log('Seeding materials...')
  await prisma.material.upsert({
    where: { id: 'material-r1' },
    update: {},
    create: {
      id: 'material-r1',
      title: 'Что такое JSX?',
      type: 'TEXT',
      content: 'JSX - это расширение синтаксиса JavaScript...',
      moduleId: module1.id,
    },
  })

  await prisma.material.upsert({
    where: { id: 'material-n1' },
    update: {},
    create: {
      id: 'material-n1',
      title: 'Создание первого сервера',
      type: 'VIDEO',
      content: 'https://example.com/video/node-intro',
      moduleId: module2.id,
    },
  })

  // 7. System Settings
  console.log('Seeding settings...')
  await prisma.systemSetting.upsert({
    where: { key: 'ALLOW_REGISTRATION' },
    update: {},
    create: {
      key: 'ALLOW_REGISTRATION',
      value: 'true',
      description: 'Разрешить самостоятельную регистрацию пользователей',
    },
  })

  console.log('Seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })
