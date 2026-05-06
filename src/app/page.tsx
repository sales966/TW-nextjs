"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { DawnBagsOpening } from "@/components/ui/dawn-bags-opening";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollReveal, RevealText, RevealImage } from "@/components/ui/scroll-reveal";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialVisit, setIsInitialVisit] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const { t } = useI18n();
  const th = t.home;

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('dawnbags_intro_seen');
    if (hasSeen) {
      setIsInitialVisit(false);
      setIsLoading(false);
    } else {
      sessionStorage.setItem('dawnbags_intro_seen', 'true');
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="dawn-bags-loader"
            exit={{ opacity: 0 }}
            transition={{ duration: isInitialVisit ? 0.8 : 0.2, ease: "easeInOut" }}
            className="fixed inset-0 z-[99999] bg-[#FBFAF7]"
          >
            {isInitialVisit && <DawnBagsOpening onComplete={() => setIsLoading(false)} />}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="bg-[#F6F4EF] text-[#101828] font-sans selection:bg-[#EAE8E2] min-h-screen">
      
      <div 
        className="pointer-events-none fixed inset-0 z-50 mix-blend-multiply opacity-[0.03]" 
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }}
      ></div>

      {/* 1. Hero */}
      <section className="relative pt-24 lg:pt-32 pb-40 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 max-w-2xl pt-10">
            <RevealText delay={0.1}>
              <div className="mb-14">
                 <span className="text-[12px] md:text-[13px] font-medium tracking-[0.2em] text-[#94A3B8] uppercase">
                   {th.heroTag}
                 </span>
              </div>
            </RevealText>
            <h1 className="flex flex-col mb-10">
              <RevealText delay={0.2}><span className="text-[2.5rem] md:text-[3.5rem] font-light text-[#667085] tracking-tight leading-[1.1] mb-2 block">{th.heroT1}</span></RevealText>
              <RevealText delay={0.3}><span className="text-[4.5rem] md:text-[5.5rem] font-black text-[#101828] tracking-tighter leading-[1.0] block">{th.heroT2}</span></RevealText>
              <RevealText delay={0.4}><span className="text-[3rem] md:text-[4rem] font-semibold text-[#101828]/90 tracking-tight leading-[1.0] mt-1 block">{th.heroT3}</span></RevealText>
            </h1>
            <RevealText delay={0.5}>
              <p className="text-[16px] md:text-[18px] text-[#101828] font-medium mb-12 tracking-wide flex items-center gap-3">
                <span>{th.heroSubD1}</span><span className="text-[#94A3B8]">·</span>
                <span>{th.heroSubD2}</span><span className="text-[#94A3B8]">·</span>
                <span>{th.heroSubD3}</span>
              </p>
            </RevealText>
            <RevealText delay={0.6}>
              <p className="text-[16px] md:text-[17px] text-[#667085] font-normal mb-14 leading-[1.8] max-w-[480px]">
                {th.heroDesc}
              </p>
            </RevealText>
            <RevealText delay={0.7}>
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <Link href="/products" className="w-full sm:w-auto px-10 py-5 bg-[#101828] text-white font-semibold tracking-[0.05em] uppercase text-[14px] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_12px_40px_rgba(16,24,40,0.15)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_15px_50px_rgba(16,24,40,0.25)] text-center rounded-[4px]">
                  {th.heroBtn1}
                </Link>
                <Link href="/quote" className="w-full sm:w-auto px-10 py-5 bg-transparent border-[1.5px] border-[#101828]/10 hover:border-[#101828] text-[#101828] font-semibold tracking-[0.05em] uppercase text-[14px] transition-all duration-500 hover:-translate-y-1 hover:bg-[#101828] hover:text-white text-center rounded-[4px]">
                  {th.heroBtn2}
                </Link>
              </div>
            </RevealText>
          </div>
          
          <RevealImage delay={0.5} className="flex-1 w-full relative lg:h-[750px] h-[500px] flex items-center justify-end">
            <div className="relative w-full h-full max-w-[650px] bg-[#FBFAF7] shadow-[0_40px_100px_rgba(16,24,40,0.06)]">
              <Image src="/images/hero.png" alt="Premium Packaging Mockup" fill className="object-cover object-center" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent mix-blend-multiply pointer-events-none"></div>
            </div>
          </RevealImage>
        </div>
      </section>

      {/* 2. Solutions */}
      <section className="py-40 bg-[#FBFAF7]">
        <ScrollReveal className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <RevealText className="mb-24 md:flex flex-col">
            <h2 className="text-[36px] md:text-[48px] font-bold text-[#101828] tracking-tight mb-6">{th.catTitle}</h2>
            <p className="text-[18px] text-[#667085] font-normal max-w-2xl leading-[1.7]">{th.catSub}</p>
          </RevealText>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {th.cats.map((cat, i) => (
              <Link key={i} href="/products" className="group block text-left">
                <RevealImage delay={i * 0.1}>
                  <div className="aspect-[4/5] bg-[#F6F4EF] mb-8 relative overflow-hidden flex items-center justify-center">
                     <Image src={`/images/home/${['cat_luxury', 'cat_retail', 'cat_eco', 'cat_craft'][i]}.png`} fill alt={cat.t} className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 25vw" />
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none z-20"></div>
                  </div>
                </RevealImage>
                <div className="border-b border-[#101828]/10 pb-6 mb-5">
                  <h3 className="text-[24px] font-semibold text-[#101828] tracking-tight">{cat.t}</h3>
                </div>
                <p className="text-[#667085] text-[16px] leading-[1.7] font-normal">{cat.d}</p>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 3. Philosophy */}
      <section className="py-40 bg-[#EAE8E2] border-t border-[#101828]/5">
        <ScrollReveal className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <RevealText className="max-w-4xl mb-32">
             <span className="text-[12px] font-medium tracking-[0.2em] text-[#667085] uppercase block mb-10">{th.philTag}</span>
             <h2 className="text-[40px] md:text-[64px] font-bold text-[#101828] tracking-tighter leading-[1.1]">{th.philTitle}</h2>
          </RevealText>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-[#101828]/10 pt-16">
            {th.phils.map((p, i) => (
              <RevealText key={i} delay={i * 0.1}>
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-[#101828]/40 mb-8 block font-serif italic">0{i+1}.</span>
                  <h3 className="text-[22px] font-semibold text-[#101828] mb-6 tracking-tight">{p.t}</h3>
                  <p className="text-[#667085] text-[16px] leading-[1.7] font-normal max-w-[90%]">{p.d}</p>
                </div>
              </RevealText>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 4. Archive */}
      <section className="py-40 bg-[#F6F4EF]">
        <ScrollReveal className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <RevealText className="flex flex-col md:flex-row justify-between items-end mb-24">
            <div>
              <h2 className="text-[36px] md:text-[48px] font-bold text-[#101828] tracking-tight mb-6">{th.caseTitle}</h2>
              <p className="text-[18px] text-[#667085] font-normal leading-[1.7]">{th.caseSub}</p>
            </div>
            <Link href="/products" className="hidden md:flex text-[13px] font-bold tracking-[0.1em] uppercase border-b border-[#101828] pb-1 hover:text-[#667085] hover:border-[#667085] transition-colors">
               {th.caseLink}
            </Link>
          </RevealText>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[850px]">
              <RevealImage delay={0.1} className="lg:col-span-8 bg-[#FBFAF7] relative group overflow-hidden flex flex-col justify-end p-12 lg:h-full h-[550px]">
                <div className="absolute inset-0 bg-[#EAE8E2] flex items-center justify-center pointer-events-none z-0">
                   <Image src="/images/cases/case1.jpg" fill alt="Portfolio 1" className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 66vw" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#101828]/50 to-transparent z-10 pointer-events-none transition-opacity duration-700"></div>
                <div className="relative z-20 flex justify-between items-end w-full">
                   <div>
                     <h3 className="text-[32px] font-bold text-white mb-3 tracking-tight">{th.cases[0].t}</h3>
                     <p className="text-white/90 font-medium text-[16px] tracking-wide">{th.cases[0].d}</p>
                   </div>
                   <div className="w-[48px] h-[48px] bg-white text-[#101828] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 cursor-pointer shadow-lg rounded-full">
                     <ArrowRight className="w-5 h-5" strokeWidth={2} />
                   </div>
                </div>
              </RevealImage>
             
             <div className="lg:col-span-4 flex flex-col gap-8 lg:h-full h-auto">
               {[th.cases[1], th.cases[2]].map((c, i) => {
                 const imgName = i === 0 ? "case2_new.jpg" : "case3.jpg";
                 return (
                 <RevealImage key={i} delay={i * 0.2 + 0.2} className="flex-1 bg-[#FBFAF7] relative group overflow-hidden flex flex-col justify-end p-10 min-h-[400px]">
                    <div className="absolute inset-0 bg-[#EAE8E2] flex items-center justify-center pointer-events-none z-0">
                       <Image src={`/images/cases/${imgName}`} fill alt={c.t} className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 33vw" />
                    </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-[#101828]/40 to-transparent z-10 pointer-events-none"></div>
                   <div className="relative z-20">
                     <h3 className="text-[22px] font-bold text-white mb-2 tracking-tight">{c.t}</h3>
                     <p className="text-white/80 text-[14px] font-medium tracking-wide">{c.d}</p>
                   </div>
                 </RevealImage>
                 );
               })}
             </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. Craft */}
      <section className="py-40 bg-[#FBFAF7] border-t border-[#101828]/5">
        <ScrollReveal className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <RevealText className="flex justify-between items-end mb-24 pb-8">
             <h2 className="text-[36px] md:text-[48px] font-bold text-[#101828] tracking-tight">{th.craftTitle}</h2>
             <span className="text-[12px] font-medium tracking-[0.2em] text-[#667085] uppercase hidden md:block">{th.craftTag}</span>
          </RevealText>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 gap-y-16">
            {th.crafts.map((craft, i) => (
              <RevealText key={i} delay={i * 0.1}>
                <div className="group cursor-pointer">
                  <div className="aspect-square bg-[#EAE8E2] mb-10 overflow-hidden relative shadow-[0_4px_24px_rgba(16,24,40,0.02)]">
                     <Image src={`/images/home/${['craft_kraft', 'craft_cardboard', 'craft_foil', 'craft_handles'][i]}.png`} fill alt={craft.n} className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 25vw" />
                     <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay group-hover:opacity-30 transition-opacity duration-700 pointer-events-none z-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"2.5\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\"/%3E%3C/svg%3E')" }}></div>
                  </div>
                  <h3 className="text-[20px] font-semibold mb-4 text-[#101828] tracking-tight">{craft.n}</h3>
                  <p className="text-[#667085] leading-[1.8] text-[15px] max-w-[90%] font-normal">{craft.d}</p>
                </div>
              </RevealText>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 6. Why */}
      <section className="py-40 bg-[#F6F4EF]">
        <ScrollReveal className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <RevealText>
            <h2 className="text-[40px] md:text-[56px] font-bold text-[#101828] tracking-tighter mb-24 max-w-3xl leading-[1.1]">
              {th.whyTitle1} <br/>{th.whyTitle2}
            </h2>
          </RevealText>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
            {th.whys.map((w, i) => (
              <RevealText key={i} delay={i * 0.1}>
                <div className="border-t border-[#101828]/10 pt-10">
                  <span className="text-[#101828] text-[13px] font-semibold tracking-widest mb-6 block font-serif italic">0{i+1}.</span>
                  <h3 className="text-[24px] font-bold text-[#101828] mb-5 tracking-tight">{w.t}</h3>
                  <p className="text-[#667085] leading-[1.8] text-[16px] max-w-lg font-normal">{w.d}</p>
                </div>
              </RevealText>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 7. Flow */}
      <section className="py-40 bg-[#FBFAF7]">
        <ScrollReveal className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <RevealText>
            <h2 className="text-[36px] md:text-[48px] font-bold text-[#101828] tracking-tight mb-32">{th.flowTitle}</h2>
          </RevealText>
          <div className="grid grid-cols-1 md:grid-cols-4 relative gap-16">
            <div className="hidden md:block absolute top-[11.5px] left-0 right-0 h-[1.5px] bg-[#101828]/10 z-0"></div>
            {th.flows.map((step, i) => (
              <RevealText key={i} delay={i * 0.1}>
                <div className="relative z-10 pr-6">
                   <div className="w-[24px] h-[24px] bg-[#FBFAF7] border-[4px] border-[#101828] rounded-full mb-10 shadow-sm"></div>
                   <span className="text-[12px] font-bold text-[#667085] mb-5 block tracking-[0.1em]">PHASE 0{i+1}</span>
                   <h3 className="text-[22px] font-semibold text-[#101828] mb-5">{step.t}</h3>
                   <p className="text-[#667085] text-[15px] leading-[1.8] font-normal">{step.d}</p>
                </div>
              </RevealText>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 8. Sus */}
      <section className="py-40 bg-[#EAE8E2] border-t border-[#101828]/5">
        <ScrollReveal className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between gap-24">
          <RevealText className="max-w-[700px]">
             <h2 className="text-[40px] md:text-[56px] font-black text-[#101828] tracking-tighter leading-[1.1] mb-10">
               {th.susTitleH1}<br/>{th.susTitleH2}
             </h2>
             <p className="text-[18px] text-[#667085] font-medium leading-[1.8] max-w-[550px]">{th.susSub}</p>
          </RevealText>
          <RevealText delay={0.2} className="flex flex-col justify-end w-full md:w-[400px]">
             <ul className="space-y-0 text-[16px] font-medium text-[#101828] border-t border-[#101828]/10">
               {th.susList.map((item, i) => (
                  <li key={i} className="py-6 border-b border-[#101828]/10 flex items-center tracking-wide"><div className="w-1.5 h-1.5 bg-[#101828] rounded-full mr-5"></div>{item}</li>
               ))}
             </ul>
          </RevealText>
        </ScrollReveal>
      </section>

      {/* 9. FAQ */}
      <section className="py-40 bg-[#FBFAF7]">
         <ScrollReveal className="max-w-4xl mx-auto px-6 lg:px-12">
            <RevealText><h2 className="text-[36px] md:text-[48px] font-bold text-[#101828] tracking-tight mb-24">{th.faqTitle}</h2></RevealText>
            <div className="border-t-[1.5px] border-[#101828]/10">
              {th.faqs.map((faq, i) => (
                <RevealText key={i} delay={i * 0.1}>
                  <div className="border-b-[1.5px] border-[#101828]/10 overflow-hidden group">
                    <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="w-full py-10 flex items-center justify-between text-left font-semibold text-[20px] text-[#101828] hover:text-[#667085] transition-colors focus:outline-none">
                       <span className="tracking-tight">{faq.q}</span>
                       <div className="w-10 h-10 border-[1.5px] border-[#101828]/10 flex items-center justify-center rounded-full group-hover:border-[#101828]/30 transition-colors">
                          <Plus className={"w-4 h-4 text-[#101828] transition-transform duration-500 ease-in-out " + (expandedFaq === i ? "rotate-45" : "rotate-0")} strokeWidth={2.5} />
                       </div>
                    </button>
                    <div className={"text-[#667085] text-[16px] font-normal leading-[1.8] transition-all duration-[600ms] cubic-bezier(0.4,0,0.2,1) " + (expandedFaq === i ? "max-h-[800px] opacity-100 pb-12 translate-y-0" : "max-h-0 opacity-0 pb-0 -translate-y-4 pointer-events-none")}>
                       <div className="max-w-[90%]">{faq.a}</div>
                    </div>
                  </div>
                </RevealText>
              ))}
            </div>
         </ScrollReveal>
      </section>

      {/* 10. CTA */}
      <section className="py-[200px] bg-[#F6F4EF] border-t border-[#101828]/5">
        <ScrollReveal className="max-w-[1000px] mx-auto px-6 lg:px-12 text-center">
          <RevealText delay={0.1}>
            <h2 className="text-[4rem] md:text-[6.5rem] font-black text-[#101828] tracking-tighter mb-10 leading-[1.0] capitalize">
              {th.ctaTitle1}<br/>{th.ctaTitle2}
            </h2>
          </RevealText>
          <RevealText delay={0.2}>
            <p className="text-[18px] md:text-[20px] text-[#667085] font-medium mb-24 max-w-[600px] mx-auto leading-[1.8]">
              {th.ctaSub}
            </p>
          </RevealText>
          <RevealText delay={0.3}>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/quote" className="px-14 py-6 bg-[#101828] text-white font-semibold tracking-[0.1em] uppercase text-[15px] shadow-[0_12px_40px_rgba(16,24,40,0.12),inset_0_1px_0_rgba(255,255,255,0.15)] transition-transform duration-500 hover:-translate-y-1 rounded-[4px]">
                {th.ctaBtn1}
              </Link>
              <Link href="/contact" className="px-14 py-6 bg-transparent border-[1.5px] border-[#101828]/20 hover:border-[#101828] text-[#101828] font-semibold tracking-[0.1em] uppercase text-[15px] transition-all duration-500 hover:-translate-y-1 hover:bg-[#101828] hover:text-white rounded-[4px]">
                {th.ctaBtn2}
              </Link>
            </div>
          </RevealText>
        </ScrollReveal>
      </section>

    </div>
    </>
  );
}