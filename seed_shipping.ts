import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const rates = [
    { country: 'USA', method: 'Sea Freight DDP', pricePerKg: 1.5, volumetricRatio: 6000, estimatedDays: '30-35 Days' },
    { country: 'USA', method: 'Air Express DDP', pricePerKg: 7.5, volumetricRatio: 5000, estimatedDays: '7-10 Days' },
    { country: 'UK', method: 'Sea Freight DDP', pricePerKg: 1.8, volumetricRatio: 6000, estimatedDays: '35-40 Days' },
    { country: 'UK', method: 'Air Express DDP', pricePerKg: 7.0, volumetricRatio: 5000, estimatedDays: '6-9 Days' },
    { country: 'Europe (EU)', method: 'Sea Freight DDP', pricePerKg: 1.9, volumetricRatio: 6000, estimatedDays: '40-45 Days' },
    { country: 'Europe (EU)', method: 'Railway DDP', pricePerKg: 2.5, volumetricRatio: 6000, estimatedDays: '25-30 Days' },
    { country: 'Australia', method: 'Sea Freight DDP', pricePerKg: 1.6, volumetricRatio: 6000, estimatedDays: '20-25 Days' }
  ];

  for (const rate of rates) {
    await prisma.shippingRate.upsert({
      where: {
        country_method: {
          country: rate.country,
          method: rate.method
        }
      },
      update: {},
      create: rate
    });
    console.log(`Seeded: ${rate.country} - ${rate.method}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
