"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Calculator, ArrowRight, Package } from "lucide-react";
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
    <div className="flex flex-col w-full bg-white rounded-[24px] border border-[#101828]/5 shadow-[0_8px_30px_rgba(16,24,40,0.04)] overflow-hidden transition-all">
      
      {/* 顶部：材质标签栏 (Tabs) - 增加了现代胶囊风格设计 */}
      <div className="flex flex-wrap items-center px-4 pt-4 pb-0 border-b border-[#101828]/5 bg-[#FAFAFA]/50">
        {products.map((product: any, idx: number) => {
          const isActive = activeTab === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center px-5 py-3.5 mb-[-1px] text-[14px] font-bold tracking-wide transition-all duration-300 rounded-t-2xl ${
                isActive
                  ? "text-[#101828] bg-white border-t border-x border-[#101828]/5 shadow-[0_-4px_10px_rgba(0,0,0,0.01)]"
                  : "text-[#667085] hover:text-[#101828] hover:bg-black/[0.02] border-t border-x border-transparent"
              }`}
            >
              <div className={`relative w-7 h-7 rounded-full overflow-hidden mr-3 flex-shrink-0 transition-transform duration-500 ${isActive ? 'scale-110 shadow-sm ring-2 ring-[#101828]/5' : 'opacity-70 saturate-50'}`}>
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
          );
        })}
      </div>

      {/* 主体：选中的材质对应的尺寸和阶梯价 */}
      <div className="p-8 md:p-12 bg-white min-h-[300px]">
        {activeProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
            {activeProduct.sizesList.map((sz: any, i: number) => (
              <div key={i} className="flex flex-col group">
                
                {/* 尺寸标签：升级为带圆角和极简背景色的药丸标签 */}
                <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#F4F8FD] text-blue-700 text-[13px] font-bold tracking-widest uppercase mb-6 self-start border border-blue-100/50">
                  <Package className="w-3.5 h-3.5 mr-2 opacity-70" />
                  {sz.name}
                </div>
                
                <div className="space-y-1 bg-[#FAFAFA]/30 rounded-xl p-4 border border-[#101828]/[0.03]">
                  {/* 表头 */}
                  <div className="flex justify-between text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3 px-1">
                    <span>{lang === 'zh' ? '起订量' : lang === 'tw' ? '起訂量' : 'QTY'}</span>
                    <span>{lang === 'zh' ? '出厂单价' : lang === 'tw' ? '出廠單價' : 'EXW Price'}</span>
                  </div>
                  
                  {/* 数据行 */}
                  {sz.tiers.map((tier: any, j: number) => (
                    <div key={j} className="flex justify-between items-center py-2.5 px-1 border-b border-[#101828]/[0.03] last:border-0 hover:bg-white hover:shadow-sm transition-all rounded-md">
                      <span className="font-semibold text-[#667085] text-[14px]">
                        {tier.quantity.toLocaleString()} <span className="text-[12px] opacity-70">pcs</span>
                      </span>
                      <span className="font-black text-[#101828] text-[16px]">
                        ${tier.unitPrice.toFixed(3)}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 底部按钮：升级为大气的引导区块 */}
      <div className="border-t border-[#101828]/5 bg-[#FAFAFA]/50 p-6 flex justify-between items-center px-8 md:px-12">
        <div className="text-[13px] text-[#667085] font-medium hidden md:block">
          {lang === 'zh' ? '价格基于 FCA/EXW 条款。' : lang === 'tw' ? '價格基於 FCA/EXW 條款。' : 'Prices are based on FCA/EXW terms.'}
        </div>
        <Link href="/pricing" className="inline-flex items-center justify-center px-8 py-3.5 bg-[#101828] text-white rounded-full font-bold uppercase tracking-widest text-[12px] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 w-full md:w-auto">
          <Calculator className="w-4 h-4 mr-2" />
          {lang === 'zh' ? '核算国际运费与到门总价' : lang === 'tw' ? '核算國際運費與到門總價' : 'Calculate DDP Landed Cost'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}
