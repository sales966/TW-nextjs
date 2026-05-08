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
    <div className="flex flex-col w-full">
      {/* 极简、去卡片化、高密度的表格流排版 */}
      <div className="border-t-[1.5px] border-[#101828]/10">
        {products.map((product: any, idx: number) => (
          <div key={idx} className="flex flex-col lg:flex-row py-8 md:py-12 border-b border-[#101828]/10 group hover:bg-[#101828]/[0.02] transition-colors duration-500 px-4 md:px-8 -mx-4 md:-mx-8">
            
            {/* 左侧：材质标题 */}
            <div className="w-full lg:w-[35%] mb-8 lg:mb-0 pr-8 flex flex-col justify-start">
              <span className="text-[12px] font-bold text-[#101828]/40 tracking-widest uppercase mb-3 font-serif italic">
                {String(idx + 1).padStart(2, '0')}.
              </span>
              <h3 className="font-bold text-[#101828] text-[20px] md:text-[24px] tracking-tight leading-snug">
                {product.material}
              </h3>
            </div>
            
            {/* 右侧：尺寸与阶梯价极简网格 */}
            <div className="w-full lg:w-[65%] grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {product.sizesList.map((sz: any, i: number) => (
                <div key={i} className="flex flex-col">
                  {/* 尺寸极简标签 */}
                  <div className="text-[12px] font-bold text-[#101828] uppercase tracking-widest mb-4 pb-2 border-b border-[#101828]/10 flex items-center">
                    <div className="w-1.5 h-1.5 bg-[#101828] mr-3 rounded-full opacity-80"></div>
                    {sz.name}
                  </div>
                  
                  {/* 阶梯价密集列表 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">
                      <span>{lang === 'zh' ? '起订量' : lang === 'tw' ? '起訂量' : 'QTY'}</span>
                      <span>{lang === 'zh' ? '单价' : lang === 'tw' ? '單價' : 'EXW'}</span>
                    </div>
                    {sz.tiers.map((tier: any, j: number) => (
                      <div key={j} className="flex justify-between items-center text-[14px]">
                        <span className="font-medium text-[#667085]">{tier.quantity.toLocaleString()} pcs</span>
                        <span className="font-semibold text-[#101828]">${tier.unitPrice.toFixed(3)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* 底部按钮回归品牌调性 */}
      <div className="mt-16 flex justify-center">
        <Link href="/pricing" className="inline-flex items-center justify-center px-10 py-5 bg-transparent border-[1.5px] border-[#101828]/20 hover:border-[#101828] text-[#101828] font-bold uppercase tracking-[0.1em] text-[13px] hover:bg-[#101828] hover:text-white transition-all duration-500 rounded-[4px]">
          {lang === 'zh' ? '核算国际运费与到门总价' : lang === 'tw' ? '核算國際運費與到門總價' : 'Calculate Full Landed Cost'}
          <ArrowRight className="w-4 h-4 ml-3" />
        </Link>
      </div>
    </div>
  );
}
