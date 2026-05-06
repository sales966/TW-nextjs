"use client";

import Link from "next/link";
import { Mail, MessageSquare, Globe2, Clock, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const content = {
  en: {
    heroTag: "Contact Us",
    heroT1: "Get in",
    heroT2: "Touch.",
    heroSub: "Our team is ready to assist you with custom packaging solutions, pricing, and structural design.",
    
    emailT: "Email Us",
    emailAdd: "morningbeachtw@gmail.com",
    emailD: "For custom quotes and structural inquiries.",
    
    whT: "Direct Call / Message",
    whD: "Phone / WhatsApp / LINE",
    whCN: "+86-199-2872-4976 (China)",
    whTW1: "+886-7-345-0928 (Taiwan)",
    whTW2: "+886-963-581-855 (Mobile)",
    
    geoT: "Office & Factory Locations",
    geoCNName: "Shenzhen Tianwen Printing Packaging Co., Ltd.",
    geoCNAdd: "3F, Bldg 1, Yingguan Industrial Park, No.16 Hutian Rd, Pinghu, Longgang, Shenzhen, China",
    geoTWName: "Morning Beach Co., Ltd. (Tax ID: 89188386)",
    geoTWAdd: "No. 3, Aly. 6, Ln. 377, Lida Rd., Zuoying Dist., Kaohsiung City, Taiwan (By Appointment)",
    
    timeT: "Business Hours",
    timeD: "Monday — Friday, 9:00 AM – 6:00 PM",
    timeD2: "We typically respond within 24 hours.",
    
    ctaT: "Request Factory Specs.",
    ctaD: "Submit your basic paper carrier parameters. Our matrix will calculate exact material drops and production costs within 2 hours.",
    ctaLi1: "Mandatory structural prototyping",
    ctaLi2: "Total customization of handles & weights",
    ctaLi3: "FSC® material base scaling",
    ctaBtn: "Connect to Engineers"
  },
  zh: {
    heroTag: "联系我们",
    heroT1: "开启您的",
    heroT2: "专属包装定制",
    heroSub: "我们拥有完善的生产与供应链网络。请通过以下方式联系我们的业务团队，获取精准的出厂报价及包装结构设计建议。",
    
    emailT: "业务联络信箱",
    emailAdd: "morningbeachtw@gmail.com",
    emailD: "获取包装报价、提供设计图档或商务合作咨询。",
    
    whT: "即时通讯与热线",
    whD: "Phone / WhatsApp / LINE",
    whCN: "+86-199-2872-4976 (China)",
    whTW1: "+886-7-345-0928 (Taiwan)",
    whTW2: "+886-963-581-855 (Mobile)",
    
    geoT: "公司与生产基地",
    geoCNName: "深圳天文印刷包装有限公司",
    geoCNAdd: "广东省深圳市龙岗区平湖镇峨公岭湖田路16号盈冠工业园1栋3楼",
    geoTWName: "明日岛屿有限公司 (统编｜89188386)",
    geoTWAdd: "台湾高雄市左营区立大路377巷6弄3号 (来访请先预约)",
    
    timeT: "营业时间",
    timeD: "周一至周五，上午 9:00 至下午 6:00",
    timeD2: "我们通常在 24 小时内回覆。",
    
    ctaT: "获取出厂报价单",
    ctaD: "请提供您的纸袋尺寸、材质与提手需求。我们的团队将在 2 个工作小时内为您核算并提供详细的出厂报价单。",
    ctaLi1: "大货生产前提供实物打样与承重测试",
    ctaLi2: "支持所有非常规尺寸、版型与特种克重定制",
    ctaLi3: "提供 FSC® 环保认证纸张及无塑环保方案",
    ctaBtn: "填写报价表单"
  },
  tw: {
    heroTag: "聯絡我們",
    heroT1: "開啟您的",
    heroT2: "專屬包裝客製",
    heroSub: "我們擁有完善的生產與供應鏈網絡。請透過以下方式聯繫我們的業務團隊，獲取精準的出廠報價及包裝結構設計建議。",
    
    emailT: "業務聯絡信箱",
    emailAdd: "morningbeachtw@gmail.com",
    emailD: "獲取包裝報價、提供設計圖檔或商務合作諮詢。",
    
    whT: "即時通訊與熱線",
    whD: "Phone / WhatsApp / LINE",
    whCN: "+86-199-2872-4976 (China)",
    whTW1: "+886-7-345-0928 (Taiwan)",
    whTW2: "+886-963-581-855 (Mobile)",
    
    geoT: "公司與生產基地",
    geoCNName: "深圳天文印刷包裝有限公司",
    geoCNAdd: "廣東省深圳市龍崗區平湖鎮峨公嶺湖田路16號盈冠工業園1棟3樓",
    geoTWName: "明日島嶼有限公司 (統編｜89188386)",
    geoTWAdd: "台灣高雄市左營區立大路377巷6弄3號 (來訪請先預約)",
    
    timeT: "營業時間",
    timeD: "週一至週五，上午 9:00 至下午 6:00",
    timeD2: "我們通常在 24 小時內回覆。",
    
    ctaT: "獲取出廠報價單",
    ctaD: "請提供您的紙袋尺寸、材質與提手需求。我們的團隊將在 2 個工作小時內為您核算並提供詳細的出廠報價單。",
    ctaLi1: "大貨生產前提供實物打樣與承重測試",
    ctaLi2: "支援所有非常規尺寸、版型與特種克重客製",
    ctaLi3: "提供 FSC® 環保認證紙張及無塑環保方案",
    ctaBtn: "填寫報價表單"
  }
};

export default function ContactPage() {
  const { lang } = useI18n();
  const t = content[lang];

  return (
    <div className="bg-[#FBFAF7] min-h-screen font-sans text-[#101828] selection:bg-[#EAE8E2]">
      
      {/* Background Noise Component */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 mix-blend-multiply opacity-[0.03]" 
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }}
      ></div>

      <section className="pt-32 lg:pt-48 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          
          <div className="max-w-4xl mb-24">
            <span className="text-[12px] font-bold tracking-[0.2em] text-[#667085] uppercase block mb-10">
               {t.heroTag}
            </span>
            <h1 className="text-[3.5rem] md:text-[5rem] lg:text-[6rem] font-black tracking-tighter leading-[1.0] mb-8">
              <span className="block text-[#101828] mb-2">{t.heroT1}</span>
              <span className="block text-[#667085]">{t.heroT2}</span>
            </h1>
            <p className="text-[18px] md:text-[20px] text-[#101828] font-medium leading-[1.8] max-w-2xl">
              {t.heroSub}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start pb-24">
             {/* Left Column: Direct Contacts */}
             <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                
                {/* Email */}
                <div className="flex flex-col">
                   <div className="w-12 h-12 flex items-center justify-center bg-[#101828] rounded mb-6">
                      <Mail className="w-5 h-5 text-[#F6F4EF]" />
                   </div>
                   <h3 className="text-[18px] font-bold text-[#101828] tracking-tight mb-2">{t.emailT}</h3>
                   <p className="text-[#667085] text-[14px] leading-[1.6] font-medium mb-4 h-10">{t.emailD}</p>
                   <a href={`mailto:${t.emailAdd}`} className="text-[15px] font-bold text-[#101828] border-b-2 border-[#101828] pb-1 hover:text-[#667085] hover:border-[#667085] transition-colors self-start">
                     {t.emailAdd}
                   </a>
                </div>

                {/* WhatsApp / Phone */}
                <div className="flex flex-col">
                   <div className="w-12 h-12 flex items-center justify-center bg-[#101828] rounded mb-6">
                      <MessageSquare className="w-5 h-5 text-[#F6F4EF]" />
                   </div>
                   <h3 className="text-[18px] font-bold text-[#101828] tracking-tight mb-2">{t.whT}</h3>
                   <p className="text-[#667085] text-[14px] leading-[1.6] font-medium mb-4">{t.whD}</p>
                   <div className="flex flex-col gap-2 mt-auto">
                     <a href="tel:+8619928724976" className="text-[14px] font-bold text-[#101828] hover:text-[#667085] transition-colors">{t.whCN}</a>
                     <a href="tel:+88673450928" className="text-[14px] font-bold text-[#101828] hover:text-[#667085] transition-colors">{t.whTW1}</a>
                     <a href="tel:+886963581855" className="text-[14px] font-bold text-[#101828] hover:text-[#667085] transition-colors">{t.whTW2}</a>
                   </div>
                </div>

                {/* Locations */}
                <div className="flex flex-col col-span-1 md:col-span-2 border-t border-[#101828]/10 pt-10">
                   <div className="w-12 h-12 flex items-center justify-center bg-[#101828] rounded mb-6">
                      <Globe2 className="w-5 h-5 text-[#F6F4EF]" />
                   </div>
                   <h3 className="text-[18px] font-bold text-[#101828] tracking-tight mb-8">{t.geoT}</h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                       <span className="text-[12px] font-bold text-[#667085] uppercase tracking-wider mb-3 block">China</span>
                       <span className="text-[15px] font-bold text-[#101828] block mb-2">{t.geoCNName}</span>
                       <p className="text-[#667085] text-[14px] leading-[1.7] font-medium pr-4">{t.geoCNAdd}</p>
                     </div>
                     <div>
                       <span className="text-[12px] font-bold text-[#667085] uppercase tracking-wider mb-3 block">Taiwan</span>
                       <span className="text-[15px] font-bold text-[#101828] block mb-2">{t.geoTWName}</span>
                       <p className="text-[#667085] text-[14px] leading-[1.7] font-medium pr-4">{t.geoTWAdd}</p>
                     </div>
                   </div>
                </div>

                {/* Business Hours */}
                <div className="flex flex-col col-span-1 md:col-span-2 border-t border-[#101828]/10 pt-10">
                   <div className="w-12 h-12 flex items-center justify-center bg-[#101828] rounded mb-6">
                      <Clock className="w-5 h-5 text-[#F6F4EF]" />
                   </div>
                   <h3 className="text-[18px] font-bold text-[#101828] tracking-tight mb-3">{t.timeT}</h3>
                   <span className="text-[15px] font-bold text-[#101828] block mb-2">
                     {t.timeD}
                   </span>
                   <p className="text-[#667085] text-[14px] leading-[1.6] font-medium">
                     {t.timeD2}
                   </p>
                </div>

             </div>

             {/* Right Column: CTA Request Form Hub */}
             <div className="lg:w-1/2 w-full">
                <div className="bg-[#101828] p-10 md:p-14 text-[#F6F4EF] rounded-[4px] relative overflow-hidden">
                   {/* Abstract background shape */}
                   <div className="absolute -bottom-20 -right-20 w-64 h-64 border-[40px] border-white/5 rounded-full pointer-events-none"></div>

                   <h2 className="text-[2rem] md:text-[2.5rem] font-black tracking-tight leading-[1.1] mb-6 relative z-10">
                     {t.ctaT}
                   </h2>
                   <p className="text-[16px] text-white/60 font-medium leading-[1.8] mb-10 relative z-10">
                     {t.ctaD}
                   </p>

                   <ul className="space-y-4 mb-12 relative z-10">
                      <li className="flex gap-4 items-start">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#F6F4EF] mt-2 shrink-0"></div>
                         <span className="font-medium text-[15px] text-white/80">{t.ctaLi1}</span>
                      </li>
                      <li className="flex gap-4 items-start">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#F6F4EF] mt-2 shrink-0"></div>
                         <span className="font-medium text-[15px] text-white/80">{t.ctaLi2}</span>
                      </li>
                      <li className="flex gap-4 items-start">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#F6F4EF] mt-2 shrink-0"></div>
                         <span className="font-medium text-[15px] text-white/80">{t.ctaLi3}</span>
                      </li>
                   </ul>

                   <Link href="/quote" className="inline-flex w-full md:w-auto items-center justify-center bg-white text-[#101828] px-10 py-5 text-[14px] font-bold uppercase tracking-[0.1em] hover:bg-[#EAE8E2] transition-colors relative z-10 rounded-[2px]">
                      {t.ctaBtn}
                   </Link>
                </div>
             </div>
          </div>

        </div>
      </section>

    </div>
  );
}
