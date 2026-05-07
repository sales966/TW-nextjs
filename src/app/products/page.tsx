"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Filter, SlidersHorizontal, Package, Leaf, ArrowRight, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function ProductsPage() {
  const [activeSubcategory, setActiveSubcategory] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?limit=100")
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          setProducts(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  const { t } = useI18n();
  const tp = t.plp;

  return (
    <div className="bg-[#FBFAF7] min-h-screen text-[#101828] font-sans selection:bg-[#EAE8E2]">
      
      <section className="pt-32 pb-24 border-b border-[#101828]/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <h1 className="text-[3.5rem] md:text-[5rem] font-black tracking-tighter mb-6">{tp.title}</h1>
          <p className="text-[18px] text-[#667085] font-medium max-w-2xl leading-[1.8]">{tp.sub}</p>
        </div>
      </section>

      <section className="bg-[#FBFAF7] border-b border-[#101828]/10 sticky top-20 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex overflow-x-auto py-5 gap-8 no-scrollbar">
             <button onClick={() => setActiveSubcategory(0)} className={"whitespace-nowrap pb-1 border-b-2 text-[14px] font-bold tracking-widest uppercase transition-all " + (activeSubcategory === 0 ? "border-[#101828] text-[#101828]" : "border-transparent text-[#667085] hover:text-[#101828]")}>
               {tp.catsAll}
             </button>
             {tp.cats.map((sub, idx) => (
               <button key={idx} onClick={() => setActiveSubcategory(idx + 1)} className={"whitespace-nowrap pb-1 border-b-2 text-[14px] font-bold tracking-widest uppercase transition-all " + (activeSubcategory === idx + 1 ? "border-[#101828] text-[#101828]" : "border-transparent text-[#667085] hover:text-[#101828]")}>
                 {sub}
               </button>
             ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 flex flex-col md:flex-row gap-16">
        
        <aside className="w-full md:w-64 shrink-0 hidden md:block">
           <div className="flex items-center gap-2 font-bold text-[#101828] uppercase tracking-[0.2em] text-[12px] mb-8 border-b border-[#101828]/10 pb-4">
              <SlidersHorizontal className="w-4 h-4" /> {tp.filter}
           </div>
           
           <div className="mb-10">
             <h4 className="font-semibold text-[#101828] mb-4 tracking-tight text-[15px]">{tp.materials}</h4>
             <div className="space-y-4">
               {tp.mats.map(mat => (
                 <label key={mat} className="flex items-center gap-3 cursor-pointer group">
                   <div className="w-4 h-4 border-[1.5px] border-[#101828]/30 rounded-[2px] group-hover:border-[#101828] transition-colors flex items-center justify-center"></div>
                   <span className="text-[#667085] text-[14px] font-medium group-hover:text-[#101828]">{mat}</span>
                 </label>
               ))}
             </div>
           </div>

           <div>
             <h4 className="font-semibold text-[#101828] mb-4 tracking-tight text-[15px]">{tp.eco}</h4>
             <div className="space-y-4">
               {tp.ecos.map(eco => (
                 <label key={eco} className="flex items-center gap-3 cursor-pointer group">
                   <div className="w-4 h-4 border-[1.5px] border-[#101828]/30 rounded-[2px] group-hover:border-[#101828] transition-colors flex items-center justify-center"></div>
                   <span className="text-[#667085] text-[14px] font-medium group-hover:text-[#101828]">{eco}</span>
                 </label>
               ))}
             </div>
           </div>
        </aside>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-10 border-b border-[#101828]/10 pb-6">
            <span className="text-[#667085] text-[15px] font-medium tracking-wide">{tp.showingCount} ({products.length})</span>
            <button className="flex items-center gap-2 text-[13px] font-bold tracking-[0.1em] uppercase text-[#101828]"><Filter className="w-3.5 h-3.5" /> {tp.sort}</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {loading && (
              <div className="col-span-full py-20 flex justify-center text-[#101828]">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            )}
            
            {!loading && products.length === 0 && (
              <div className="col-span-full py-24 text-center border-2 border-dashed border-[#101828]/10 flex flex-col items-center justify-center bg-white">
                <Package className="w-12 h-12 text-[#667085] mb-4 opacity-50" />
                <h3 className="text-[18px] font-bold text-[#101828] mb-2">未找到任何产品</h3>
                <p className="text-[14px] text-[#667085]">后台数据库目前为空，请先前往后台导入数据。</p>
              </div>
            )}

            {!loading && products.map((product) => {
              // 自动处理图片路径（网络图、本地图或占位图）
              const imageSrc = product.featuredImage 
                ? (product.featuredImage.startsWith('http') ? product.featuredImage : `/uploads/${product.featuredImage.split('/').pop()}`)
                : "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop";

              // 从动态属性中提取分类和材质
              const category = product.attributes?.category || product.attributes?.分类 || tp.cardTag;
              const material = product.attributes?.material || product.attributes?.材质 || tp.cardSpec1;

              return (
              <Link href={`/products/${product.id}`} key={product.id} className="group block">
                <div className="aspect-[4/5] bg-[#F6F4EF] mb-6 relative overflow-hidden flex flex-col justify-end p-8 border border-[#101828]/5 shadow-[0_4px_20px_rgba(16,24,40,0.02)]">
                  <Image src={imageSrc} alt={product.name} fill unoptimized sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/40 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                     <span className="bg-[#101828] text-white text-[12px] font-bold tracking-[0.15em] uppercase px-6 py-3">{tp.view}</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold tracking-[0.2em] text-[#667085] uppercase mb-2">{category}</span>
                  <h3 className="text-[20px] font-semibold text-[#101828] tracking-tight mb-2 group-hover:text-amber-700 transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-4 text-[13px] font-medium text-[#667085]">
                    <span className="flex items-center gap-1"><Leaf className="w-3.5 h-3.5" /> {material}</span>
                    {product.attributes?.moq && <span>MOQ: {product.attributes.moq}</span>}
                  </div>
                </div>
              </Link>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
}
