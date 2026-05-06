"use client";

import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Factory, Globe2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const content = {
  en: {
    heroTag: "Industrial Architecture",
    heroT1: "The Global Benchmark",
    heroT2: "In Premium Paper Bags.",
    heroSub: "Behind every Dawn Bags structure lies a synchronized matrix of material sourcing, physical engineering, and mass automated bag-making precision.",
    
    stats: [
      { num: "0.2mm", title: "Die-Cut Tolerance", desc: "Surgical precision across millions of structural joints and folded bag bottoms." },
      { num: "15+", title: "Export Zones", desc: "Full DDP logistics mapping across North America and Europe." },
      { num: "100%", title: "Quality Inspection", desc: "Every functional bespoke paper bag passes through optical QC streams." }
    ],

    coreTag: "Core Infrastructure",
    coreTitle: "Engineered for Commercial Scale.",
    cores: [
      {
        t: "Integrated Matrix Production",
        d: "Eliminating third-party outsourcing. We manage everything from paper pressing, CMYK rotation, to automated foil stamping under a singular controlled industrial roof.",
      },
      {
        t: "Structural Prototyping Lab",
        d: "Before any mass production, our architecture lab outputs 1:1 physical dummies and press proofs to eradicate load-bearing flaws and color drift.",
      },
      {
        t: "Global Sourcing Network",
        d: "We tap directly into massive raw material reservoirs, ensuring absolute cost control and consistency for luxury papers and specialty cardboards.",
      }
    ],

    esgTag: "ESG Framework",
    esgTitle: "Material Responsibility.",
    esgDesc: "We build paper bag ecosystems that respect long-term ecological balance without compromising on premium physical tactility.",
    esgSpecs: [
      { t: "FSC® Certified Core", d: "100% traceable forest paper ensuring no illegal logging enters our supply chain." },
      { t: "Soy & Aqua Inks", d: "Completely eliminating harsh industrial solvents for volatile-free organic printing." },
      { t: "Zero-Plastic Mandate", d: "We engineer structural bottom gussets and handles without relying on non-degradable synthetics." }
    ],

    ctaTitle: "Tour Our Capabilities.",
    ctaSub: "Initiate a dialogue with our senior factory architects.",
    ctaBtn: "Connect with Engineering"
  },
  zh: {
    heroTag: "Industrial Bag Architecture",
    heroT1: "全球标准",
    heroT2: "高端纸袋定制。",
    heroSub: "每一个 Dawn Bags 高端纸袋的背后，都有赖于我们完善的供应链、成熟的工程团队以及高度自动化的精密生产线。",
    
    stats: [
      { num: "0.2mm", title: "精密模切公差", desc: "在大批量生产中始终保持严苛的模切精度，确保纸袋折叠平整完美。" },
      { num: "15+", title: "全球贸易出口", desc: "提供覆盖北美与欧洲核心市场的成熟 DDP 门到门物流解决方案。" },
      { num: "100%", title: "全面质量检验", desc: "每一只高价值零售提袋均需经过严格的标准化全检流程出厂。" }
    ],

    coreTag: "Core Infrastructure",
    coreTitle: "为商业规模量身打造。",
    cores: [
      {
        t: "一站式自有工厂生产",
        d: "从原纸采购、海德堡印刷机进行 CMYK 印刷，到全自动覆膜、烫金与压纹工艺，全部环节均在我们自有的无尘车间内高效完成。",
      },
      {
        t: "专业打样与测试",
        d: "在大批量生产前，我们的工程团队会为您提供 1:1 的实物白样以及打样测试。通过严格的校色与承重检验，确保最终大货品质的万无一失。",
      },
      {
        t: "全球优质原材料",
        d: "凭借大规模采购的优势，我们直接与源头纸厂合作，确保高端特种纸张的品质稳定，并为客户提供极具竞争力的价格。",
      }
    ],

    esgTag: "ESG Framework",
    esgTitle: "可持续发展承诺。",
    esgDesc: "我们致力于打造绿色环保的纸质包装方案。在追求极致质感的同时，坚持长期的生态平衡理念。",
    esgSpecs: [
      { t: "FSC® 认证纸张", d: "使用 100% 可追溯的 FSC® 认证环保纸张，确保我们的材料来源合法、环保。" },
      { t: "环保大豆油墨", d: "采用安全的无溶剂大豆环保油墨，减少挥发性有机物，保障印刷过程与产品的双重环保。" },
      { t: "无塑环保方案", d: "利用环保纸绳或高品质棉绳替代传统的化纤提绳与塑料胶带，致力于实现包装的自然降解。" }
    ],

    ctaTitle: "开启定制之旅。",
    ctaSub: "联系我们的资深包装顾问，获取专属设计建议与出厂报价。",
    ctaBtn: "联系业务团队"
  },
  tw: {
    heroTag: "Industrial Bag Architecture",
    heroT1: "全球標準",
    heroT2: "高端紙袋客製。",
    heroSub: "每一個 Dawn Bags 高端紙袋的背後，都有賴於我們完善的供應鏈、成熟的工程團隊以及高度自動化的精密生產線。",
    
    stats: [
      { num: "0.2mm", title: "精密模切公差", desc: "在大批量生產中始終保持嚴苛的模切精度，確保紙袋折疊平整完美。" },
      { num: "15+", title: "全球貿易出口", desc: "提供覆蓋北美與歐洲核心市場的成熟 DDP 門到門物流解決方案。" },
      { num: "100%", title: "全面質量檢驗", desc: "每一只高價值零售提袋均需經過嚴格的標準化全檢流程出廠。" }
    ],

    coreTag: "Core Infrastructure",
    coreTitle: "為商業規模量身打造。",
    cores: [
      {
        t: "一站式自有工廠生產",
        d: "從原紙採購、海德堡印刷機進行 CMYK 印刷，到全自動覆膜、燙金與壓紋工藝，全部環節均在我們自有的無塵車間內高效完成。",
      },
      {
        t: "專業打樣與測試",
        d: "在大批量生產前，我們的工程團隊會為您提供 1:1 的實物白樣以及打樣測試。透過嚴格的校色與承重檢驗，確保最終大貨品質的萬無一失。",
      },
      {
        t: "全球優質原物料",
        d: "憑藉大規模採購的優勢，我們直接與源頭紙廠合作，確保高端特種紙張的品質穩定，並為客戶提供極具競爭力的價格。",
      }
    ],

    esgTag: "ESG Framework",
    esgTitle: "永續發展承諾。",
    esgDesc: "我們致力於打造綠色環保的紙質包裝方案。在追求極致質感的同時，堅持長期的生態平衡理念。",
    esgSpecs: [
      { t: "FSC® 認證紙張", d: "使用 100% 可追溯的 FSC® 認證環保紙張，確保我們的材料來源合法、環保。" },
      { t: "環保大豆油墨", d: "採用安全的無溶劑大豆環保油墨，減少揮發性有機物，保障印刷過程與產品的雙重環保。" },
      { t: "無塑環保方案", d: "利用環保紙繩或高品質棉繩替代傳統的化纖提繩與塑膠膠帶，致力於實現包裝的自然降解。" }
    ],

    ctaTitle: "開啟客製之旅。",
    ctaSub: "聯繫我們的資深包裝顧問，獲取專屬設計建議與出廠報價。",
    ctaBtn: "聯繫業務團隊"
  }
};

