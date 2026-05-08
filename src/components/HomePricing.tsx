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

  const productCards = useMemo(() => {
    if (!rules || rules.length === 0) return [];
    
    // 根据材质和尺寸进行分组
    const grouped = rules.reduce((acc, rule) => {
      const key = `${rule.material}__${rule.size}`;
      if (!acc[key]) {
        acc[key] = {
          material: rule.material,
          size: rule.size,
          tiers: []
        };
      }
      acc[key].tiers.push(rule);
      return acc;
    }, {});

    // 转换为数组并对阶梯进行排序
    return Object.values(grouped).map((p: any) => {
      p.tiers.sort((a: any, b: any) => a.quantity - b.quantity);
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

  if (productCards.length === 0) return null;

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {productCards.map((product: any, idx: number) => (
          <div key={idx} className="bg-white rounded-3xl border border-[#101828]/5 p-8 shadow-[0_4px_24px_rgba(16,24,40,0.02)] hover:shadow-[0_12px_40px_rgba(16,24,40,0.06)] hover:-translate-y-1 transition-all duration-300">
            <div className="mb-8">
              <h3 className="font-bold text-[#101828] text-[20px] tracking-tight leading-tight mb-3">
                {product.material}
              </h3>
              <div className="inline-flex items-center px-3 py-1.5 rounded-md bg-[#F4F8FD] text-blue-700 text-[12px] font-bold tracking-widest uppercase">
                {product.size}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest border-b border-[#101828]/5 pb-3 mb-3">
                <span>{lang === 'zh' ? '起订量 (个)' : lang === 'tw' ? '起訂量 (個)' : 'QTY'}</span>
                <span>{lang === 'zh' ? '出厂单价' : lang === 'tw' ? '出廠單價' : 'Unit Price (EXW)'}</span>
              </div>
              {product.tiers.map((tier: any, i: number) => (
                <div key={i} className="flex justify-between items-center py-2.5 border-b border-[#101828]/5 last:border-0 group">
                  <span className="font-bold text-[#101828] text-[15px]">{tier.quantity.toLocaleString()}</span>
                  <span className="font-black text-[#667085] group-hover:text-blue-600 transition-colors text-[16px]">
                    ${tier.unitPrice.toFixed(3)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <Link href="/pricing" className="inline-flex items-center justify-center px-8 py-4 bg-white border border-[#101828]/10 hover:border-[#101828] text-[#101828] font-bold uppercase tracking-widest text-[13px] rounded-lg shadow-sm hover:shadow-md transition-all">
          <Calculator className="w-4 h-4 mr-2" />
          {lang === 'zh' ? '计算国际运费与到门总价' : lang === 'tw' ? '計算國際運費與到門總價' : 'Calculate DDP Shipping & Total Cost'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}
