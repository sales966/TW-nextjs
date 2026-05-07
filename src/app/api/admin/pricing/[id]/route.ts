import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    await prisma.pricingRule.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const body = await req.json();
    const { unitPrice, quantity } = body;
    
    if (!unitPrice) {
      return NextResponse.json({ success: false, error: "缺少必填参数" }, { status: 400 });
    }

    const updatedRule = await prisma.pricingRule.update({
      where: { id },
      data: {
        unitPrice: parseFloat(unitPrice),
        totalPrice: parseFloat(unitPrice) * parseInt(quantity),
      }
    });

    return NextResponse.json({ success: true, data: updatedRule });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
