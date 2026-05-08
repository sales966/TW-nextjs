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
      
      {/* 2x2 Grid 排版：左图右文 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {products.map((product: any, idx: number) => (
          <div key={idx} className="bg-white rounded-[20px] border border-[#101828]/5 shadow-sm p-4 md:p-5 flex flex-col sm:flex-row gap-4 md:gap-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            
            {/* 左侧：方形图片 - 限制最大宽度以防过大 */}
            <div className="w-full sm:w-1/3 max-w-[160px] flex-shrink-0">
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAFAFA] border border-[#101828]/5 group">
                <Image 
                  src={getMaterialImage(product.material)} 
                  alt={product.material}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none"></div>
              </div>
            </div>
            
            {/* 右侧：产品名称与价格数据 (波浪线部分) */}
            <div className="flex-1 flex flex-col justify-start">
              
              {/* 产品名称 */}
              <h3 className="text-[16px] md:text-[18px] font-bold text-[#101828] tracking-tight mb-3 pb-2 border-b border-[#101828]/5 flex items-center">
                <div className="w-1 h-4 bg-[#101828] rounded-full mr-2"></div>
                {product.material}
              </h3>
              
              {/* 尺寸及阶梯价列表 */}
              <div className="space-y-4 flex-grow">
                {product.sizesList.map((sz: any, i: number) => (
                  <div key={i} className="flex flex-col">
                    
                    {/* 尺寸名称 */}
                    <div className="flex items-center text-[10px] md:text-[11px] font-bold text-blue-700 uppercase tracking-widest mb-1.5 bg-[#F4F8FD] self-start px-1.5 py-0.5 rounded">
                      <Package className="w-2.5 h-2.5 mr-1 opacity-70" />
                      {sz.name}
                    </div>
                    
                    {/* 阶梯价细目 */}
                    <div className="space-y-0.5 mt-0.5 pl-1 border-l-2 border-[#101828]/[0.03]">
                      {sz.tiers.map((tier: any, j: number) => (
                        <div key={j} className="flex justify-between items-center text-[12px] py-0.5 pl-2 hover:bg-[#FAFAFA] rounded transition-colors group">
                          <span className="font-medium text-[#667085]">
                            {tier.quantity.toLocaleString()} <span className="text-[10px] opacity-70">pcs</span>
                          </span>
                          <span className="font-bold text-[#101828] group-hover:text-blue-600 transition-colors">
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
      
      {/* 底部按钮 */}
      <div className="mt-16 flex justify-center">
        <Link href="/pricing" className="inline-flex items-center justify-center px-10 py-4 bg-[#101828] text-white rounded-full font-bold uppercase tracking-widest text-[13px] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-300">
          <Calculator className="w-4 h-4 mr-2" />
          {lang === 'zh' ? '进入完整国际估价器' : lang === 'tw' ? '進入完整國際估價器' : 'Open Full Estimator'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>

    </div>
  );
}
