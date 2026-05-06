"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ArrowRight, PackageOpen, Layers, Zap, Clock, Loader2 } from "lucide-react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { t } = useI18n();
  const td = t.pdp;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetch(`/api/products/${slug}`)
        .then(res => res.json())
        .then(data => {
          if(data.success) {
            setProduct(data.data);
            setActiveImage(data.data.featuredImage || (data.data.media && data.data.media[0]) || null);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFAF7] text-[#101828]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFAF7] text-[#101828]">
        <h2 className="text-2xl font-bold">该产品不存在或已下架</h2>
      </div>
    );
  }
  
  return (
    <div className="bg-[#FBFAF7] min-h-screen font-sans text-[#101828] selection:bg-[#EAE8E2]">
      
      <div className="border-b border-[#101828]/10 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6">
          <Link href="/products" className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.2em] uppercase text-[#667085] hover:text-[#101828] transition-colors">
            <ChevronLeft className="w-4 h-4" /> {td.back}
          </Link>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24 flex flex-col xl:flex-row gap-16 lg:gap-24">
        
        <div className="flex-1 space-y-6">
           {/* 大图展示区 */}
           <div className="aspect-square bg-[#F6F4EF] w-full relative flex items-center justify-center overflow-hidden border border-[#101828]/5 shadow-[0_10px_40px_rgba(16,24,40,0.03)] group">
              <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-500" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"2\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\"/%3E%3C/svg%3E')" }}></div>
              {activeImage ? (
                 <Image 
                    src={activeImage.startsWith('http') ? activeImage : `/uploads/${activeImage.split('/').pop()}`} 
                    alt={product.name} 
                    fill 
                    className="object-cover" 
                 />
              ) : (
                <PackageOpen className="w-48 h-48 text-[#101828]/20" strokeWidth={0.5} />
              )}
           </div>
           
           {/* 细节缩略图渲染 */}
           {(() => {
             const rawImages = [product.featuredImage, ...(product.media || [])].filter(Boolean);
             const allImages = Array.from(new Set(rawImages));
             
             if (allImages.length <= 1) return null; // 只有一张图时不需要缩略图栏

             return (
               <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                 {allImages.map((img: string, i: number) => {
                   const isActive = activeImage === img;
                   return (
                     <div 
                       key={i} 
                       onMouseEnter={() => setActiveImage(img)}
                       className={`aspect-square bg-white relative overflow-hidden cursor-pointer transition-all duration-200 border-2 ${isActive ? 'border-[#101828]' : 'border-transparent hover:border-[#101828]/30 shadow-sm'}`}
                     >
                        <Image 
                          src={img.startsWith('http') ? img : `/uploads/${img.split('/').pop()}`} 
                          alt={`${product.name} 视图 ${i+1}`} 
                          fill 
                          className="object-cover" 
                        />
                     </div>
                   );
                 })}
               </div>
             );
           })()}
        </div>

        <div className="flex-[0.8] lg:pt-10">
           <div className="mb-6 border-b border-[#101828]/10 pb-8">
             <span className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#667085] mb-4 block">
               {product.attributes?.category || product.attributes?.分类 || td.mockCat}
             </span>
             <h1 className="text-[36px] lg:text-[48px] font-black tracking-tighter leading-[1.1] mb-6">
               {product.name}
             </h1>
             <p className="text-[#667085] text-[18px] font-medium leading-[1.8]">
               {product.aiSummary || product.attributes?.description || td.mockDesc}
             </p>
           </div>

           <div className="mb-16">
             <h3 className="text-[14px] font-bold uppercase tracking-[0.1em] text-[#101828] mb-6">{td.spec}</h3>
             <div className="grid grid-cols-2 gap-8">
               <div>
                  <span className="flex items-center gap-2 text-[12px] font-bold text-[#667085] uppercase tracking-widest mb-2"><Layers className="w-3.5 h-3.5" /> {td.mat}</span>
                  <p className="font-semibold text-[#101828] text-[16px]">{product.material || product.attributes?.material || td.mockMatVal}</p>
               </div>
               <div>
                  <span className="flex items-center gap-2 text-[12px] font-bold text-[#667085] uppercase tracking-widest mb-2"><Zap className="w-3.5 h-3.5" /> {td.fin}</span>
                  <p className="font-semibold text-[#101828] text-[16px]">{product.printing || product.attributes?.printing || td.mockFinVal}</p>
               </div>
               <div>
                  <span className="flex items-center gap-2 text-[12px] font-bold text-[#667085] uppercase tracking-widest mb-2"><PackageOpen className="w-3.5 h-3.5" /> {td.moq}</span>
                  <p className="font-semibold text-[#101828] text-[16px]">{product.moq || product.attributes?.moq || td.mockMoqVal} {product.attributes?.unit || '个'}</p>
               </div>
               <div>
                  <span className="flex items-center gap-2 text-[12px] font-bold text-[#667085] uppercase tracking-widest mb-2"><Clock className="w-3.5 h-3.5" /> {td.lead}</span>
                  <p className="font-semibold text-[#101828] text-[16px]">{product.attributes?.leadTime || product.attributes?.生产周期 || td.mockLeadVal}</p>
               </div>
             </div>
           </div>

           <div className="bg-white border-[1.5px] border-[#101828] p-8 lg:p-10 shadow-[0_20px_60px_rgba(16,24,40,0.04)]">
             <h3 className="text-[20px] font-bold tracking-tight mb-3">{td.formT}</h3>
             <p className="text-[14px] text-[#667085] font-medium mb-8 leading-[1.8]">{td.formS}</p>
             <form className="space-y-5">
               <div className="grid grid-cols-2 gap-5">
                 <input type="text" placeholder={t.quote.fname} className="w-full bg-[#F6F4EF] p-4 text-[14px] font-medium border border-transparent focus:outline-none focus:border-[#101828] transition-colors" />
                 <input type="email" placeholder={t.quote.email} className="w-full bg-[#F6F4EF] p-4 text-[14px] font-medium border border-transparent focus:outline-none focus:border-[#101828] transition-colors" />
               </div>
               <input type="text" placeholder={t.quote.qty} className="w-full bg-[#F6F4EF] p-4 text-[14px] font-medium border border-transparent focus:outline-none focus:border-[#101828] transition-colors" />
               <button type="submit" className="w-full py-5 bg-[#101828] text-white font-semibold tracking-[0.1em] uppercase text-[14px] shadow-[0_12px_40px_rgba(16,24,40,0.12),inset_0_1px_0_rgba(255,255,255,0.15)] transition-transform duration-500 hover:-translate-y-1">
                 {td.reqQuote}
               </button>
             </form>
           </div>

        </div>
      </div>
      <div className="h-20"></div>
    </div>
  );
}
