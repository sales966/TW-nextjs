const fs = require('fs');
const path = require('path');

const projectRoot = 'c:\\Users\\tomor\\Documents\\003';

const files = {
  'src/app/page.tsx': `import Link from "next/link";
import { ArrowRight, Package, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* Hero Section - Swiss Design, Max Whitespace */}
      <section className="relative pt-32 pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-widest uppercase mb-8">
               <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Precision Packaging
             </div>
             <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-8 text-slate-900">
               Engineering your brand's <span className="text-blue-600">unboxing experience.</span>
             </h1>
             <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl leading-relaxed">
               Industrial-grade custom packaging solutions for enterprise. Zero compromises on material tolerance. Direct from factory integration.
             </p>
             <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/configure" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-[0_8px_30px_rgb(37,99,235,0.2)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.4)] flex items-center justify-center">
                  Start Configuration <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link href="/products" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-all flex items-center justify-center">
                  View Catalog
                </Link>
             </div>
          </div>
        </div>
        
        {/* Subtle Decorative Grid */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </section>

      {/* Feature Section - Abstract & Clean */}
      <section className="bg-slate-50 py-32 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
            {[
              { icon: Package, title: "Structural Integrity", desc: "Rigorous ISO-standard testing for all corrugated profiles. Built to protect." },
              { icon: ShieldCheck, title: "Supply Chain Reliability", desc: "99.8% on-time delivery metric. Integrated API for live production tracking." },
              { icon: Zap, title: "Rapid Prototyping", desc: "From CAD dieline to physical sample in 72 hours. Accelerated go-to-market." }
            ].map((feature, i) => (
              <div key={i} className="group">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-6 shadow-sm group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors">
                   <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}`,

  'src/components/layout/Navbar.tsx': `"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Menu, X, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, t } = useI18n();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/50 transition-all">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <Box className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">PackCustom.</span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Catalog</Link>
            <Link href="/configure" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Configurator</Link>
            <Link href="/about" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Enterprise</Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => setLang(lang === "en" ? "zh" : "en")} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-colors">
              <Globe className="w-4 h-4" /> {lang === 'en' ? 'EN' : '中'}
            </button>
            <Link href="/configure" className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
              Get Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsOpen(!isOpen)}>
             {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-6 flex flex-col gap-4 shadow-xl">
          <Link href="/products" className="font-semibold text-slate-700" onClick={()=>setIsOpen(false)}>Catalog</Link>
          <Link href="/configure" className="font-semibold text-slate-700" onClick={()=>setIsOpen(false)}>Configurator</Link>
          <div className="h-px w-full bg-slate-100 my-2" />
          <Link href="/configure" className="w-full text-center px-5 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md">Get Quote</Link>
        </div>
      )}
    </header>
  );
}`,

  'src/components/layout/Footer.tsx': `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-white border-t border-slate-200 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center">
                <Box className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900">PackCustom.</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Industrial-grade custom packaging solutions. Precision manufacturing for high-end retail, CPG, and technical components.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-sm text-slate-500 hover:text-blue-600">Product Catalog</Link></li>
              <li><Link href="/configure" className="text-sm text-slate-500 hover:text-blue-600">Quote Engine</Link></li>
              <li><Link href="/materials" className="text-sm text-slate-500 hover:text-blue-600">Material Specs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-slate-500 hover:text-blue-600">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-500 hover:text-blue-600">Contact Sales</Link></li>
              <li><Link href="/privacy" className="text-sm text-slate-500 hover:text-blue-600">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-slate-400">© 2026 PackCustom Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}`
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(projectRoot, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Updated Frontend UI:', relativePath);
}
