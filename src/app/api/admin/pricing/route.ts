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
    const { material, size, tiers } = body;

    if (!material || !size || !tiers || !Array.isArray(tiers) || tiers.length === 0) {
      return NextResponse.json({ success: false, error: "缺少必填字段或价格阶梯为空" }, { status: 400 });
    }

    const dataToInsert = tiers.map((tier: any) => ({
      material,
      size,
      quantity: parseInt(tier.quantity),
      unitPrice: parseFloat(tier.unitPrice),
      totalPrice: parseFloat(tier.unitPrice) * parseInt(tier.quantity),
    }));

    const result = await prisma.pricingRule.createMany({
      data: dataToInsert,
      skipDuplicates: true, // 避免因为同一阶梯已存在而报错，直接跳过重复项
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
