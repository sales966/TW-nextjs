import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInquiryNumber } from "@/lib/utils";
import { sendInquiryNotification, sendCustomerConfirmation } from "@/lib/email";

/**
 * POST /api/inquiry — 提交询价
 * 核心接口：客户填写表单后调用，创建 Inquiry 记录
 * 后续会触发邮件通知（销售团队 + 客户确认）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 基本验证
    if (!body.contactName?.trim()) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }
    if (!body.contactEmail?.trim()) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }
    if (!body.country?.trim()) {
      return NextResponse.json({ success: false, error: "Country is required" }, { status: 400 });
    }

    // 生成询价编号
    const inquiryNumber = generateInquiryNumber();

    // 创建询价记录
    const inquiry = await prisma.inquiry.create({
      data: {
        inquiryNumber,
        contactName: body.contactName.trim(),
        contactEmail: body.contactEmail.trim().toLowerCase(),
        company: body.company?.trim() || null,
        country: body.country.trim(),
        phone: body.phone?.trim() || null,
        whatsapp: body.whatsapp?.trim() || null,
        lineId: body.lineId?.trim() || null,
        wechatId: body.wechatId?.trim() || null,
        preferredChannel: body.preferredChannel || "EMAIL",
        inquiryType: body.inquiryType || "REQUEST_QUOTE",
        boxCategory: body.boxCategory || null,
        length: body.length || null,
        width: body.width || null,
        height: body.height || null,
        material: body.material || null,
        printing: body.printing || null,
        finishes: body.finishes || [],
        quantity: body.quantity || null,
        timeline: body.timeline || null,
        notes: body.notes?.trim() || null,
        status: "NEW",
      },
    });

    // 发送邮件通知 (不会阻塞响应，使用 .catch 捕获异常)
    sendInquiryNotification(inquiry).catch(console.error);
    sendCustomerConfirmation(inquiry).catch(console.error);
    
    console.log(`📧 新询价已创建: ${inquiryNumber} — 来自 ${body.contactName} (${body.contactEmail})`);

    return NextResponse.json({
      success: true,
      inquiryNumber: inquiry.inquiryNumber,
      message: "Thank you! We'll get back to you within 24 hours.",
    });
  } catch (error) {
    console.error("❌ 创建询价失败:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/inquiry?number=INQ-xxx — 查询询价状态
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const number = searchParams.get("number");

    if (!number) {
      return NextResponse.json({ success: false, error: "Inquiry number is required" }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.findUnique({
      where: { inquiryNumber: number },
      select: {
        inquiryNumber: true,
        status: true,
        inquiryType: true,
        createdAt: true,
      },
    });

    if (!inquiry) {
      return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error("❌ 查询询价失败:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
