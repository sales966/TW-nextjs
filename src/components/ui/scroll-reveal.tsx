"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// 高级渐入渐出的缓动曲线
const ease = [0.22, 1, 0.36, 1];

export function ScrollReveal({ 
  children, 
  className = "", 
  yOffset = 80, // 从 40 增加到 80，让区块的上浮感更明显
  duration = 1.2, 
  delay = 0 
}: { 
  children: ReactNode; 
  className?: string;
  yOffset?: number;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      // 取消 once: true，变为双向滚动交互；amount: 0.15 意味着在屏幕中露出 15% 时才触发，确保用户视线聚焦时才开始播放
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealText({ 
  children, 
  className = "", 
  delay = 0 
}: { 
  children: ReactNode; 
  className?: string; 
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // 文字的位移距离从 20 增加到 50
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 1.0, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealImage({ 
  children, 
  className = "", 
  delay = 0 
}: { 
  children: ReactNode; 
  className?: string; 
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 60 }} // 缩放从 0.96 加大到 0.88，Y 轴位移增加到 60
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 1.4, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
