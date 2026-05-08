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
    const { material, size, unitWeight, cbmPer1000, cartonSize, pcsPerCarton, tiers } = body;

    if (!material || !size || !tiers || !Array.isArray(tiers) || tiers.length === 0) {
      return NextResponse.json({ success: false, error: "缺少必填字段或价格阶梯为空" }, { status: 400 });
    }

    let count = 0;
    
    // 采用 upsert 方式插入或更新阶梯，防止重复记录冲突并能兼容不支持 skipDuplicates 的适配器
    await Promise.all(
      tiers.map(async (tier: any) => {
        const quantity = parseInt(tier.quantity);
        const unitPrice = parseFloat(tier.unitPrice);
        
        if (isNaN(quantity) || isNaN(unitPrice)) return;
        
        const totalPrice = unitPrice * quantity;

        await prisma.pricingRule.upsert({
          where: {
            material_size_quantity: {
              material,
              size,
              quantity,
            }
          },
          update: {
            unitPrice,
            totalPrice,
            unitWeight,
            cbmPer1000,
            cartonSize,
            pcsPerCarton,
          },
          create: {
            material,
            size,
            quantity,
            unitPrice,
            totalPrice,
            unitWeight,
            cbmPer1000,
            cartonSize,
            pcsPerCarton,
          }
        });
        count++;
      })
    );

    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
