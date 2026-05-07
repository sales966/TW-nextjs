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
      empty: "請在上方選擇材質和尺寸，即可查看完整的階梯報價。",
      noData: "正在加載報價資料庫...",
      ctaTitle: "獲取精準底價",
      ctaDesc: "以上僅為基礎印刷規格的粗略參考價。如需核算特殊工藝（如燙金、打凸）及全球物流運費，請向我們提交正式詢價。",
      ctaBtn: "提交專屬詢價"
    }
  };

  const t = text[lang as keyof typeof text] || text.en;

  useEffect(() => {
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

              </div>

              {/* Right Side: Results */}
              <div className="lg:col-span-7 p-8 lg:p-12">
                <h3 className="text-xl font-bold text-[#101828] tracking-tight mb-8">
                  {t.resultTitle}
                </h3>

                {currentTiers.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 text-[12px] font-bold text-[#667085] uppercase tracking-wider pb-2 border-b border-[#101828]/5">
                      <div>{t.qty}</div>
                      <div className="text-right">{t.unit}</div>
                      <div className="text-right">{t.total}</div>
                    </div>
                    
                    <div className="flex flex-col gap-3 pt-2">
                      {currentTiers.map((tier, idx) => (
                        <div key={idx} className="grid grid-cols-3 items-center p-4 rounded-xl bg-[#F9F9F8] border border-[#101828]/5 hover:bg-[#F0F0EE] transition-colors">
                          <div className="font-bold text-[#101828] text-[15px]">
                            {tier.quantity.toLocaleString()}
                          </div>
                          <div className="text-right font-medium text-[#667085]">
                            ${tier.unitPrice.toFixed(3)}
                          </div>
                          <div className="text-right font-bold text-[#101828] text-[17px]">
                            ${tier.totalPrice.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
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
