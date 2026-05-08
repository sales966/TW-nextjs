import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rates = [
    // 之前已有的
    { country: 'USA', method: 'Sea Freight DDP', pricePerKg: 1.5, volumetricRatio: 6000, estimatedDays: '30-35 Days' },
    { country: 'USA', method: 'Air Express DDP', pricePerKg: 7.5, volumetricRatio: 5000, estimatedDays: '7-10 Days' },
    { country: 'UK', method: 'Sea Freight DDP', pricePerKg: 1.8, volumetricRatio: 6000, estimatedDays: '35-40 Days' },
    { country: 'UK', method: 'Air Express DDP', pricePerKg: 7.0, volumetricRatio: 5000, estimatedDays: '6-9 Days' },
    { country: 'Europe (EU)', method: 'Sea Freight DDP', pricePerKg: 1.9, volumetricRatio: 6000, estimatedDays: '40-45 Days' },
    { country: 'Europe (EU)', method: 'Railway DDP', pricePerKg: 2.5, volumetricRatio: 6000, estimatedDays: '25-30 Days' },
    { country: 'Australia', method: 'Sea Freight DDP', pricePerKg: 1.6, volumetricRatio: 6000, estimatedDays: '20-25 Days' },
    { country: 'Australia', method: 'Air Express DDP', pricePerKg: 7.8, volumetricRatio: 5000, estimatedDays: '7-10 Days' },

    // 新增：北美 & 拉美
    { country: 'Canada', method: 'Sea Freight DDP', pricePerKg: 1.8, volumetricRatio: 6000, estimatedDays: '30-40 Days' },
    { country: 'Canada', method: 'Air Express DDP', pricePerKg: 8.5, volumetricRatio: 5000, estimatedDays: '7-12 Days' },
    { country: 'Mexico', method: 'Sea Freight DDP', pricePerKg: 2.2, volumetricRatio: 6000, estimatedDays: '35-45 Days' },
    { country: 'Mexico', method: 'Air Express DDP', pricePerKg: 9.5, volumetricRatio: 5000, estimatedDays: '8-12 Days' },

    // 新增：大洋洲
    { country: 'New Zealand', method: 'Sea Freight DDP', pricePerKg: 1.8, volumetricRatio: 6000, estimatedDays: '25-35 Days' },
    { country: 'New Zealand', method: 'Air Express DDP', pricePerKg: 8.0, volumetricRatio: 5000, estimatedDays: '7-10 Days' },

    // 新增：中东
    { country: 'UAE / Middle East', method: 'Sea Freight DDP', pricePerKg: 1.3, volumetricRatio: 6000, estimatedDays: '25-30 Days' },
    { country: 'UAE / Middle East', method: 'Air Express DDP', pricePerKg: 6.5, volumetricRatio: 5000, estimatedDays: '5-8 Days' },

    // 新增：亚洲近洋
    { country: 'Singapore', method: 'Sea Freight DDP', pricePerKg: 0.8, volumetricRatio: 6000, estimatedDays: '10-15 Days' },
    { country: 'Singapore', method: 'Air Express DDP', pricePerKg: 4.5, volumetricRatio: 5000, estimatedDays: '3-5 Days' },
    { country: 'Japan', method: 'Sea Freight DDP', pricePerKg: 0.9, volumetricRatio: 6000, estimatedDays: '10-15 Days' },
    { country: 'Japan', method: 'Air Express DDP', pricePerKg: 4.0, volumetricRatio: 5000, estimatedDays: '3-5 Days' },
    { country: 'South Korea', method: 'Sea Freight DDP', pricePerKg: 0.85, volumetricRatio: 6000, estimatedDays: '10-15 Days' },
    { country: 'South Korea', method: 'Air Express DDP', pricePerKg: 3.8, volumetricRatio: 5000, estimatedDays: '3-5 Days' },
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
      update: rate,
      create: rate
    });
    count++;
  }
  return NextResponse.json({ success: true, count });
}
