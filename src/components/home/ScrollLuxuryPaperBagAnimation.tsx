"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export function ScrollLuxuryPaperBagAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // We track the scroll progress of the container. 
  // It needs to be a tall container so the user scrolls through it.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Mobile optimization: simplify the animation steps or use discrete steps if needed,
  // but framer-motion handles interpolation smoothly for both.

  // 1. Scale & Positioning of the whole assembly
  // Flat die-cut is large, so we scale it down initially to fit screen, then scale up as it becomes a 3D bag.
  const mainScale = useTransform(scrollYProgress, [0, 0.4, 1], [0.4, 0.7, 0.9]);
  
  // 2. Global 3D Rotation (Camera angle)
  // Starts flat looking straight down (rotateX: 0, rotateY: 0)
  // Ends at an isometric 3D angle (rotateX: -15deg, rotateY: -35deg)
  const wrapperRotateX = useTransform(scrollYProgress, [0, 0.4, 0.6], [0, 0, -15]);
  const wrapperRotateY = useTransform(scrollYProgress, [0, 0.4, 0.6], [0, 0, -35]);

  // 3. Side flaps fold up (0% to 20%)
  const leftFold = useTransform(scrollYProgress, [0, 0.2], [0, -90]);
  const rightFold = useTransform(scrollYProgress, [0, 0.2], [0, 90]);

  // 4. Bottom folds (20% to 40%)
  const bottomFold = useTransform(scrollYProgress, [0.2, 0.4], [0, -90]);

  // 5. Back panel and top folds (also forming the box, 20% to 40%)
  // The back panel is attached to the bottom panel. As bottom folds -90, back needs to fold -90 relative to bottom to stand parallel to front.
  const backFold = useTransform(scrollYProgress, [0.2, 0.4], [0, -90]);

  // 6. Handles appear (60% to 80%)
  const handleOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const handleScale = useTransform(scrollYProgress, [0.6, 0.8], [0.8, 1]);

  // 7. Gold foil logo appears (80% to 100%)
  const logoOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);
  const logoY = useTransform(scrollYProgress, [0.8, 1], [10, 0]);

  // Colors & Materials
  const paperColor = "#1a1a1a"; // Matte black
  const insideColor = "#111111"; // Darker inside
  const creaseColor = "rgba(212, 175, 55, 0.2)"; // Subtle gold crease lines

  if (shouldReduceMotion) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#FAF8F5]">
        {/* Static Finished Bag */}
        <div style={{ transform: "rotateX(-15deg) rotateY(-35deg) scale(0.9)", transformStyle: "preserve-3d" }} className="relative w-64 h-80">
          {/* Front */}
          <div className="absolute inset-0 bg-[#1a1a1a] border border-[#222] flex flex-col items-center justify-center shadow-2xl" style={{ transform: "translateZ(3rem)" }}>
            <div className="w-24 h-12 border-2 border-[#D4AF37] rounded-full absolute -top-12 border-b-0 rounded-b-none opacity-100"></div>
            <div className="text-[#D4AF37] text-2xl font-serif tracking-widest opacity-100">DAWN</div>
            <div className="text-[#D4AF37]/80 text-xs tracking-[0.3em] mt-2 opacity-100">LUXURY</div>
          </div>
          {/* Left */}
          <div className="absolute inset-y-0 left-0 w-24 bg-[#111] border border-[#222]" style={{ transformOrigin: "left", transform: "rotateY(-90deg)" }}></div>
          {/* Right */}
          <div className="absolute inset-y-0 right-0 w-24 bg-[#1a1a1a] border border-[#222]" style={{ transformOrigin: "right", transform: "rotateY(90deg)" }}></div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      <div className="sticky top-0 h-screen w-full flex flex-col lg:flex-row items-center justify-center lg:justify-end overflow-hidden bg-gradient-to-br from-[#FAF8F5] to-[#F0EBE1]">
        
        {/* Soft Studio Lighting Background Glow */}
        <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-32 opacity-60">
          <div className="w-[600px] h-[600px] bg-white rounded-full blur-[100px]"></div>
        </div>

        <motion.div 
          className="relative w-64 h-80 lg:mr-[15%]"
          style={{
            scale: mainScale,
            rotateX: wrapperRotateX,
            rotateY: wrapperRotateY,
            transformStyle: "preserve-3d",
            perspective: "2000px"
          }}
        >
          {/* Front Panel (Base) */}
          <div className="absolute inset-0 bg-[#1a1a1a] border-[0.5px]" style={{ borderColor: creaseColor, transformStyle: "preserve-3d", transform: "translateZ(3rem)" }}>
            
            {/* Front Foil Logo */}
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              style={{ opacity: logoOpacity, y: logoY }}
            >
              <div className="text-[#D4AF37] text-3xl font-serif tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] drop-shadow-md">DAWN</div>
              <div className="text-[#D4AF37]/80 text-xs tracking-[0.4em] mt-3 uppercase font-light">Luxury</div>
            </motion.div>

            {/* Handles (Front) */}
            <motion.div 
              className="absolute -top-16 left-1/2 -translate-x-1/2 w-28 h-20 border-[3px] border-[#111] rounded-t-full border-b-0 origin-bottom"
              style={{ opacity: handleOpacity, scaleY: handleScale }}
            >
              {/* Rope texture simulation */}
              <div className="absolute inset-0 rounded-t-full border-[2px] border-[#222] border-b-0 opacity-50 m-[1px]"></div>
            </motion.div>

            {/* Left Panel */}
            <motion.div 
              className="absolute inset-y-0 left-0 w-24 origin-left border-[0.5px]"
              style={{ 
                backgroundColor: insideColor, 
                borderColor: creaseColor, 
                rotateY: leftFold,
                transformStyle: "preserve-3d"
              }}
            >
               {/* Left Gusset Crease */}
               <div className="absolute inset-0 w-full h-full flex justify-center">
                  <div className="w-[1px] h-full bg-[#D4AF37]/10"></div>
               </div>
            </motion.div>

            {/* Right Panel */}
            <motion.div 
              className="absolute inset-y-0 right-0 w-24 origin-right border-[0.5px]"
              style={{ 
                backgroundColor: paperColor, 
                borderColor: creaseColor, 
                rotateY: rightFold,
                transformStyle: "preserve-3d"
              }}
            >
               {/* Right Gusset Crease */}
               <div className="absolute inset-0 w-full h-full flex justify-center">
                  <div className="w-[1px] h-full bg-[#D4AF37]/10"></div>
               </div>
            </motion.div>

            {/* Bottom Panel */}
            <motion.div 
              className="absolute bottom-0 left-0 w-full h-24 origin-bottom border-[0.5px]"
              style={{ 
                backgroundColor: insideColor, 
                borderColor: creaseColor, 
                rotateX: bottomFold,
                transformStyle: "preserve-3d"
              }}
            >
               {/* Bottom Crease Lines (X pattern) */}
               <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 left-0 w-[141%] h-[1px] bg-[#D4AF37]/10 origin-top-left rotate-45"></div>
                  <div className="absolute top-0 right-0 w-[141%] h-[1px] bg-[#D4AF37]/10 origin-top-right -rotate-45"></div>
               </div>

               {/* Back Panel (Attached to bottom) */}
               <motion.div 
                 className="absolute bottom-0 left-0 w-full h-80 origin-bottom border-[0.5px]"
                 style={{ 
                   backgroundColor: insideColor, // Inside of the back panel facing up initially
                   borderColor: creaseColor, 
                   rotateX: backFold,
                   translateY: "100%", // Move to the far edge of the bottom panel
                   transformStyle: "preserve-3d"
                 }}
               >
                 {/* The outside of the back panel */}
                 <div className="absolute inset-0 bg-[#1a1a1a]" style={{ transform: "translateZ(-1px)" }}></div>
                 
                 {/* Handles (Back) */}
                 <motion.div 
                   className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-28 h-20 border-[3px] border-[#111] rounded-b-full border-t-0 origin-top rotate-180"
                   style={{ opacity: handleOpacity, scaleY: handleScale }}
                 ></motion.div>
               </motion.div>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
