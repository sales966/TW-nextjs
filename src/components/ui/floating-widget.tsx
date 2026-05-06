"use client";

import { MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, y: "-50%" }}
      animate={{ opacity: 1, x: 0, y: "-50%" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      className="fixed top-1/2 right-4 lg:right-8 z-[90] flex flex-col items-center"
    >
      <div className="bg-white/90 backdrop-blur-lg shadow-[0_20px_40px_rgba(16,24,40,0.12)] border border-[#101828]/5 rounded-[40px] p-2 flex flex-col gap-2">
        
        {/* Top Button: Custom Quote / Premium */}
        <div className="relative group">
          <Link href="/quote" className="w-[52px] h-[52px] bg-[#101828] text-white rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-105 shadow-md">
            <Sparkles className="w-5 h-5" />
          </Link>
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 px-3 py-2 bg-[#101828] text-white text-[13px] font-medium tracking-wide rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap shadow-lg">
            获取定制报价
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-[5px] border-transparent border-l-[#101828]"></div>
          </div>
        </div>

        <div className="w-6 h-[1px] bg-[#101828]/10 mx-auto my-1"></div>

        {/* Bottom Button: Chat / Contact */}
        <div className="relative group">
          <a href="mailto:morningbeachtw@gmail.com" className="w-[52px] h-[52px] bg-[#F6F4EF] text-[#101828] border border-[#101828]/5 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-[#EAE8E2] shadow-sm">
            <MessageCircle className="w-5 h-5" />
          </a>
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 px-3 py-2 bg-[#101828] text-white text-[13px] font-medium tracking-wide rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap shadow-lg">
            在线咨询留言
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-[5px] border-transparent border-l-[#101828]"></div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
