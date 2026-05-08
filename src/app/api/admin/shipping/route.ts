import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rates = await prisma.shippingRate.findMany({
      where: { isActive: true },
      orderBy: [
        { country: 'asc' },
        { method: 'asc' }
      ]
    });
    return NextResponse.json({ success: true, data: rates });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
