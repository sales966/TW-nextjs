import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";
import Fuse from "fuse.js";
import { put } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

// 1. 字段模糊匹配配置
const FIELD_ALIASES: Record<string, string[]> = {
  name: ["name", "product_name", "品名", "名称", "产品名称", "title", "sku_name", "产品"],
  category: ["category", "type", "种类", "分类", "box_type", "类型"],
  width: ["width", "w", "宽", "宽度"],
  height: ["height", "h", "高", "高度"],
  depth: ["depth", "length", "l", "d", "长", "长度", "深", "深度"],
  unit: ["unit", "单位", "尺寸单位"],
  material: ["material", "paper", "材质", "纸张"],
  printing: ["printing", "print", "color", "印刷", "颜色"],
  moq: ["moq", "minimum", "起订量", "最低起包"],
  handle: ["handle", "提手", "拎带", "绳子"],
  code: ["code", "sku", "货号", "产品编号"]
};

// 扁平化数据供 Fuse.js 使用
const fuzzyList = Object.entries(FIELD_ALIASES).flatMap(([target, aliases]) => 
  aliases.map(alias => ({ target, alias }))
);
const fuse = new Fuse(fuzzyList, { keys: ["alias"], threshold: 0.3, includeScore: true });

function identifyField(rawHeader: string): string {
  const cleanHeader = rawHeader.toLowerCase().trim();
  const searchResult = fuse.search(cleanHeader);
  if (searchResult.length > 0 && searchResult[0].score && searchResult[0].score < 0.4) {
    return searchResult[0].item.target;
  }
  return rawHeader;
}

// 2. 自动单位处理 (mm -> cm)
function parseDimensions(row: any, rawUnit: string) {
  let w = parseFloat(row.width) || 0;
  let h = parseFloat(row.height) || 0;
  let d = parseFloat(row.depth) || 0;
  const unit = rawUnit.toLowerCase().trim();
  if (unit === 'mm' || unit === '毫米') {
    w /= 10; h /= 10; d /= 10;
  }
  return { width: w, height: h, depth: d };
}

