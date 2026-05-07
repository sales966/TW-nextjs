import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rules = await prisma.pricingRule.findMany({
      orderBy: [
        { material: 'asc' },
        { size: 'asc' },
        { quantity: 'asc' }
      ]
    });
    return NextResponse.json({ success: true, data: rules });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { material, size, quantity, unitPrice, totalPrice } = body;

    if (!material || !size || !quantity || !unitPrice) {
      return NextResponse.json({ success: false, error: "缺少必填字段" }, { status: 400 });
    }

    const calculatedTotal = totalPrice || (unitPrice * quantity);

    const rule = await prisma.pricingRule.create({
      data: {
        material,
        size,
        quantity: parseInt(quantity),
        unitPrice: parseFloat(unitPrice),
        totalPrice: parseFloat(calculatedTotal),
      }
    });

    return NextResponse.json({ success: true, data: rule });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: "该材质、尺寸和数量的报价规则已存在，请直接修改或删除" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
