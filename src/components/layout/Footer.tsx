"use client";

import Link from "next/link";
import { ShoppingBag, Globe, Mail, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const pathname = usePathname();
  const { t } = useI18n();
  const tf = t.footer;

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#101828] text-white/60 py-24 border-t border-white/5 font-sans relative overflow-hidden">
      <div 
        className="pointer-events-none absolute inset-0 z-0 mix-blend-overlay opacity-[0.05]" 
        style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"1.5\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }}
      ></div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-10 mb-20">
          
          <div className="lg:col-span-2 pr-0 lg:pr-16">
            <Link href="/" className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-white flex items-center justify-center rounded-[2px]">
                 <ShoppingBag className="w-5 h-5 text-[#101828]" strokeWidth={2.5} />
              </div>
              <span className="font-black text-[28px] tracking-tighter text-white">
                Dawn<span className="font-medium tracking-tight">Bags</span>
              </span>
            </Link>
            <p className="text-white/50 text-[15px] mb-10 max-w-sm leading-[1.8] font-medium">
              {tf.desc}
            </p>

          </div>
          
          <div>
            <h4 className="text-white font-bold mb-8 text-[12px] uppercase tracking-[0.2em]">{tf.pTitle}</h4>
            <ul className="space-y-5 text-[15px] font-medium">
              <li><Link href="/products?category=gift-bags" className="hover:text-white transition-colors">{tf.p1}</Link></li>
              <li><Link href="/products?category=kraft-bags" className="hover:text-white transition-colors">{tf.p2}</Link></li>
              <li><Link href="/products?category=cardboard-bags" className="hover:text-white transition-colors">{tf.p3}</Link></li>
              <li><Link href="/products?category=takeaway-bags" className="hover:text-white transition-colors">{tf.p4}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-8 text-[12px] uppercase tracking-[0.2em]">{tf.rTitle}</h4>
            <ul className="space-y-5 text-[15px] font-medium">
              <li><Link href="/resources/sizes" className="hover:text-white transition-colors">{tf.r1}</Link></li>
              <li><Link href="/resources/materials" className="hover:text-white transition-colors">{tf.r2}</Link></li>
              <li><Link href="/resources/handles" className="hover:text-white transition-colors">{tf.r3}</Link></li>
              <li><Link href="/resources/eco-report" className="hover:text-white transition-colors">{tf.r4}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 text-[12px] uppercase tracking-[0.2em]">{tf.cTitle}</h4>
            <ul className="space-y-5 text-[15px] font-medium">
              <li><Link href="/about" className="hover:text-white transition-colors">{tf.c1}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{tf.c2}</Link></li>
              <li><Link href="/quote" className="hover:text-white transition-colors">{tf.c3}</Link></li>
              <li><Link href="/about#factory" className="hover:text-white transition-colors">{tf.c4}</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-[13px] font-semibold tracking-wide">
          <p>© {new Date().getFullYear()} {tf.rights}</p>
          <div className="flex gap-8">
            <Link href="/privacy-policy" className="hover:text-white transition-colors uppercase tracking-[0.1em]">{tf.privacy}</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors uppercase tracking-[0.1em]">{tf.tos}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}