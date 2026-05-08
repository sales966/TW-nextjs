"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, ChevronDown, Calculator } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { RevealText } from "@/components/ui/scroll-reveal";

export function HomePricing() {
  const { lang, t } = useI18n();
  const [rules, setRules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // States
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

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

  const materials = useMemo(() => {
    return Array.from(new Set(rules.map(r => r.material)));
  }, [rules]);

  const availableSizes = useMemo(() => {
    if (!selectedMaterial) return [];
    return Array.from(new Set(rules.filter(r => r.material === selectedMaterial).map(r => r.size)));
  }, [rules, selectedMaterial]);

  useEffect(() => {
    if (materials.length > 0 && !selectedMaterial) {
      setSelectedMaterial(materials[0]);
    }
  }, [materials, selectedMaterial]);

  useEffect(() => {
    if (availableSizes.length > 0 && (!selectedSize || !availableSizes.includes(selectedSize))) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableSizes, selectedSize]);

  const currentTiers = useMemo(() => {
    if (!selectedMaterial || !selectedSize) return [];
    return rules
      .filter(r => r.material === selectedMaterial && r.size === selectedSize)
      .sort((a, b) => a.quantity - b.quantity);
  }, [rules, selectedMaterial, selectedSize]);

  // Labels based on lang
  const labels = {
    title: lang === 'zh' ? '出厂报价矩阵' : lang === 'tw' ? '出廠報價矩陣' : 'Wholesale Matrix',
    sub: lang === 'zh' ? '透明的阶梯参考价，所见即所得' : lang === 'tw' ? '透明的階梯參考價，所見即所得' : 'Transparent tiered pricing based on direct factory costs.',
    matLabel: lang === 'zh' ? '1. 选择材质' : lang === 'tw' ? '1. 選擇材質' : '1. Material',
    sizeLabel: lang === 'zh' ? '2. 选择尺寸' : lang === 'tw' ? '2. 選擇尺寸' : '2. Dimensions',
    qty: lang === 'zh' ? '起订量' : lang === 'tw' ? '起訂量' : 'QTY',
    unit: lang === 'zh' ? '单价(USD)' : lang === 'tw' ? '單價(USD)' : 'Unit Price',
    total: lang === 'zh' ? '总价(USD)' : lang === 'tw' ? '總價(USD)' : 'Total(EXW)'
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#101828]" />
      </div>
    );
  }

  if (rules.length === 0) return null;

  return (
    <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(16,24,40,0.05)] border border-[#101828]/5 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Selectors */}
        <div className="lg:col-span-5 p-8 lg:p-12 bg-[#FAFAFA] border-b lg:border-b-0 lg:border-r border-[#101828]/5">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-full bg-[#101828] flex items-center justify-center text-white shadow-md">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[22px] font-bold text-[#101828] tracking-tight">{labels.title}</h3>
              <p className="text-[#667085] text-[14px] mt-1">{labels.sub}</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="text-[12px] font-bold text-[#101828] uppercase tracking-widest mb-3 block">
                {labels.matLabel}
              </label>
              <div className="relative">
                <select
                  value={selectedMaterial || ""}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="w-full appearance-none px-5 py-4 rounded-xl border border-[#101828]/10 bg-white focus:border-[#101828] outline-none font-medium text-[#101828] cursor-pointer shadow-sm"
                >
                  {materials.map(mat => (
                    <option key={mat} value={mat}>{mat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085] pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#101828] uppercase tracking-widest mb-3 block">
                {labels.sizeLabel}
              </label>
              <div className="relative">
                <select
                  value={selectedSize || ""}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full appearance-none px-5 py-4 rounded-xl border border-[#101828]/10 bg-white focus:border-blue-600 outline-none font-bold text-blue-700 cursor-pointer shadow-sm"
                >
                  {availableSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Matrix */}
        <div className="lg:col-span-7 p-8 lg:p-12">
          {currentTiers.length > 0 ? (
            <div className="flex flex-col h-full justify-center">
              <div className="grid grid-cols-3 text-[12px] font-bold text-[#667085] uppercase tracking-wider pb-3 border-b border-[#101828]/10 px-2">
                <div>{labels.qty}</div>
                <div className="text-right">{labels.unit}</div>
                <div className="text-right">{labels.total}</div>
              </div>
              
              <div className="mt-2 space-y-2">
                {currentTiers.map((tier, idx) => (
                  <div key={idx} className="grid grid-cols-3 items-center p-4 rounded-xl hover:bg-[#F9F9F8] transition-colors group">
                    <div className="font-bold text-[#101828] text-[16px]">
                      {tier.quantity.toLocaleString()}
                    </div>
                    <div className="text-right font-medium text-[#667085] group-hover:text-[#101828] transition-colors">
                      ${tier.unitPrice.toFixed(3)}
                    </div>
                    <div className="text-right font-black text-[#101828] text-[18px]">
                      ${tier.totalPrice.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-[#101828]/5 flex justify-end">
                <a href="/pricing" className="text-[13px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest flex items-center transition-colors">
                  {lang === 'zh' ? '完整估价 (含运费计算) →' : lang === 'tw' ? '完整估價 (含運費計算) →' : 'Full Calculator (w/ Shipping) →'}
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[#667085]">
              No pricing data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
