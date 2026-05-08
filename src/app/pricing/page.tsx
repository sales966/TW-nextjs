"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Calculator, ArrowRight, Loader2, Info, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function PricingPage() {
  const { lang } = useI18n();
  const [rules, setRules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 状态
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  // 运费相关
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // 汇率与多货币
  const [exchangeRates, setExchangeRates] = useState<any>({ USD: 1 });
  const [currency, setCurrency] = useState<string>("USD");

  // 文本多语言
  const text = {
    en: {
      title: "Cost Estimator",
      desc: "Select your preferred product name and dimensions to instantly view our tiered wholesale pricing matrix. These are factory-direct estimates designed to help you plan your budget.",
      matLabel: "1. Select Product",
      sizeLabel: "2. Select Dimensions (L×W×H)",
      resultTitle: "Estimated Wholesale Pricing",
      qty: "Quantity",
      unit: "Unit Price",
      total: "Total Cost",
      shipping: "Est. Packing",
      destLabel: "3. Select Destination (Optional)",
      shippingTotal: "Est. DDP Total",
      shippingUnit: "Est. Landed Unit",
      empty: "Please select both material and dimensions to view pricing.",
      noData: "Loading pricing data...",
      ctaTitle: "Ready to start?",
      ctaDesc: "This is a rough estimate. For an exact quote including shipping and custom finishes, please submit a formal inquiry.",
      ctaBtn: "Request Official Quote"
    },
    zh: {
      title: "在线估价计算器",
      desc: "请选择您所需的商品名与尺寸，系统将即时显示工厂直供的阶梯参考价格。此价格矩阵旨在帮助您快速评估包装预算。",
      matLabel: "1. 选择商品名",
      sizeLabel: "2. 选择长宽高尺寸",
      resultTitle: "出厂参考报价矩阵",
      qty: "起订量 (个)",
      unit: "预估单价",
      total: "预估总价",
      shipping: "预估装箱参数",
      destLabel: "3. 选择目的国 (选填, 预估到门运费)",
      shippingTotal: "到门总价(DDP)",
      shippingUnit: "到门单价(含运费)",
      empty: "请在上方选择材质和尺寸，即可查看完整的阶梯报价。",
      noData: "正在加载报价资料库...",
      ctaTitle: "获取精准底价",
      ctaDesc: "以上仅为基础印刷规格的粗略参考价。如需核算特殊工艺（如烫金、击凸）及全球物流运费，请向我们提交正式询价。",
      ctaBtn: "提交专属询价"
    },
    tw: {
      title: "線上估價計算器",
      desc: "請選擇您所需的商品名與尺寸，系統將即時顯示工廠直供的階梯參考價格。此價格矩陣旨在幫助您快速評估包裝預算。",
      matLabel: "1. 選擇商品名",
      sizeLabel: "2. 選擇長寬高尺寸",
      resultTitle: "出廠參考報價矩陣",
      qty: "起訂量 (個)",
      unit: "預估單價",
      total: "預估總價",
      shipping: "預估裝箱參數",
      destLabel: "3. 選擇目的國 (選填, 預估到門運費)",
      shippingTotal: "到門總價(DDP)",
      shippingUnit: "到門單價(含運費)",
      empty: "請在上方選擇材質和尺寸，即可查看完整的階梯報價。",
      noData: "正在加載報價資料庫...",
      ctaTitle: "獲取精準底價",
      ctaDesc: "以上僅為基礎印刷規格的粗略參考價。如需核算特殊工藝（如燙金、打凸）及全球物流運費，請向我們提交正式詢價。",
      ctaBtn: "提交專屬詢價"
    }
  };

  const t = text[lang as keyof typeof text] || text.en;

  useEffect(() => {
    // 基础价格资料库
    fetch("/api/admin/pricing")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRules(data.data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });

    // 运费资料库
    fetch("/api/admin/shipping")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setShippingRates(data.data);
        }
      })
      .catch(err => console.error(err));

    // 汇率资料库
    fetch("/api/exchange-rates")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.rates) {
          setExchangeRates(data.rates);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // 提取唯一的材质
  const materials = useMemo(() => {
    const mats = Array.from(new Set(rules.map(r => r.material)));
    return mats;
  }, [rules]);

  // 当选择材质后，提取该材质下独有的尺寸
  const availableSizes = useMemo(() => {
    if (!selectedMaterial) return [];
    return Array.from(new Set(rules.filter(r => r.material === selectedMaterial).map(r => r.size)));
  }, [rules, selectedMaterial]);

  // 自动选择第一个材质
  useEffect(() => {
    if (materials.length > 0 && !selectedMaterial) {
      setSelectedMaterial(materials[0]);
    }
  }, [materials, selectedMaterial]);

  // 当材质改变时，如果当前尺寸不在可用尺寸里，自动重置尺寸
  useEffect(() => {
    if (availableSizes.length > 0 && (!selectedSize || !availableSizes.includes(selectedSize))) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableSizes, selectedSize]);

  // 提取最终展示的价格阶梯
  const currentTiers = useMemo(() => {
    if (!selectedMaterial || !selectedSize) return [];
    return rules
      .filter(r => r.material === selectedMaterial && r.size === selectedSize)
      .sort((a, b) => a.quantity - b.quantity);
  }, [rules, selectedMaterial, selectedSize]);

  // 运费目的地选项
  const countries = useMemo(() => Array.from(new Set(shippingRates.map(r => r.country))), [shippingRates]);
  const availableMethods = useMemo(() => shippingRates.filter(r => r.country === selectedDestination), [shippingRates, selectedDestination]);

  useEffect(() => {
    if (availableMethods.length > 0 && (!selectedMethod || !availableMethods.find(m => m.method === selectedMethod))) {
      setSelectedMethod(availableMethods[0].method);
    }
  }, [availableMethods, selectedMethod]);

  // 目的国与货币的自动联动
  useEffect(() => {
    if (!selectedDestination) {
      setCurrency("USD");
      return;
    }
    const dest = selectedDestination.toLowerCase();
    if (dest.includes("japan")) setCurrency("JPY");
    else if (dest.includes("dubai") || dest.includes("uae")) setCurrency("AED");
    else if (dest.includes("taiwan")) setCurrency("TWD");
    else setCurrency("USD"); // USA 默认使用 USD
  }, [selectedDestination]);

  // 货币格式化工具
  const formatPrice = (amountInUSD: number, isUnit = false) => {
    const rate = exchangeRates[currency] || 1;
    const converted = amountInUSD * rate;
    const decimals = (currency === 'JPY' || currency === 'KRW') ? 0 : (isUnit ? 3 : 2);
    
    return new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(converted);
  };

  const availableCurrencies = Object.keys(exchangeRates).sort((a, b) => {
    if (a === 'USD') return -1;
    if (b === 'USD') return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="min-h-screen bg-[#FBFAF7] pt-32 pb-24 font-sans">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#101828] mb-6 shadow-xl">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#101828] tracking-tight mb-6">
            {t.title}
          </h1>
          <p className="text-lg text-[#667085] leading-relaxed">
            {t.desc}
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#667085]">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#101828]" />
            <p>{t.noData}</p>
          </div>
        ) : rules.length === 0 ? (
          <div className="text-center py-20 text-[#667085] bg-white rounded-2xl border border-[#101828]/5">
            <p>Admin has not configured any pricing rules yet.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl border border-[#101828]/5 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Side: Selectors */}
              <div className="lg:col-span-5 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-[#101828]/5 bg-[#FAFAFA]">
                
                <div className="mb-10">
                  <h3 className="text-[13px] font-bold text-[#101828] uppercase tracking-widest mb-4">
                    {t.matLabel}
                  </h3>
                  <div className="relative">
                    <select
                      value={selectedMaterial || ""}
                      onChange={(e) => setSelectedMaterial(e.target.value)}
                      className="w-full appearance-none px-5 py-4 rounded-xl border border-[#101828]/10 bg-white focus:border-[#101828] focus:ring-1 focus:ring-[#101828] outline-none font-medium text-[#101828] cursor-pointer transition-all shadow-sm"
                    >
                      <option value="" disabled>--- 请选择 ---</option>
                      {materials.map(mat => (
                        <option key={mat} value={mat}>{mat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667085] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <h3 className="text-[13px] font-bold text-[#101828] uppercase tracking-widest mb-4">
                    {t.sizeLabel}
                  </h3>
                  <div className="relative">
                    {availableSizes.length > 0 ? (
                      <>
                        <select
                          value={selectedSize || ""}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          className="w-full appearance-none px-5 py-4 rounded-xl border border-[#101828]/10 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-medium text-blue-700 cursor-pointer transition-all shadow-sm"
                        >
                          <option value="" disabled>--- 请选择 ---</option>
                          {availableSizes.map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 pointer-events-none" />
                      </>
                    ) : (
                      <div className="text-sm text-[#667085] italic p-4 bg-white rounded-xl border border-[#101828]/5">
                        No sizes configured for this product.
                      </div>
                    )}
                  </div>
                </div>

                {/* 目的国选择 */}
                <div className="mt-10 pt-10 border-t border-[#101828]/5">
                  <h3 className="text-[13px] font-bold text-[#101828] uppercase tracking-widest mb-4">
                    {t.destLabel}
                  </h3>
                  <div className="relative">
                    <select
                      value={selectedDestination || ""}
                      onChange={(e) => setSelectedDestination(e.target.value)}
                      className="w-full appearance-none px-5 py-4 rounded-xl border border-[#101828]/10 bg-white focus:border-[#101828] focus:ring-1 focus:ring-[#101828] outline-none font-medium text-[#101828] cursor-pointer transition-all shadow-sm"
                    >
                      <option value="">--- 无 (仅显示出厂价 EXW) ---</option>
                      {countries.map(country => (
                        <option key={country as string} value={country as string}>{country as string}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667085] pointer-events-none" />
                  </div>
                  
                  {selectedDestination && availableMethods.length > 0 && (
                    <div className="mt-4">
                      <div className="flex gap-2 flex-wrap">
                        {availableMethods.map((m) => (
                          <button
                            key={m.method}
                            onClick={() => setSelectedMethod(m.method)}
                            className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${
                              selectedMethod === m.method 
                                ? "bg-[#101828] text-white" 
                                : "bg-white border border-[#101828]/10 text-[#667085] hover:border-[#101828]/30"
                            }`}
                          >
                            {m.method}
                            {m.estimatedDays && <span className="ml-1 opacity-70">({m.estimatedDays})</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Side: Results */}
              <div className="lg:col-span-7 p-8 lg:p-12 relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                  <h3 className="text-xl font-bold text-[#101828] tracking-tight">
                    {t.resultTitle}
                  </h3>
                  
                  {/* Currency Selector */}
                  <div className="flex items-center bg-white border border-[#101828]/10 rounded-lg px-3 py-1.5 shadow-sm">
                    <span className="text-[12px] font-bold text-[#667085] mr-2 uppercase tracking-wide">Currency</span>
                    <div className="relative">
                      <select 
                        value={currency} 
                        onChange={(e) => setCurrency(e.target.value)}
                        className="appearance-none bg-transparent pr-5 text-[13px] font-black text-[#101828] focus:outline-none cursor-pointer"
                      >
                        {availableCurrencies.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#101828] pointer-events-none" />
                    </div>
                  </div>
                </div>

                {currentTiers.length > 0 ? (
                  <div className="space-y-4">
                    {/* 表头始终保持 4 列（只展示出厂价和装箱信息） */}
                    <div className="grid grid-cols-[1fr_1.2fr_1.2fr_1fr] text-[12px] font-bold text-[#667085] uppercase tracking-wider pb-2 border-b border-[#101828]/5 px-4">
                      <div>{t.qty}</div>
                      <div className="text-right">{t.unit}</div>
                      <div className="text-right">{t.total}</div>
                      <div className="text-right">{t.shipping}</div>
                    </div>
                    
                    <div className="flex flex-col gap-4 pt-2">
                      {currentTiers.map((tier, idx) => {
                        let shippingCost = 0;
                        const rate = availableMethods.find(m => m.method === selectedMethod);
                        let hasShippingParams = false;

                        if (selectedDestination && rate && tier.unitWeight && tier.cbmPer1000) {
                          hasShippingParams = true;
                          const actualWeightKg = (tier.unitWeight * tier.quantity) / 1000;
                          const totalCbm = (tier.cbmPer1000 * tier.quantity) / 1000;
                          const volWeightKg = (totalCbm * 1000000) / rate.volumetricRatio;
                          const chargeableWeight = Math.max(actualWeightKg, volWeightKg);

                          if (rate.pricePerKg) {
                            shippingCost = chargeableWeight * rate.pricePerKg;
                          } else if (rate.pricePerCbm) {
                            shippingCost = totalCbm * rate.pricePerCbm;
                            if (shippingCost < rate.pricePerCbm) shippingCost = rate.pricePerCbm; // minimum 1 CBM usually
                          }
                        }

                        const landedTotal = tier.totalPrice + shippingCost;
                        const landedUnit = landedTotal / tier.quantity;

                        return (
                          <div key={idx} className="flex flex-col bg-white rounded-2xl border border-[#101828]/5 hover:border-[#101828]/10 hover:shadow-md transition-all overflow-hidden">
                            {/* 第一排：基础出厂价（EXW） */}
                            <div className="grid grid-cols-[1fr_1.2fr_1.2fr_1fr] items-center p-5 bg-[#F9F9F8]">
                              <div className="font-bold text-[#101828] text-[16px]">
                                {tier.quantity.toLocaleString()}
                              </div>
                              <div className="text-right font-medium text-[#667085]">
                                {formatPrice(tier.unitPrice, true)}
                              </div>
                              <div className="text-right font-black text-[#101828] text-[18px]">
                                {formatPrice(tier.totalPrice, false)}
                              </div>
                              <div className="text-right text-[12px] text-[#667085] leading-relaxed flex flex-col items-end justify-center">
                                {tier.unitWeight && <div>{((tier.unitWeight * tier.quantity) / 1000).toFixed(1)} KG</div>}
                                {tier.cbmPer1000 && <div>{((tier.cbmPer1000 * tier.quantity) / 1000).toFixed(2)} CBM</div>}
                                {!tier.unitWeight && !tier.cbmPer1000 && <span className="opacity-40">-</span>}
                              </div>
                            </div>
                            
                            {/* 第二排：DDP 到门价（如果选择了目的国） */}
                            {selectedDestination && (
                              <div className="bg-gradient-to-r from-[#F4F8FD] to-[#F9FCFF] border-t border-blue-100 p-4 px-5 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center">
                                  {hasShippingParams ? (
                                    <div className="flex items-center flex-wrap gap-2">
                                      <div className="flex items-center text-blue-700 text-[13.5px] font-bold">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="16" height="16" x="4" y="4" rx="2"/><path d="M4 12h16"/><path d="M12 4v16"/></svg>
                                        <span>+ Shipping & Import Taxes: {formatPrice(shippingCost, false)}</span>
                                      </div>
                                      <div className="px-2 py-0.5 bg-green-100 border border-green-200 text-green-700 text-[10.5px] uppercase font-black tracking-wider rounded-md flex items-center shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polyline points="20 6 9 17 4 12"/></svg>
                                        Duty Included (DDP)
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 italic text-[13px]">缺失重量/材积参数，无法预估运费及税费</span>
                                  )}
                                </div>
                                {hasShippingParams && (
                                  <div className="flex items-center gap-6 mt-2 sm:mt-0">
                                    <div className="text-right">
                                      <span className="text-[11px] text-blue-500/80 uppercase tracking-wider font-bold mr-2">{t.shippingUnit}</span>
                                      <span className="font-bold text-blue-700">{formatPrice(landedUnit, true)}</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-[11px] text-blue-500/80 uppercase tracking-wider font-bold mr-2">{t.shippingTotal}</span>
                                      <span className="text-[18px] font-black text-blue-700 bg-white px-2.5 py-0.5 rounded-md border border-blue-100 shadow-sm">{formatPrice(landedTotal, false)}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {currency !== 'USD' && (
                      <div className="text-right mt-3 text-[#98A2B3] text-[11px] italic pr-2">
                        * Approximate costs in {currency} based on current exchange rates. Final billing may be in USD.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full min-h-[200px] flex items-center justify-center">
                    <div className="text-center text-[#667085]">
                      <Info className="w-8 h-8 mx-auto mb-3 opacity-20" />
                      <p>{t.empty}</p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Call to action below the calculator */}
          <div className="mt-12 p-8 md:p-12 bg-[#101828] rounded-3xl text-white flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-xl">
            <div className="max-w-2xl">
              <h4 className="text-2xl font-bold mb-3">{t.ctaTitle}</h4>
              <p className="text-[#98A2B3] leading-relaxed text-lg">
                {t.ctaDesc}
              </p>
            </div>
            <Link 
              href="/quote"
              className="shrink-0 inline-flex items-center justify-center px-8 py-4 bg-white text-[#101828] text-[15px] font-bold rounded hover:bg-slate-100 transition-colors"
            >
              {t.ctaBtn} <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </>
        )}
      </div>
    </div>
  );
}
