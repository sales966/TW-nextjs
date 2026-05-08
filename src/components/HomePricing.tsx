"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Calculator, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export function HomePricing() {
  const { lang } = useI18n();
  const [rules, setRules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const products = useMemo(() => {
    if (!rules || rules.length === 0) return [];
    
    // 按材质进行主分组
    const grouped = rules.reduce((acc, rule) => {
      if (!acc[rule.material]) {
        acc[rule.material] = {
          material: rule.material,
          sizes: {}
        };
      }
      if (!acc[rule.material].sizes[rule.size]) {
        acc[rule.material].sizes[rule.size] = [];
      }
      acc[rule.material].sizes[rule.size].push(rule);
      return acc;
    }, {});

    // 将尺寸对象转换为数组，并对阶梯进行排序
    return Object.values(grouped).map((p: any) => {
      p.sizesList = Object.keys(p.sizes).map(sizeName => {
        const tiers = p.sizes[sizeName];
        tiers.sort((a: any, b: any) => a.quantity - b.quantity);
        return { name: sizeName, tiers };
      });
      return p;
    });
  }, [rules]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#101828]" />
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="flex flex-col">
      {/* 统一的大容器，消除割裂感 */}
      <div className="bg-white rounded-[24px] border border-[#101828]/5 shadow-[0_8px_30px_rgba(16,24,40,0.03)] overflow-hidden">
        {products.map((product: any, idx: number) => (
          <div key={idx} className="border-b border-[#101828]/5 last:border-0 p-8 md:p-12 hover:bg-[#FAFAFA]/50 transition-colors duration-500">
            {/* 商品主标题：不再是独立的卡片，而是作为区块的 Header */}
            <div className="flex items-center mb-8">
              <div className="w-1.5 h-6 bg-[#101828] rounded-full mr-4"></div>
              <h3 className="font-bold text-[#101828] text-[22px] md:text-[26px] tracking-tight">
                {product.material}
              </h3>
            </div>
            
            {/* 不同尺寸的极简网格排版 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-12">
              {product.sizesList.map((sz: any, i: number) => (
                <div key={i} className="flex flex-col">
                  {/* 尺寸标签，干净利落的下划线样式 */}
                  <div className="text-[13px] font-bold text-blue-700 uppercase tracking-widest mb-4 pb-3 border-b border-blue-700/10 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                    {sz.name}
                  </div>
                  
                  {/* 价格列表 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest pb-2">
                      <span>{lang === 'zh' ? '起订量' : lang === 'tw' ? '起訂量' : 'QTY'}</span>
                      <span>{lang === 'zh' ? '单价' : lang === 'tw' ? '單價' : 'Price'}</span>
                    </div>
                    {sz.tiers.map((tier: any, j: number) => (
                      <div key={j} className="flex justify-between items-center py-2.5 group border-b border-[#101828]/[0.03] last:border-0">
                        <span className="font-semibold text-[#101828] text-[15px]">{tier.quantity.toLocaleString()}</span>
                        <span className="font-black text-[#667085] group-hover:text-[#101828] transition-colors text-[16px]">
                          ${tier.unitPrice.toFixed(3)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* 底部按钮 */}
      <div className="mt-12 flex justify-center">
        <Link href="/pricing" className="inline-flex items-center justify-center px-10 py-4 bg-[#101828] text-white font-bold uppercase tracking-widest text-[13px] rounded-lg shadow-[0_10px_30px_rgba(16,24,40,0.15)] hover:-translate-y-1 transition-all duration-300">
          <Calculator className="w-4 h-4 mr-3 opacity-70" />
          {lang === 'zh' ? '使用完整估价器 (含运费及多货币)' : lang === 'tw' ? '使用完整估價器 (含運費及多貨幣)' : 'Open Full Estimator'}
          <ArrowRight className="w-4 h-4 ml-3 opacity-70" />
        </Link>
      </div>
    </div>
  );
}
