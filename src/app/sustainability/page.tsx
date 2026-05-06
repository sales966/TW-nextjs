"use client";

import Link from "next/link";
import { Leaf, RefreshCcw, Droplet, Wind, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const content = {
  en: {
    heroTag: "ESG & Sustainability",
    heroT1: "Rebuilding the",
    heroT2: "Physical Lifecycle.",
    heroSub: "Real sustainability isn't an afterthought or a marketing gimmick. At Dawn Bags, it is a hardcore engineering constraint built into our raw supply chains and structural blueprints.",
    
    metrics: [
      { num: "95%+", title: "Natural Biodegradability", desc: "Total elimination of toxic adhesives ensures rapid soil breakdown." },
      { num: "100%", title: "Soy & Aqua Inks", desc: "Every CMYK dot is printed purely from plant-based volatile-free inks." },
      { num: "Zero", title: "Non-Degradable Plastics", desc: "Refusing un-recyclable nylon handles and using 100% biodegradable woven paper limits." }
    ],

    matTag: "Material Registry",
    matTitle: "The Foundation of Purity.",
    mats: [
      {
        icon: <Leaf className="w-5 h-5" />,
        t: "FSC® Traceable Fibers",
        d: "We sever ties with illegal logging. Every core bottom gusset board and every sheet of kraft paper is strictly tracked back to certified commercial forests in Europe and South America."
      },
      {
        icon: <Droplet className="w-5 h-5" />,
        t: "Solvent-Free Precision",
        d: "Volatile organic compounds (VOCs) are entirely banned from our press rooms. We utilize expensive water-based adhesion and pure soy inks for luxury finishing."
      },
      {
        icon: <RefreshCcw className="w-5 h-5" />,
        t: "Physical Disintegration",
        d: "Instead of chemical plastic lamination, we rely on heavy physical embossing and raw paper texture layering to achieve premium tactility that can actually biodegrade naturally."
      }
    ],

    lifeTitle: "The Closed-Loop Architecture.",
    lifeSub: "A complete physical roadmap from the forest floor to commercial display, and back into the micro-ecology.",
    lifeSteps: [
       { no: "01", t: "Sourcing", d: "Extraction of renewable timber from managed multi-decade growth zones." },
       { no: "02", t: "Milling", d: "Low-water-impact pulp pressing achieving maximum structural density." },
       { no: "03", t: "Assembly", d: "Zero-plastic folding and non-toxic adhesion on automated matrices." },
       { no: "04", t: "Return", d: "Complete separation and micro-collapse under atmospheric conditions." }
    ],

    ctaTitle: "Transition your brand's",
    ctaTitle2: "Material Baseline.",
    ctaSub: "Audit your current carrier bags and let our ESG material engineers upgrade your physical assets.",
    ctaBtn: "Consult ESG Architect"
  },
  zh: {
    heroTag: "ESG & Sustainability",
    heroT1: "重型纸面传导物下的",
    heroT2: "无限生命长轴。",
    heroSub: "真正的环保决不是随口而弹的营销口号。在 Dawn Bags，它是被强制锁入原始制袋供应链与底层物理折纸蓝图中的——极为硬核的工程约束条件。",
    
    metrics: [
      { num: "95%+", title: "极限无害降解率", desc: "彻底剔除极难剥离的有毒双面胶与劣质粘合底，确保纸袋在土壤微环境下的极速降解。" },
      { num: "100%", title: "全球大豆油墨基底", desc: "拒绝刺激性化学溶剂，每一个 CMYK 网点乃至奢华专色，均为全植物基萃取。" },
      { num: "Zero", title: "绝对零塑料植入", desc: "决不妥协使用泛滥的极难自然降解的尼龙化纤提绳，全面采用原浆复合扭纸绳或棉织绳。" }
    ],

    matTag: "Material Registry",
    matTitle: "绝对纯净的物料底层。",
    mats: [
      {
        icon: <Leaf className="w-5 h-5" />,
        t: "FSC® 溯源原浆池",
        d: "我们全面切断了与无序砍伐供应链的所有联系。每一卷高抗撕高强度的原生纯净底板纸箱，均严苛追溯至拥有国际独立认证的欧洲与南美商业人工林地。"
      },
      {
        icon: <Droplet className="w-5 h-5" />,
        t: "无溶剂高精度组装",
        d: "高挥发性有机化合物（VOCs）在我们几万平米的物理厂房内被绝对禁止。我们投入极高的成本使用水合胶及提取物油墨，确保奢侈级表面处理的安全与环保。"
      },
      {
        icon: <RefreshCcw className="w-5 h-5" />,
        t: "纯粹的提袋物理崩解",
        d: "抛弃传统廉价纸袋赖以维系的不可降解聚酯覆膜及尼龙提绳结构。我们利用超高克重卡纸硬度、天然水胶黏合底托及扭结天然纸绳系带手把去暴力呈现——“能够真正被大自然降解”的高级纸袋触感。"
      }
    ],

    lifeTitle: "工业闭环回收链路。",
    lifeSub: "从原始地表森林的物理截取、跨国商业展示区的流转，最终精确重返微观生态网的完整蓝图。",
    lifeSteps: [
       { no: "01", t: "溯源采伐", d: "从具备几十年生长周期的可溯源商用林区进行严格控制的物理提取。" },
       { no: "02", t: "低耗压接", d: "采用极低水资源消耗的纸浆压接工序，换取物理结构上的极限基底密度。" },
       { no: "03", t: "零塑封装", d: "在超级集成自动化矩阵上，执行零塑料参与的折页弯折与天然水胶压合。" },
       { no: "04", t: "生态回归", d: "大货周期结束后，实现在自然温湿度和堆肥环境下的彻底纸张剥离与微观坍塌。" }
    ],

    ctaTitle: "升级您全系品牌纸袋的",
    ctaTitle2: "材料核心底座。",
    ctaSub: "即刻清查您现有的提袋冗余结构，让拥有丰富经验的 ESG 制袋纸结构工程师为您执行深度的物理资产迭代。",
    ctaBtn: "全线对接 ESG 材料构架师"
  },
  tw: {
    heroTag: "ESG & Sustainability",
    heroT1: "重型紙面傳導物下的",
    heroT2: "無限生命長軸。",
    heroSub: "真正的環保決不是隨口而彈的營銷口號。在 Dawn Bags，它是被強制鎖入原始製袋供應鏈與底層物理折紙藍圖中的——極為硬核的工程約束條件。",
    
    metrics: [
      { num: "95%+", title: "極限無害降解率", desc: "徹底剔除極難剝離的有毒雙面膠與劣質黏合底，確保紙袋在土壤微環境下的極速降解。" },
      { num: "100%", title: "全球大豆油墨基底", desc: "拒絕刺激性化學溶劑，每一個 CMYK 網點乃至奢華專色，均為全植物基萃取。" },
      { num: "Zero", title: "絕對零塑膠植入", desc: "決不妥協使用氾濫的極難自然降解的尼龍化纖提繩，全面採用原漿複合扭紙繩或棉織繩。" }
    ],

    matTag: "Material Registry",
    matTitle: "絕對純淨的物料底層。",
    mats: [
      {
        icon: <Leaf className="w-5 h-5" />,
        t: "FSC® 溯源原漿池",
        d: "我們全面切斷了與無序砍伐供應鏈的所有聯繫。每一卷高抗撕高強度的原生純淨底板紙箱，均嚴苛追溯至擁有國際獨立認證的歐洲與南美商業人工林地。"
      },
      {
        icon: <Droplet className="w-5 h-5" />,
        t: "無溶劑高精度組裝",
        d: "高揮發性有機化合物（VOCs）在我們幾萬平米的物理廠房內被絕對禁止。我們投入極高的成本使用水合膠及提取物油墨，確保奢侈級表面處理的安全與環保。"
      },
      {
        icon: <RefreshCcw className="w-5 h-5" />,
        t: "純粹的提袋物理崩解",
        d: "拋棄傳統廉價紙袋賴以維繫的不可降解聚酯覆膜及尼龍提繩結構。我們利用超高克重卡紙硬度、天然水膠黏合底托及扭結天然紙繩系帶手把去暴力呈現——“能夠真正被大自然降解”的高級紙袋觸感。"
      }
    ],

    lifeTitle: "工業閉環回收鏈路。",
    lifeSub: "從原始地表森林的物理截取、跨國商業展示區的流轉，最終精確重返微觀生態網的完整藍圖。",
    lifeSteps: [
       { no: "01", t: "溯源採伐", d: "從具備幾十年生長週期的可溯源商用林區進行嚴格控制的物理提取。" },
       { no: "02", t: "低耗壓接", d: "採用極低水資源消耗的紙漿壓接工序，換取物理結構上的極限基底密度。" },
       { no: "03", t: "零塑封裝", d: "在超級集成自動化矩陣上，執行零塑膠參與的折頁彎折與天然水膠壓合。" },
       { no: "04", t: "生態回歸", d: "大貨週期結束後，實現在自然溫濕度和堆肥環境下的徹底紙張剝離與微觀坍塌。" }
    ],

    ctaTitle: "升級您全系品牌紙袋的",
    ctaTitle2: "材料核心底座。",
    ctaSub: "即刻清查您現有的提袋冗餘結構，讓擁有豐富經驗的 ESG 製袋紙結構工程師為您執行深度的物理資產迭代。",
    ctaBtn: "全線對接 ESG 材料構架師"
  }
};

export default function SustainabilityPage() {
  const { lang } = useI18n();
  const t = content[lang];

  return (
    <div className="bg-[#FBFAF7] min-h-screen font-sans text-[#101828] selection:bg-[#EAE8E2]">
      
      {/* Visual Noise Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 mix-blend-multiply opacity-[0.03]" 
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }}
      ></div>

      {/* 1. Hero */}
      <section className="pt-32 lg:pt-48 pb-24 lg:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row gap-16 md:items-end">
          <div className="max-w-4xl flex-1">
            <span className="text-[12px] font-bold tracking-[0.2em] text-[#667085] uppercase block mb-10 border-b border-[#101828]/10 pb-4 inline-block">
               {t.heroTag}
            </span>
            <h1 className="text-[3.5rem] md:text-[5.5rem] font-black tracking-tighter leading-[1.0] mb-8">
              <span className="block text-[#101828] mb-2">{t.heroT1}</span>
              <span className="block text-[#667085]">{t.heroT2}</span>
            </h1>
          </div>
          <div className="flex-1 pb-4">
             <p className="text-[18px] md:text-[20px] text-[#101828] font-medium leading-[1.8] max-w-xl pr-8 border-l-[3px] border-[#101828] pl-8">
               {t.heroSub}
             </p>
          </div>
        </div>
      </section>

      {/* 2. Numbers */}
      <section className="py-24 border-y border-[#101828]/5 bg-[#F6F4EF]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
            {t.metrics.map((m, i) => (
              <div key={i} className="flex flex-col relative">
                 <div className="text-[3.5rem] lg:text-[5rem] font-black tracking-tight text-[#101828] mb-2">{m.num}</div>
                 <h4 className="text-[18px] font-bold tracking-tight mb-4 text-[#101828] uppercase">{m.title}</h4>
                 <p className="text-[16px] font-medium leading-[1.8] text-[#667085] max-w-[90%]">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Deep Registry */}
      <section className="py-32 lg:py-48">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-24">
           <div className="lg:w-1/3">
              <span className="text-[12px] font-bold tracking-[0.2em] text-[#667085] uppercase block mb-8">{t.matTag}</span>
              <h2 className="text-[3rem] md:text-[4rem] font-black tracking-tighter leading-[1.0] text-[#101828] sticky top-32">{t.matTitle}</h2>
           </div>
           <div className="lg:w-2/3 flex flex-col gap-16">
              {t.mats.map((m, i) => (
                <div key={i} className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start border-b border-[#101828]/10 pb-16">
                   <div className="w-16 h-16 bg-[#101828] shrink-0 flex items-center justify-center text-[#F6F4EF]">
                      {m.icon}
                   </div>
                   <div>
                     <h3 className="text-[24px] font-bold text-[#101828] tracking-tight mb-5">{m.t}</h3>
                     <p className="text-[#667085] text-[18px] leading-[1.8] font-medium max-w-2xl">{m.d}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 4. Closed Loop */}
      <section className="py-32 lg:py-48 bg-[#101828] text-[#F6F4EF]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-24">
             <h2 className="text-[3rem] md:text-[4.5rem] font-black tracking-tighter leading-[1.05] text-white mb-8">{t.lifeTitle}</h2>
             <p className="text-[18px] text-white/60 font-medium leading-[1.8]">{t.lifeSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
             <div className="hidden md:block absolute top-[28px] left-0 right-0 h-[1.5px] bg-[#F6F4EF]/10 z-0"></div>
             {t.lifeSteps.map((step, i) => (
               <div key={i} className="relative z-10 bg-[#101828] pr-8">
                  <div className="w-[56px] h-[56px] border-[1.5px] border-[#F6F4EF]/20 bg-[#101828] rounded-full mb-10 flex items-center justify-center">
                    <span className="text-[14px] font-bold text-white tracking-widest">{step.no}</span>
                  </div>
                  <h3 className="text-[22px] font-bold text-white mb-4 tracking-tight">{step.t}</h3>
                  <p className="text-white/60 text-[15px] leading-[1.8] font-medium">{step.d}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 5. Target CTA */}
      <section className="py-40 bg-[#FBFAF7] text-center border-t border-[#101828]/5 relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#101828]/[0.02] to-transparent pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
           <h2 className="text-[3rem] md:text-[5rem] font-black tracking-tighter text-[#101828] mb-8 leading-[1.05]">
             {t.ctaTitle} <br/> {t.ctaTitle2}
           </h2>
           <p className="text-xl text-[#667085] font-medium mb-16">{t.ctaSub}</p>
           <Link href="/quote" className="inline-flex px-14 py-6 bg-[#101828] text-white font-bold tracking-[0.1em] uppercase text-[15px] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_40px_rgba(16,24,40,0.15)] transition-transform duration-500 hover:-translate-y-1 rounded-[4px]">
              {t.ctaBtn}
           </Link>
        </div>
      </section>

    </div>
  );
}
