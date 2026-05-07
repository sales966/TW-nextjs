"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, t } = useI18n();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FBFAF7]/95 backdrop-blur-xl border-b border-[#101828]/5 transition-all">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo - Thicker & Tighter */}
          <div className="flex items-center gap-3 group cursor-default">
             <div className="w-8 h-8 bg-[#101828] flex items-center justify-center rounded">
               <ShoppingBag className="w-4 h-4 text-white" />
             </div>
             <span className="font-black text-[22px] tracking-tighter text-[#101828] font-sans transition-colors duration-300">
               Dawn<span className="font-medium tracking-tight">Bags</span>
             </span>
          </div>

          {/* Desktop Navigation - Advanced Tracking & Weight */}
          <nav className="hidden lg:flex items-center gap-10 h-full">
            {["home", "products", "pricing", "sustainability", "about", "contact"].map((key) => (
              key === "products" ? (
                <div key={key} className="group flex items-center h-full">
                  <Link href="/products" className="text-[14px] font-medium tracking-[0.02em] text-[#667085] group-hover:text-[#101828] transition-colors duration-300 py-6">
                    {t.nav.products}
                  </Link>

                  {/* Mega Menu */}
                  <div className="absolute top-[80px] left-0 w-full bg-[#101828] text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
                      <div className="grid grid-cols-5 gap-8">
                        {Object.entries(t.megaMenu).map(([categoryKey, category]) => (
                          <div key={categoryKey} className="flex flex-col">
                            <h3 className="font-bold text-[13px] tracking-widest text-[#F0F0F0] uppercase border-b border-white/10 pb-4 mb-6">
                              {category.title}
                            </h3>
                            <ul className="flex flex-col gap-4">
                              {category.items.map((item, idx) => (
                                <li key={idx}>
                                  <Link href={`/products`} className="text-[#98A2B3] hover:text-white text-[13px] tracking-wide transition-colors duration-200">
                                    {item}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={key} href={key === 'home' ? '/' : `/${key}`} className="text-[14px] font-medium tracking-[0.02em] text-[#667085] hover:text-[#101828] transition-colors duration-300">
                  {t.nav[key as keyof typeof t.nav]}
                </Link>
              )
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-8">
            {/* Language Switcher */}
            <div className="relative group flex items-center h-full">
              <div className="flex items-center gap-2 text-[13px] font-medium tracking-wide text-[#667085] group-hover:text-[#101828] transition-colors py-6 cursor-pointer">
                 <Globe className="w-4 h-4" />
                 <span className="uppercase">{lang === 'en' ? 'EN' : lang === 'zh' ? '简体' : '繁體'}</span>
              </div>
              
              <div className="absolute top-[70px] left-1/2 -translate-x-1/2 w-[110px] bg-white border border-[#101828]/5 rounded-md shadow-[0_12px_40px_rgba(16,24,40,0.08)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 z-50">
                <button onClick={() => setLang('en')} className={`text-center px-4 py-2.5 text-[13px] font-medium transition-colors ${lang === 'en' ? 'text-[#101828] bg-[#F6F4EF]' : 'text-[#667085] hover:text-[#101828] hover:bg-[#FBFAF7]'}`}>
                  English
                </button>
                <button onClick={() => setLang('zh')} className={`text-center px-4 py-2.5 text-[13px] font-medium transition-colors ${lang === 'zh' ? 'text-[#101828] bg-[#F6F4EF]' : 'text-[#667085] hover:text-[#101828] hover:bg-[#FBFAF7]'}`}>
                  简体中文
                </button>
                <button onClick={() => setLang('tw')} className={`text-center px-4 py-2.5 text-[13px] font-medium transition-colors ${lang === 'tw' ? 'text-[#101828] bg-[#F6F4EF]' : 'text-[#667085] hover:text-[#101828] hover:bg-[#FBFAF7]'}`}>
                  繁體中文
                </button>
              </div>
            </div>
            <Link href="/quote" className="px-6 py-2.5 bg-transparent border border-[#101828]/10 hover:border-[#101828] text-[#101828] text-[13px] font-semibold tracking-widest uppercase rounded-sm shadow-none transition-all duration-300 hover:bg-[#101828] hover:text-white">
              {t.nav.quote}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <button className="p-2 text-[#101828]" onClick={() => setIsOpen(!isOpen)}>
               {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}