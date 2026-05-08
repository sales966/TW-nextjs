"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Calculator, ArrowRight, Sparkles } from "lucide-react";
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

  return (
    <div className="flex flex-col w-full">
      
      {/* 2x2 Grid 精致排版 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 md:gap-6">
        {products.map((product: any, idx: number) => (
          <div key={idx} className="bg-white rounded-[24px] border border-[#101828]/5 shadow-[0_4px_20px_rgba(16,24,40,0.02)] p-5 md:p-6 flex flex-col sm:flex-row gap-5 md:gap-6 hover:shadow-[0_12px_40px_rgba(16,24,40,0.06)] hover:-translate-y-1 transition-all duration-500">
            
            {/* 左侧：方形商品图 */}
            <div className="w-full sm:w-1/3 max-w-[180px] flex-shrink-0">
              <div className="relative aspect-square w-full rounded-[16px] overflow-hidden bg-[#FAFAFA] border border-[#101828]/5 group">
                <Image 
                  src={getMaterialImage(product.material)} 
                  alt={product.material}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[16px] pointer-events-none"></div>
                {/* 质感编号小标签 */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#101828] text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm border border-white/20">
                  0{idx + 1}
                </div>
              </div>
            </div>
            
            {/* 右侧：高密度精致数据列表 */}
            <div className="flex-1 flex flex-col justify-start pt-1">
              
              {/* 产品名称 */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#101828]/5">
                <h3 className="text-[17px] md:text-[19px] font-black text-[#101828] tracking-tight leading-none">
                  {product.material}
                </h3>
              </div>
              
              {/* 尺寸及阶梯价区块 */}
              <div className="space-y-4 flex-grow">
                {product.sizesList.map((sz: any, i: number) => (
                  <div key={i} className="flex flex-col">
                    
                    {/* 极简尺寸节点 */}
                    <div className="flex items-center text-[10px] font-bold text-[#101828]/50 uppercase tracking-widest mb-1.5 pl-1">
                      <div className="w-1.5 h-1.5 bg-[#101828]/20 rounded-full mr-2"></div>
                      {sz.name}
                    </div>
                    
                    {/* 阶梯价斑马纹数据行 */}
                    <div className="flex flex-col gap-0.5">
                      {sz.tiers.map((tier: any, j: number) => (
                        <div key={j} className="flex justify-between items-center text-[12px] bg-[#FAFAFA]/50 px-2.5 py-1.5 rounded-lg hover:bg-[#F4F8FD] transition-colors group cursor-default">
                          <span className="font-semibold text-[#667085] group-hover:text-blue-700 transition-colors">
                            {tier.quantity.toLocaleString()} <span className="text-[10px] font-normal opacity-60 ml-0.5">pcs</span>
                          </span>
                          <span className="font-black text-[#101828] group-hover:text-blue-700 transition-colors">
                            ${tier.unitPrice.toFixed(3)}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        ))}
      </div>
      
      {/* 底部高级 CTA 按钮 */}
      <div className="mt-14 flex justify-center">
        <Link href="/pricing" className="group relative inline-flex items-center justify-center px-10 py-4 bg-[#101828] text-white rounded-full font-bold uppercase tracking-[0.1em] text-[12px] overflow-hidden hover:shadow-[0_10px_30px_rgba(16,24,40,0.2)] transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#101828] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <Sparkles className="w-4 h-4 mr-2.5 opacity-80 relative z-10" />
          <span className="relative z-10">{lang === 'zh' ? '进入完整国际估价器' : lang === 'tw' ? '進入完整國際估價器' : 'Open Full Estimator'}</span>
          <ArrowRight className="w-4 h-4 ml-2.5 opacity-80 relative z-10 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </div>
  );
}
