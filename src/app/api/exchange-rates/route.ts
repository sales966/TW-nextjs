import { NextResponse } from "next/server";

// 内存缓存
let cachedRates: any = null;
let lastFetchTime = 0;

export async function GET() {
  const now = Date.now();
  // 缓存 12 小时 (12 * 60 * 60 * 1000)
  if (cachedRates && (now - lastFetchTime < 43200000)) {
    return NextResponse.json({ success: true, rates: cachedRates });
  }

  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    
    if (data && data.rates) {
      cachedRates = data.rates;
      lastFetchTime = now;
      return NextResponse.json({ success: true, rates: cachedRates });
    } else {
      throw new Error("Invalid exchange rate data");
    }
  } catch (error: any) {
    // 降级处理：如果 API 失败，返回常见的粗略汇率以保证系统可用
    const fallbackRates = {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      AUD: 1.5,
      CAD: 1.35,
      NZD: 1.65,
      SGD: 1.35,
      JPY: 150.0,
      KRW: 1350.0,
      MXN: 17.0,
      CNY: 7.2
    };
    return NextResponse.json({ success: true, rates: fallbackRates, fallback: true });
  }
}
