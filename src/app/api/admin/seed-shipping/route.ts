import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rates = [
    { country: 'USA', method: 'Sea Freight DDP', pricePerKg: 1.5, volumetricRatio: 6000, estimatedDays: '30-35 Days' },
    { country: 'USA', method: 'Air Express DDP', pricePerKg: 7.5, volumetricRatio: 5000, estimatedDays: '7-10 Days' },
    { country: 'UK', method: 'Sea Freight DDP', pricePerKg: 1.8, volumetricRatio: 6000, estimatedDays: '35-40 Days' },
    { country: 'UK', method: 'Air Express DDP', pricePerKg: 7.0, volumetricRatio: 5000, estimatedDays: '6-9 Days' },
    { country: 'Europe (EU)', method: 'Sea Freight DDP', pricePerKg: 1.9, volumetricRatio: 6000, estimatedDays: '40-45 Days' },
    { country: 'Europe (EU)', method: 'Railway DDP', pricePerKg: 2.5, volumetricRatio: 6000, estimatedDays: '25-30 Days' },
    { country: 'Australia', method: 'Sea Freight DDP', pricePerKg: 1.6, volumetricRatio: 6000, estimatedDays: '20-25 Days' }
  ];

  let count = 0;
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
    count++;
  }
  return NextResponse.json({ success: true, count });
}
