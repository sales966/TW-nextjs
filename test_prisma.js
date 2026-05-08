const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const dataToInsert = [{
      material: "牛皮单色250克",
      size: "12.8cm*2.5cm*22cm",
      quantity: 500,
      unitPrice: 1.0,
      totalPrice: 500.0,
    }];
    const result = await prisma.pricingRule.createMany({
      data: dataToInsert,
      skipDuplicates: true,
    });
    console.log("createMany result:", result);
  } catch (e) {
    console.error("PRISMA ERROR:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
