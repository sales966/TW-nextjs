import { prisma } from './src/lib/prisma.js'
import bcrypt from 'bcryptjs'


async function main() {
  const email = 'admin@dawnbags.com'
  const password = 'password123'
  
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.log(`Admin user ${email} already exists.`)
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const admin = await prisma.user.create({
    data: {
      name: '超级管理员',
      email,
      passwordHash,
      role: 'ADMIN',
    },
  })

  console.log('Created admin user:')
  console.log(`Email: ${admin.email}`)
  console.log(`Password: ${password}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
