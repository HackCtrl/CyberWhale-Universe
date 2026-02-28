import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // create admin and test user (id integers in existing DB)
  const adminPass = await bcrypt.hash('admin123', 10)
  const userPass = await bcrypt.hash('user123', 10)

  const admin = await prisma.user.findUnique({ where: { email: 'admin@cyberwhale.test' } })
  if (!admin) {
    await prisma.user.create({ data: { email: 'admin@cyberwhale.test', passwordHash: adminPass, name: 'Administrator' } })
  }

  const user = await prisma.user.findUnique({ where: { email: 'user@cyberwhale.test' } })
  if (!user) {
    await prisma.user.create({ data: { email: 'user@cyberwhale.test', passwordHash: userPass, name: 'Test User' } })
  }

  // create a sample course if missing
  let course = await prisma.course.findFirst({ where: { title: 'Intro to CTF' } })
  if (!course) {
    course = await prisma.course.create({ data: { title: 'Intro to CTF', description: 'Начальный курс по CTF и основам безопасности' } })
  }

  // create a lesson for the course if none
  const lessons = await prisma.lesson.findMany({ where: { courseId: course.id } })
  if (lessons.length === 0) {
    await prisma.lesson.create({ data: { courseId: course.id, title: 'What is a CTF?', content: 'Краткое введение в CTF' } })
  }

  console.log('Seed finished')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
