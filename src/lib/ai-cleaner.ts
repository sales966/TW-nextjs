import { generateObject } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';

// 核心系统提示：扮演包装行业专家
const SYSTEM_PROMPT = `
你是一位包装行业专家 + AI 数据结构工程师。
你的任务是将产品描述转换并提取成标准结构的 JSON，专门用于定制包装产品。
必须自动识别类型、补全缺失字段、标准化行业术语。
不允许解释，严格只输出干净的 JSON
`;

// 输出数据的 Zod 模型定义，确保结构强类型
export const cleanedProductSchema = z.object({
  category: z.string().describe("产品大类，如：paper bag, gift box, rigid box 等"),
  type: z.string().describe("具体细分类型，如：wine carrier, folding carton 等"),
  capacity: z.string().optional().describe("产品容量，如：2 bottle, 500ml 等"),
  material: z.string().describe("标准化的行业材质，如：kraft paper, art paper, ivory board, corrugated board 等"),
  eco: z.boolean().describe("是否是环保材质或设计"),
  printing: z.string().describe("印刷方式或颜色要求，如：black logo, CMYK, pantone 等"),
  handle: z.string().optional().describe("提手类型，如：twisted handle, ribbon handle 等"),
  usage: z.string().describe("主要用途及场景，如：wine packaging, retail shopping 等"),
  ai_tags: z.array(z.string()).describe("用于 SEO 的优化标签组"),
  ai_summary: z.string().describe("50字以内的极短英文高度营销概括语句")
});

/**
 * 清洗单条杂乱的产品数据
 * @param rawData 原始爬取或导入的不规范数据
 */
export async function cleanProductData(rawData: any) {
  try {
    const { object } = await generateObject({
      model: openai('gpt-4o-mini'), 
      schema: cleanedProductSchema,
      prompt: `
        请将以下散乱的数据清洗为标准化格式：
        ${JSON.stringify(rawData, null, 2)}
      `,
      system: SYSTEM_PROMPT,
      temperature: 0.1, // 降低创造性，提升提取稳定性
    });

    return object;
  } catch (error) {
    console.error("AI Cleaning failed", error);
    throw error;
  }
}
