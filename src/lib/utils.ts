import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并 Tailwind CSS 类名，解决冲突问题
 * 就像一个智能的 className 拼接器
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 生成询价编号
 * 格式: INQ-20260420-001
 */
export function generateInquiryNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 999)
    .toString()
    .padStart(3, "0");
  return `INQ-${dateStr}-${random}`;
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

/**
 * 材质名称映射
 */
export const MATERIAL_LABELS: Record<string, string> = {
  kraft: "Kraft Paper",
  ccnb: "CCNB (White Cardboard)",
  corrugated_e: "Corrugated E-Flute",
  corrugated_b: "Corrugated B-Flute",
};

/**
 * 印刷方式名称映射
 */
export const PRINTING_LABELS: Record<string, string> = {
  no_print: "No Print",
  pantone_1c: "1-Color Pantone",
  pantone_2c: "2-Color Pantone",
  cmyk: "Full Color CMYK",
};

/**
 * 工艺名称映射
 */
export const FINISH_LABELS: Record<string, string> = {
  matte_lamination: "Matte Lamination",
  gloss_lamination: "Gloss Lamination",
  spot_uv: "Spot UV",
  hot_foil: "Hot Foil Stamping",
  embossing: "Embossing / Debossing",
};

/**
 * 盒型名称映射
 */
export const BOX_CATEGORY_LABELS: Record<string, string> = {
  MAILER_BOX: "Mailer Box",
  SHIPPING_BOX: "Shipping Box",
  FOLDING_CARTON: "Folding Carton",
  RIGID_BOX: "Rigid Box",
  SLEEVE_BOX: "Sleeve Box",
  DISPLAY_BOX: "Display Box",
};

/**
 * 国家列表（全球主要国家）
 */
export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria",
  "Bahrain", "Bangladesh", "Belgium", "Brazil", "Brunei", "Bulgaria",
  "Cambodia", "Cameroon", "Canada", "Chile", "China", "Colombia", "Costa Rica",
  "Croatia", "Czech Republic", "Denmark",
  "Ecuador", "Egypt", "Estonia",
  "Finland", "France",
  "Germany", "Ghana", "Greece", "Guatemala",
  "Honduras", "Hong Kong", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kuwait",
  "Laos", "Latvia", "Lebanon", "Libya", "Lithuania", "Luxembourg",
  "Macau", "Malaysia", "Maldives", "Mexico", "Mongolia", "Morocco", "Myanmar",
  "Nepal", "Netherlands", "New Zealand", "Nigeria", "Norway",
  "Oman",
  "Pakistan", "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia",
  "Saudi Arabia", "Serbia", "Singapore", "Slovakia", "Slovenia", "South Africa",
  "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland",
  "Taiwan", "Tanzania", "Thailand", "Tunisia", "Turkey",
  "UAE", "Uganda", "Ukraine", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe",
];
