import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rates = [
    // 美国 (USA)
    { country: 'USA', method: 'Sea Freight DDP', pricePerKg: 1.5, volumetricRatio: 6000, estimatedDays: '30-35 Days' },
    { country: 'USA', method: 'Air Express DDP', pricePerKg: 7.5, volumetricRatio: 5000, estimatedDays: '7-10 Days' },

    // 迪拜 (Dubai)
    { country: 'Dubai', method: 'Sea Freight DDP', pricePerKg: 1.3, volumetricRatio: 6000, estimatedDays: '25-30 Days' },
    { country: 'Dubai', method: 'Air Express DDP', pricePerKg: 6.5, volumetricRatio: 5000, estimatedDays: '5-8 Days' },

    // 台湾 (Taiwan)
    { country: 'Taiwan', method: 'Sea Freight DDP', pricePerKg: 0.6, volumetricRatio: 6000, estimatedDays: '5-7 Days' },
    { country: 'Taiwan', method: 'Air Express DDP', pricePerKg: 2.5, volumetricRatio: 5000, estimatedDays: '2-4 Days' },

    // 日本 (Japan)
    { country: 'Japan', method: 'Sea Freight DDP', pricePerKg: 0.9, volumetricRatio: 6000, estimatedDays: '10-15 Days' },
    { country: 'Japan', method: 'Air Express DDP', pricePerKg: 4.0, volumetricRatio: 5000, estimatedDays: '3-5 Days' }
  ];

  // 清除旧的运费数据，只保留最新的这四个国家
  await prisma.shippingRate.deleteMany({});

  let count = 0;
  for (const rate of rates) {
    await prisma.shippingRate.create({
      data: rate
    });
    count++;
  }
  
  return NextResponse.json({ success: true, message: "Cleared old rates and seeded the 4 target destinations", count });
}
