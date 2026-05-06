import { prisma } from './src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const usersToCreate = [
    {
      name: '超级管理员',
      email: 'admin1',
      password: '3543',
      role: 'ADMIN',
    },
    {
      name: '普通管理员',
      email: 'admin2',
      password: '123',
      role: 'MANAGER',
    }
  ]

  for (const user of usersToCreate) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    })

    if (existingUser) {
      console.log(`User ${user.email} already exists. Updating password...`)
      const passwordHash = await bcrypt.hash(user.password, 10)
      await prisma.user.update({
        where: { email: user.email },
        data: { passwordHash, role: user.role as any }
      })
      console.log(`Updated ${user.email}`)
      continue
    }

    const passwordHash = await bcrypt.hash(user.password, 10)
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role as any,
      },
    })
    console.log(`Created ${user.email}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
