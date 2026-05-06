import { NextResponse } from "next/server";
import { generateObject } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';

const productConfigSchema = z.object({
  category: z.string(),
  type: z.string(),
  capacity: z.string(),
  material: z.string(),
  printing: z.string(),
  style: z.string()
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: productConfigSchema,
      system: "你是一位包装产品专家，请根据用户输入生成一个标准的结构化产品配置JSON，只提取核心业务信息。忽略无关闲聊，强制标准化物料/印刷短语。",
      prompt: `用户输入: "${message}"`
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error("Chat Config Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
