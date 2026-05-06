import { NextResponse } from "next/server";
import { cleanProductData } from "@/lib/ai-cleaner";

export async function POST(req: Request) {
  try {
    const { rows } = await req.json();

    if (!rows || !Array.isArray(rows)) {
      return NextResponse.json({ error: "Invalid payload, expected array of rows" }, { status: 400 });
    }

    // Process rows sequentially or in Promise.all (with limit)
    // For safety with API limits, we'll do sequentially here
    const cleanedRows = [];
    for (const row of rows) {
      if (Object.keys(row).length <= 1) { // Skip empty/unmapped rows (only have _rowId)
        cleanedRows.push(row);
        continue;
      }
      const cleaned = await cleanProductData(row);
      cleanedRows.push({
        ...row,
        ...cleaned
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: cleanedRows
    });
  } catch (error) {
    console.error("AI Clean Endpoint Error:", error);
    return NextResponse.json({ error: "AI Cleaning Failed" }, { status: 500 });
  }
}