export default function AboutPage() {
  const { lang } = useI18n();
  const t = content[lang];

  return (
    <div className="bg-[#FBFAF7] min-h-screen font-sans text-[#101828] selection:bg-[#EAE8E2]">
      
      <div 
        className="pointer-events-none fixed inset-0 z-50 mix-blend-multiply opacity-[0.03]" 
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }}
      ></div>

      {/* 1. Hero */}
      <section className="pt-32 lg:pt-48 pb-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="max-w-4xl">
            <span className="text-[12px] font-bold tracking-[0.2em] text-[#667085] uppercase block mb-10">
               {t.heroTag}
            </span>
            <h1 className="text-[3.5rem] md:text-[5rem] lg:text-[6rem] font-black tracking-tighter leading-[1.0] mb-12">
              <span className="block text-[#101828] mb-2">{t.heroT1}</span>
              <span className="block text-[#667085]">{t.heroT2}</span>
            </h1>
            <p className="text-[18px] md:text-[20px] text-[#101828] font-medium leading-[1.8] max-w-2xl">
              {t.heroSub}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Bold Stats */}
      <section className="py-0">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="bg-[#101828] text-[#F6F4EF] p-12 lg:p-24 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 rounded-[4px]">
            {t.stats.map((s, i) => (
              <div key={i} className="flex flex-col">
                 <span className="text-[3rem] lg:text-[4rem] font-black tracking-tighter text-white mb-4">{s.num}</span>
                 <h4 className="text-[18px] font-bold tracking-tight mb-4 text-[#F6F4EF]">{s.title}</h4>
                 <p className="text-[15px] font-medium leading-[1.8] text-white/50">{s.desc}</p>
                 <div className="mt-8 border-b border-white/10 w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Core Framework */}
      <section className="py-40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24 border-b border-[#101828]/10 pb-20">
             <div className="max-w-xl">
               <span className="text-[12px] font-bold tracking-[0.2em] text-[#667085] uppercase block mb-10">{t.coreTag}</span>
               <h2 className="text-[3rem] md:text-[4rem] font-black tracking-tighter leading-[1.05] text-[#101828]">{t.coreTitle}</h2>
             </div>
             <div className="w-[120px] h-[120px] lg:w-[200px] lg:h-[200px] border-[10px] md:border-[16px] border-[#101828] rounded-full shrink-0 flex items-center justify-center">
                <div className="w-1/2 h-1/2 border-[2px] border-[#101828] rounded-full"></div>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
             {t.cores.map((c, i) => (
               <div key={i} className="flex flex-col relative group">
                 <div className="mb-8 w-12 h-12 bg-[#F6F4EF] flex items-center justify-center transform group-hover:bg-[#101828] transition-colors duration-500">
                    <Factory className="w-5 h-5 text-[#101828] group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
                 </div>
                 <h3 className="text-[22px] font-bold text-[#101828] tracking-tight mb-5">{c.t}</h3>
                 <p className="text-[#667085] text-[16px] leading-[1.8] font-normal">{c.d}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. ESG Section */}
      <section className="py-40 bg-[#F6F4EF] border-t border-[#101828]/5 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#EAE8E2]/50 pointer-events-none hidden lg:block"></div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row gap-24">
          
          <div className="flex-1 max-w-xl">
            <span className="text-[12px] font-bold tracking-[0.2em] text-[#667085] uppercase block mb-10">{t.esgTag}</span>
            <h2 className="text-[3rem] md:text-[4rem] font-black tracking-tighter leading-[1.05] text-[#101828] mb-8">{t.esgTitle}</h2>
            <p className="text-[18px] text-[#667085] font-medium leading-[1.8] mb-12">{t.esgDesc}</p>
          </div>
          
          <div className="flex-1 pt-4 lg:pt-24 space-y-12">
            {t.esgSpecs.map((s, i) => (
              <div key={i} className="flex gap-6 items-start border-b border-[#101828]/10 pb-10">
                 <div className="shrink-0 mt-1">
                    <Leaf className="w-6 h-6 text-[#101828]" />
                 </div>
                 <div>
                   <h3 className="text-[20px] font-bold text-[#101828] tracking-tight mb-3">{s.t}</h3>
                   <p className="text-[#667085] text-[15px] leading-[1.8] font-normal">{s.d}</p>
                 </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-40 bg-[#101828] text-center">
        <div className="max-w-4xl mx-auto px-6">
           <h2 className="text-[3rem] md:text-[5rem] font-black tracking-tighter text-white mb-8">{t.ctaTitle}</h2>
           <p className="text-xl text-white/60 mb-20">{t.ctaSub}</p>
           <Link href="/quote" className="inline-flex px-14 py-6 bg-white text-[#101828] font-bold tracking-[0.1em] uppercase text-[15px] shadow-[0_12px_40px_rgba(255,255,255,0.1)] transition-transform duration-500 hover:-translate-y-1 rounded-[4px]">
              {t.ctaBtn}
           </Link>
        </div>
      </section>

    </div>
  );
}