// 3. 数据清洗：字段标准化
function standardizeMaterial(raw: string) {
  if (!raw) return "Standard Paper";
  const lower = raw.toLowerCase().trim();
  if (lower.includes("牛皮") || lower.includes("kraft")) return "Kraft Paper";
  if (lower.includes("白卡") || lower.includes("c1s") || lower.includes("ivory")) return "Ivory Board";
  if (lower.includes("铜版") || lower.includes("art") || lower.includes("c2s")) return "Art Paper";
  if (lower.includes("瓦楞") || lower.includes("corrugated")) return "Corrugated Board";
  return raw;
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const isPreview = url.searchParams.get("preview") === "true"; // 支持 preview 模式
    
    // 解析 FormData (CSV + JPG)
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const imageFiles = formData.getAll("images") as File[];
    
    if (!file && imageFiles.length === 0) {
      return NextResponse.json({ error: "请上传 CSV 表格或产品图片" }, { status: 400 });
    }

    // 4. 图片处理逻辑：存储并在内存中建立映射
    const imageMap: Record<string, string> = {};
    if (imageFiles.length > 0) {
      const isCloud = process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN;
      
      if (!isCloud) {
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadDir, { recursive: true }); // 确保目录存在
      }
      
      for (const img of imageFiles) {
        if (img.type.startsWith("image/")) {
          const fileName = `${Date.now()}-${img.name}`;
          const matchName = img.name.split('.')[0].toLowerCase();
          
          if (isCloud) {
            try {
              // 必须开启 Vercel Blob 才能上传
              const blob = await put(fileName, img, { access: 'public' });
              imageMap[matchName] = blob.url;
            } catch (err) {
              return NextResponse.json({ 
                error: "Vercel Blob 尚未配置！请到 Vercel 后台的 Storage 开启 Blob 功能，否则云端无法保存图片。" 
              }, { status: 400 });
            }
          } else {
            const buffer = Buffer.from(await img.arrayBuffer());
            await fs.writeFile(path.join(process.cwd(), "public", "uploads", fileName), buffer);
            imageMap[matchName] = `/uploads/${fileName}`;
          }
        }
      }
    }

    const parsedProducts = [];

    if (file) {
      // 5. CSV 解析 (Papaparse)
      const text = await file.text();
      const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
      
      if (parsed.errors.length && !parsed.data.length) {
        return NextResponse.json({ error: "CSV 解析失败" }, { status: 400 });
      }

      const headers = parsed.meta.fields || [];
      const headerMap: Record<string, string> = {};
      headers.forEach(h => { headerMap[h] = identifyField(h); }); // 自动字段匹配

      // 6. 数据转换与空值补齐循环
      for (let i = 0; i < parsed.data.length; i++) {
          const rawRow: any = parsed.data[i];
          const mappedRow: Record<string, any> = {};
          const extraAttributes: Record<string, any> = {};

          Object.keys(rawRow).forEach(key => {
              const val = String(rawRow[key] || "").trim();
              const targetField = headerMap[key];
              if (Object.keys(FIELD_ALIASES).includes(targetField)) {
                  mappedRow[targetField] = val;
              } else if (val) {
                  extraAttributes[targetField] = val; // 未知字段丢入 attributes
              }
          });

          // 空值补 default
          const name = mappedRow.name || `未命名产品 ${i + 1}`;
          const code = mappedRow.code || `SKU-${Date.now().toString().slice(-6)}-${i}`;
          const category = mappedRow.category || "General Packaging";
          const moq = parseInt(mappedRow.moq) || 500;
          const material = standardizeMaterial(mappedRow.material);
          const printing = mappedRow.printing || "CMYK";
          const rawUnit = mappedRow.unit || "cm";
          const dimensions = parseDimensions(mappedRow, rawUnit);

          // 尝试匹配上传的 jpg
          const searchKeyName = name.toLowerCase();
          const searchKeyCode = code.toLowerCase();
          const matchedImage = imageMap[searchKeyName] || imageMap[searchKeyCode] || null;

          parsedProducts.push({
              name,
              code,
              category,
              dimensions,
              material,
              printing,
              moq,
              image: matchedImage,
              attributes: { ...extraAttributes, ...(mappedRow.handle ? { handle: mappedRow.handle } : {}) }
          });
      }
    } else {
      // 纯图片导入模式：直接使用图片名作为产品名
      let i = 0;
      for (const img of imageFiles) {
        if (img.type.startsWith("image/")) {
          const originalName = img.name.split('.')[0];
          const searchKeyName = originalName.toLowerCase();
          
          parsedProducts.push({
            name: originalName,
            code: `SKU-${Date.now().toString().slice(-6)}-${i++}`,
            category: "General Packaging",
            dimensions: { width: 0, height: 0, depth: 0 },
            material: "Standard Paper",
            printing: "CMYK",
            moq: 500,
            image: imageMap[searchKeyName],
            attributes: {}
          });
        }
      }
    }

    // --- 返回预览（不入库） ---
    if (isPreview) {
      return NextResponse.json({ success: true, preview: true, total: parsedProducts.length, data: parsedProducts });
    }

    // 7. 存入数据库 Prisma
    const insertedProducts = [];
    for (const p of parsedProducts) {
      const slug = `p-${p.code.toLowerCase()}`;
      const newProduct = await prisma.product.create({
        data: {
            name: p.name,
            slug: slug,
            summary: `${p.material} with ${p.printing}`,
            boxType: "MAILER_BOX",
            moq: p.moq,
            productCode: p.code,
            featuredImage: p.image,
            media: p.image ? [p.image] : [],
            attributes: {
                dimensions: p.dimensions,
                material: p.material,
                printing: p.printing,
                category: p.category,
                ...p.attributes
            },
            status: "PUBLISHED"
        }
      });
      insertedProducts.push(newProduct);
    }

    return NextResponse.json({
        success: true,
        message: `成功清洗并入库 ${insertedProducts.length} 条产品`,
        totalInserted: insertedProducts.length,
        data: insertedProducts
    });

  } catch (error) {
    console.error("Import API Error:", error);
    return NextResponse.json({ error: "服务器内部异常: " + String(error) }, { status: 500 });
  }
}
