const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.product.deleteMany({});
  console.log('SUCCESS_DELETED: ' + result.count);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
