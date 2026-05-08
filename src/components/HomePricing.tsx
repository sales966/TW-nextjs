"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Calculator, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import Image from "next/image";

const getMaterialImage = (materialName: string) => {
  if (materialName.includes('普通纸')) return '/images/pricing/bag_plain.png';
  if (materialName.includes('牛皮')) return '/images/pricing/bag_kraft.png';
  if (materialName.includes('铜版纸')) return '/images/pricing/bag_coated.png';
  if (materialName.includes('黑卡')) return '/images/pricing/bag_black.png';
  return '/images/pricing/bag_plain.png';
};

export function HomePricing() {
  const { lang } = useI18n();
  const [rules, setRules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<number>(0);

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

  const activeProduct = products[activeTab];

  return (
    <div className="flex flex-col w-full bg-white border border-[#101828]/10 shadow-sm">
      {/* 顶部：材质标签栏 (Tabs) */}
      <div className="flex flex-wrap border-b border-[#101828]/10 bg-[#FAFAFA]">
        {products.map((product: any, idx: number) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`flex items-center px-6 py-4 text-[14px] font-bold tracking-wide transition-all ${
              activeTab === idx
                ? "text-[#101828] border-b-2 border-[#101828] bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.02)] relative z-10"
                : "text-[#667085] hover:text-[#101828] hover:bg-[#101828]/[0.02] border-b-2 border-transparent"
            }`}
          >
            <div className={`relative w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0 border transition-all duration-300 ${activeTab === idx ? 'border-[#101828]/20 shadow-md scale-110' : 'border-[#101828]/10 shadow-sm opacity-80'}`}>
              <Image 
                src={getMaterialImage(product.material)} 
                alt={product.material}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            {product.material}
          </button>
        ))}
      </div>

      {/* 主体：选中的材质对应的尺寸和阶梯价 */}
      <div className="p-6 md:p-10">
        {activeProduct && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-10">
            {activeProduct.sizesList.map((sz: any, i: number) => (
              <div key={i} className="flex flex-col">
                <div className="text-[12px] font-bold text-[#101828] uppercase tracking-widest mb-4 pb-2 border-b border-[#101828]/10 flex items-center">
                  <div className="w-1.5 h-1.5 bg-[#101828] mr-3 rounded-full opacity-80"></div>
                  {sz.name}
                </div>
                
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
        )}
      </div>
      
      {/* 底部按钮 */}
      <div className="border-t border-[#101828]/5 bg-[#FAFAFA] p-6 flex justify-end">
        <Link href="/pricing" className="inline-flex items-center text-[#101828] font-bold uppercase tracking-[0.1em] text-[12px] hover:text-blue-600 transition-colors">
          <Calculator className="w-4 h-4 mr-2" />
          {lang === 'zh' ? '进入完整国际估价器' : lang === 'tw' ? '進入完整國際估價器' : 'Open Full Estimator'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}
