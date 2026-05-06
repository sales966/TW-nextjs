import { config } from 'dotenv';
config();
process.env.DATABASE_URL = "postgres://postgres:postgres@127.0.0.1:5434/postgres?schema=public";
import { prisma } from './src/lib/prisma';

async function main() {
  const result = await prisma.product.deleteMany({});
  console.log('SUCCESS_DELETED: ' + result.count);
}
main().catch(console.error).finally(() => process.exit(0));
