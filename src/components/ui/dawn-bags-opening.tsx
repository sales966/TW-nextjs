"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DawnBagsOpeningProps {
  /**
   * 动画完成后的回调，通常用来切换状态进入首页
   */
  onComplete: () => void;
}

export function DawnBagsOpening({ onComplete }: DawnBagsOpeningProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [isWobbling, setIsWobbling] = useState(false);

  // 前置切换文案
  const texts = [
    "Crafting your packaging",
    "Shaping materials into form",
    "Almost ready",
  ];

  useEffect(() => {
    // 文本切换序列，每句话停留 1 秒，保持均匀且足够阅读的速度
    const t1 = setTimeout(() => setTextIndex(1), 1000);
    const t2 = setTimeout(() => setTextIndex(2), 2000);
    const t3 = setTimeout(() => {
      setTextIndex(3); // 触发最后一句文案
      setIsWobbling(true); // 此时动画早已完成，触发轻微晃动
    }, 3000);
    const t4 = setTimeout(() => {
      onComplete();
    }, 4500); // 整体约 4.5 秒，保证用户能看完最后一句金句并感受质感

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F5F1EB] overflow-hidden">
      {/* 包装袋与 Logo 区域 */}
      <motion.div
        className="relative w-32 h-40 mb-10 flex items-center justify-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* SVG 极简线条绘制 */}
        <motion.svg
          viewBox="0 0 100 120"
          className="absolute inset-0 w-full h-full"
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="1" // 从 0.75 提升到 1，缓解由于极细线条在慢速绘制时因抗锯齿带来的“像素跳跃”视觉卡顿
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ willChange: "transform" }} // 开启硬件加速
          // 完成后模拟纸袋真实质感的轻微晃动
          animate={
            isWobbling
              ? { rotate: [0, -1.5, 1, -0.5, 0], y: [0, -1, 0] }
              : { rotate: 0 }
          }
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
        >
          {/* 提把与袋身外轮廓 (一笔画出) */}
          <motion.path
            d="M 38 40 C 38 12, 62 12, 62 40 L 82 40 L 82 110 L 18 110 L 18 40 L 38 40 Z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.8,
              ease: [0.42, 0, 0.58, 1], // 缓慢、优雅的缓动曲线
            }}
          />
          {/* 顶部的极简折痕线，增加立体纸袋感 */}
          <motion.path
            d="M 18 40 L 26 48 L 74 48 L 82 40"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.6,
              ease: "easeInOut",
            }}
            strokeOpacity="0.4"
          />
          {/* 侧边极简内折线 */}
          <motion.path
            d="M 26 48 L 26 110"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.0,
              ease: "easeInOut",
            }}
            strokeOpacity="0.25"
          />
          <motion.path
            d="M 74 48 L 74 110"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.0,
              ease: "easeInOut",
            }}
            strokeOpacity="0.25"
          />
        </motion.svg>

        {/* 在线条绘制的过程中，Logo 跟着渐渐浮现 */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
          className="mt-6 z-10 flex flex-col items-center"
        >
          <span className="text-[#1A1A1A] font-serif text-sm md:text-base tracking-[0.25em] font-medium ml-[0.25em]">
            DAWN
          </span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.9, ease: "easeOut" }}
            className="text-[#1A1A1A]/70 text-xs tracking-[0.4em] uppercase mt-1 ml-[0.4em]"
          >
            Bags
          </motion.span>
        </motion.div>
      </motion.div>

      {/* 底部文案切换区域 */}
      <div className="h-10 flex items-center justify-center mt-6">
        <AnimatePresence mode="popLayout">
          {textIndex < 3 ? (
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ willChange: "opacity, transform" }}
              className="text-[#1A1A1A]/60 text-xs md:text-sm tracking-[0.2em] font-light uppercase"
            >
              {texts[textIndex]}
            </motion.p>
          ) : (
            <motion.p
              key="final"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ willChange: "opacity, transform" }}
              className="text-[#1A1A1A] text-sm md:text-base tracking-[0.15em] font-serif italic"
            >
              Packaging is the first touch of your brand
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
