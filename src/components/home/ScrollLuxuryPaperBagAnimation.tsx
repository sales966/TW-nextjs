"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ScrollLuxuryPaperBagAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // ==========================================
  // TIMELINE DEFINITION
  // Stage 0: 0.00 - 0.12 (Flat Dieline)
  // Stage 1: 0.12 - 0.25 (Crease Highlight)
  // Stage 2: 0.25 - 0.42 (Side Gussets Fold)
  // Stage 3: 0.42 - 0.60 (Body Rise)
  // Stage 4: 0.60 - 0.78 (Bottom Lock Fold)
  // Stage 5: 0.78 - 0.92 (Final Upright Bag)
  // Stage 6: 0.92 - 1.00 (Handle + Gold Foil Logo)
  // ==========================================

  // 1. Crease Highlight (0.12 - 0.25)
  const creaseOpacity = useTransform(scrollYProgress, [0.12, 0.20, 0.25], [0, 1, 0.2]);

  // 2. Side Gussets Fold (0.25 - 0.42)
  // These are the vertical folds in the middle of the side panels
  const leftGussetInnerFold = useTransform(scrollYProgress, [0.25, 0.42, 0.60], [0, 65, 0]);
  const rightGussetInnerFold = useTransform(scrollYProgress, [0.25, 0.42, 0.60], [0, -65, 0]);

  // 3. Body Rise (0.42 - 0.60)
  // Bottom is anchor. Front/Back fold UP 90deg, Left/Right fold UP 90deg.
  const riseAngle = useTransform(scrollYProgress, [0.42, 0.60], [0, 90]);
  const riseAngleNeg = useTransform(scrollYProgress, [0.42, 0.60], [0, -90]);

  // 4. Bottom Lock Fold (0.60 - 0.78)
  const bottomLeftFold = useTransform(scrollYProgress, [0.60, 0.65], [0, 90]);
  const bottomRightFold = useTransform(scrollYProgress, [0.65, 0.70], [0, -90]);
  const bottomBackFold = useTransform(scrollYProgress, [0.70, 0.75], [0, -90]);
  const bottomFrontFold = useTransform(scrollYProgress, [0.75, 0.78], [0, 90]);

  // 5. Final Upright Bag (0.78 - 0.92)
  // Rotate the whole assembly to view the final bag nicely
  const baseRotateX = useTransform(scrollYProgress, [0, 0.42, 0.78, 0.92], [60, 60, 60, 10]);
  const baseRotateZ = useTransform(scrollYProgress, [0, 0.42, 0.78, 0.92], [-35, -35, -35, -15]);
  const baseRotateY = useTransform(scrollYProgress, [0, 0.78, 0.92], [0, 0, -10]);
  const baseY = useTransform(scrollYProgress, [0, 0.42, 0.78, 0.92], [0, 50, 50, 150]);
  const baseScale = useTransform(scrollYProgress, [0, 0.78, 0.92], [0.6, 0.6, 0.9]);

  // 6. Handle + Gold Foil Logo (0.92 - 1.00)
  const finalOpacity = useTransform(scrollYProgress, [0.92, 0.96], [0, 1]);
  const handleY = useTransform(scrollYProgress, [0.92, 0.98], [20, 0]);

  // Aesthetics
  const bgCard = "#1c1c1c";
  const bgCardDark = "#151515";
  const bgCardDarker = "#101010";
  const creaseColor = "#d4af37";

  return (
    <div ref={containerRef} className="relative w-full h-[500vh] bg-[#FDFCF8] selection:bg-[#EAE8E2]">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden perspective-[2000px]">
        
        {/* Helper Text for User Scrolling */}
        <motion.div 
           className="absolute top-24 text-center z-10"
           style={{ opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 0.3, 0.3, 0]) }}
        >
          <p className="text-[12px] font-bold tracking-[0.2em] text-[#667085] uppercase mb-4">Engineering The Structure</p>
          <div className="w-[1px] h-12 bg-[#101828]/20 mx-auto"></div>
        </motion.div>

        {/* 3D SCENE ROOT */}
        <motion.div 
          className="relative w-[300px] h-[120px]"
          style={{
            rotateX: baseRotateX,
            rotateZ: baseRotateZ,
            rotateY: baseRotateY,
            y: baseY,
            scale: baseScale,
            transformStyle: "preserve-3d"
          }}
        >
          {/* BOTTOM PANEL (ANCHOR) */}
          <div className="absolute inset-0 w-full h-full bg-[#111] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]" style={{ transformStyle: "preserve-3d" }}>
            
            {/* FRONT PANEL */}
            <motion.div 
              className="absolute top-full left-0 w-[300px] h-[400px] bg-[#1a1a1a] origin-top border border-white/5 flex items-end justify-center overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"
              style={{ rotateX: riseAngleNeg, transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-20 mix-blend-overlay"></div>
              
              {/* Gold Foil Logo */}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ opacity: finalOpacity, y: handleY, translateZ: 1 }}
              >
                 <div className="text-[#d4af37] font-black text-4xl tracking-tighter shadow-sm mb-3 opacity-90" style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.8)" }}>DawnBags</div>
                 <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50"></div>
              </motion.div>

              {/* Front Handle */}
              <motion.div 
                className="absolute -bottom-[120px] left-1/2 -translate-x-1/2 w-[140px] h-[140px] border-[8px] border-[#151515] rounded-b-full border-t-0 drop-shadow-xl"
                style={{ opacity: finalOpacity, y: handleY, translateZ: -2 }}
              ></motion.div>

              {/* Front Top Fold Crease */}
              <motion.div className="absolute bottom-[40px] left-0 right-0 h-[1px] bg-[#d4af37]" style={{ opacity: creaseOpacity }}></motion.div>
            </motion.div>

            {/* BACK PANEL */}
            <motion.div 
              className="absolute bottom-full left-0 w-[300px] h-[400px] bg-[#151515] origin-bottom border border-white/5 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"
              style={{ rotateX: riseAngle, transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-20 mix-blend-overlay"></div>
              
              {/* Back Handle */}
              <motion.div 
                className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[140px] h-[140px] border-[8px] border-[#111] rounded-t-full border-b-0 drop-shadow-xl"
                style={{ opacity: finalOpacity, y: useTransform(scrollYProgress, [0.92, 0.98], [-20, 0]), translateZ: -2 }}
              ></motion.div>

              {/* Back Top Fold Crease */}
              <motion.div className="absolute top-[40px] left-0 right-0 h-[1px] bg-[#d4af37]" style={{ opacity: creaseOpacity }}></motion.div>
            </motion.div>

            {/* LEFT GUSSET (Whole panel folds UP 90deg, then center crease folds IN) */}
            <motion.div 
              className="absolute top-0 right-full w-[120px] h-[120px] bg-[#111] origin-right border border-white/5"
              style={{ rotateY: riseAngle, transformStyle: "preserve-3d" }}
            >
              <div className="absolute top-0 right-full w-[120px] h-[400px] bg-[#151515] origin-right" style={{ rotateY: leftGussetInnerFold, transformStyle: "preserve-3d" }}>
                {/* Left Gusset Back Half */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-20 mix-blend-overlay"></div>
                 <motion.div className="absolute top-0 bottom-0 right-0 w-[1px] bg-[#d4af37]" style={{ opacity: creaseOpacity }}></motion.div>
              </div>
              <div className="absolute top-full right-0 w-[120px] h-[400px] bg-[#181818] origin-top" style={{ rotateX: leftGussetInnerFold, transformStyle: "preserve-3d" }}>
                 {/* Left Gusset Front Half */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-20 mix-blend-overlay"></div>
              </div>
            </motion.div>

            {/* RIGHT GUSSET */}
            <motion.div 
              className="absolute top-0 left-full w-[120px] h-[120px] bg-[#111] origin-left border border-white/5"
              style={{ rotateY: riseAngleNeg, transformStyle: "preserve-3d" }}
            >
              <div className="absolute top-0 left-full w-[120px] h-[400px] bg-[#151515] origin-left" style={{ rotateY: rightGussetInnerFold, transformStyle: "preserve-3d" }}>
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-20 mix-blend-overlay"></div>
                 <motion.div className="absolute top-0 bottom-0 left-0 w-[1px] bg-[#d4af37]" style={{ opacity: creaseOpacity }}></motion.div>
              </div>
            </motion.div>

            {/* BOTTOM FLAPS */}
            {/* Left Bottom Flap */}
            <motion.div 
              className="absolute top-0 right-full w-[120px] h-[120px] bg-[#0a0a0a] origin-right border border-white/10"
              style={{ rotateY: bottomLeftFold, translateZ: 1 }}
            ></motion.div>
            {/* Right Bottom Flap */}
            <motion.div 
              className="absolute top-0 left-full w-[120px] h-[120px] bg-[#0a0a0a] origin-left border border-white/10"
              style={{ rotateY: bottomRightFold, translateZ: 2 }}
            ></motion.div>
            {/* Back Bottom Flap */}
            <motion.div 
              className="absolute bottom-full left-0 w-[300px] h-[120px] bg-[#141414] origin-bottom border border-white/10"
              style={{ rotateX: bottomBackFold, translateZ: 3 }}
            ></motion.div>
            {/* Front Bottom Flap */}
            <motion.div 
              className="absolute top-full left-0 w-[300px] h-[120px] bg-[#1a1a1a] origin-top border border-white/10"
              style={{ rotateX: bottomFrontFold, translateZ: 4 }}
            ></motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
