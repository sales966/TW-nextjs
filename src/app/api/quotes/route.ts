import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { company, companyName, quantity, message, firstName, lastName, email, phone } = body;

    if (!email || !firstName) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const contactName = `${firstName} ${lastName}`.trim();
    
    // Parse quantity string like "5,000 - 10,000" into an integer. Default to 500.
    const qtyMatch = quantity?.match(/\d+/);
    const qtyInt = qtyMatch ? parseInt(qtyMatch[0], 10) * (quantity.includes('k') || quantity.includes('K') ? 1000 : 1) : 500;

    // 1. Create or update the Lead
    const lead = await prisma.lead.upsert({
      where: { email },
      update: {
        contactName,
        companyName: companyName || null,
        phone: phone || null,
      },
      create: {
        email,
        contactName,
        companyName: companyName || null,
        phone: phone || null,
        country: "Unknown", // Required by schema
      }
    });

    // 2. Create the QuoteRequest
    const quote = await prisma.quoteRequest.create({
      data: {
        leadId: lead.id,
        boxType: "MAILER_BOX", // Default dummy required by schema
        length: 0,
        width: 0,
        height: 0,
        material: company || "未填写产品名称", // The "company" input is now used for Product Name
        printing: "待确认 (From Website Form)",
        quantity: qtyInt,
        notes: message || null,
      }
    });

    return NextResponse.json({ success: true, quoteId: quote.id });
  } catch (error: any) {
    console.error("Quote submit error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
