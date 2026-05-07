"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function LuxuryPaperBagHeroVisual() {
  const { scrollY } = useScroll();

  // Mapping scroll pixels to micro-interactions
  // 0 - 150px: Fade in and scale up
  const opacity = useTransform(scrollY, [0, 150], [0, 1]);
  const scale = useTransform(scrollY, [0, 150], [0.96, 1]);
  const x = useTransform(scrollY, [0, 150], [30, 0]);
  
  // 150 - 300px: Slight 3D rotation to reveal more of the side gusset
  const rotateY = useTransform(scrollY, [150, 300], [0, -6]);

  // 300 - 450px: Gold logo glow
  const logoOpacity = useTransform(scrollY, [300, 450], [0.8, 1]);
  const logoFilter = useTransform(scrollY, [300, 450], [
    "drop-shadow(0px 0px 0px rgba(212,175,55,0))", 
    "drop-shadow(0px 0px 15px rgba(212,175,55,0.7))"
  ]);

  // 450 - 600px: Handles slight upward float
  const handleY = useTransform(scrollY, [450, 600], [0, -6]);

  // 600 - 750px: Light shift on the front face
  const frontLight = useTransform(scrollY, [600, 750], [0, 0.15]);

  return (
    <div className="w-full h-full min-h-[600px] flex items-center justify-center lg:justify-end pr-0 lg:pr-10" style={{ perspective: "1200px" }}>
      <motion.div 
        style={{ 
          opacity, 
          scale, 
          x, 
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative w-[480px] h-[600px] flex items-center justify-center origin-center"
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 480 600" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl"
        >
          <defs>
            {/* Soft Shadow Blur */}
            <filter id="shadowBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="15" />
            </filter>
            
            {/* Bag Materials */}
            <linearGradient id="frontGrad" x1="40" y1="180" x2="340" y2="560" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2A2A2A" />
              <stop offset="100%" stopColor="#111111" />
            </linearGradient>
            
            <linearGradient id="gussetLeft" x1="340" y1="150" x2="385" y2="530" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E1E1E" />
              <stop offset="100%" stopColor="#0A0A0A" />
            </linearGradient>
            
            <linearGradient id="gussetRight" x1="385" y1="145" x2="430" y2="515" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#141414" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
            
            <linearGradient id="innerDark" x1="40" y1="180" x2="130" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#080808" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
            
            {/* Gold Foil Logo */}
            <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#BF953F" />
              <stop offset="25%" stopColor="#FCF6BA" />
              <stop offset="50%" stopColor="#B38728" />
              <stop offset="75%" stopColor="#FBF5B7" />
              <stop offset="100%" stopColor="#AA771C" />
            </linearGradient>
            
            {/* Light Shift Overlay */}
            <linearGradient id="lightShiftGrad" x1="40" y1="180" x2="340" y2="560" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 1. Floor Drop Shadow */}
          <path d="M 20 550 L 340 530 L 450 500 L 130 520 Z" fill="rgba(0,0,0,0.35)" filter="url(#shadowBlur)" />
          <path d="M 60 545 L 320 525 L 410 495 L 150 515 Z" fill="rgba(0,0,0,0.5)" filter="url(#shadowBlur)" />

          {/* 2. Back Handle (Inside) */}
          <motion.path 
            style={{ y: handleY }}
            d="M 220 141 C 200 20, 360 10, 340 129" 
            stroke="#080808" strokeWidth="10" strokeLinecap="round" fill="none" 
          />

          {/* 3. Inner Opening Hole */}
          <path d="M 40 180 L 340 150 L 430 120 L 130 150 Z" fill="url(#innerDark)" />

          {/* 4. Right Side Gusset (Accordion Fold) */}
          <path d="M 340 150 L 385 145 L 385 515 L 340 530 Z" fill="url(#gussetLeft)" />
          <path d="M 385 145 L 430 120 L 430 500 L 385 515 Z" fill="url(#gussetRight)" />
          
          {/* Gusset Crease Lines */}
          <line x1="385" y1="145" x2="385" y2="515" stroke="#000" strokeWidth="1.5" opacity="0.6" />
          <line x1="340" y1="150" x2="385" y2="515" stroke="#000" strokeWidth="1" opacity="0.2" />
          <line x1="430" y1="500" x2="385" y2="515" stroke="#000" strokeWidth="1" opacity="0.2" />

          {/* 5. Front Face Main Body */}
          <path d="M 40 180 L 340 150 L 340 530 L 40 560 Z" fill="url(#frontGrad)" />

          {/* 6. Dynamic Light Shift Overlay */}
          <motion.path 
            style={{ opacity: frontLight }}
            d="M 40 180 L 340 150 L 340 530 L 40 560 Z" 
            fill="url(#lightShiftGrad)" pointerEvents="none"
          />

          {/* 7. Front Handle */}
          {/* Main rope */}
          <motion.path 
            style={{ y: handleY }}
            d="M 130 171 C 110 50, 270 40, 250 159" 
            stroke="#161616" strokeWidth="12" strokeLinecap="round" fill="none" 
          />
          {/* Rope highlight to give 3D cylinder volume */}
          <motion.path 
            style={{ y: handleY }}
            d="M 130 171 C 110 50, 270 40, 250 159" 
            stroke="#2A2A2A" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"
          />

          {/* 8. Handle Eyelets (Metal Holes) */}
          {/* Left Hole */}
          <motion.ellipse style={{ y: handleY }} cx="130" cy="171" rx="11" ry="8" fill="#333" transform="rotate(-5.7 130 171)" />
          <motion.ellipse style={{ y: handleY }} cx="130" cy="171" rx="7" ry="5" fill="#000" transform="rotate(-5.7 130 171)" />
          {/* Right Hole */}
          <motion.ellipse style={{ y: handleY }} cx="250" cy="159" rx="11" ry="8" fill="#333" transform="rotate(-5.7 250 159)" />
          <motion.ellipse style={{ y: handleY }} cx="250" cy="159" rx="7" ry="5" fill="#000" transform="rotate(-5.7 250 159)" />

          {/* 9. Gold Foil Logo */}
          <motion.g 
            style={{ opacity: logoOpacity, filter: logoFilter }} 
            transform="translate(190, 280) rotate(-5.7)"
          >
            <text x="0" y="0" textAnchor="middle" fill="url(#goldFoil)" fontSize="26" fontWeight="900" letterSpacing="4" fontFamily="serif">
              DAWN BAGS
            </text>
            <rect x="-45" y="12" width="90" height="1" fill="url(#goldFoil)" opacity="0.8" />
            <text x="0" y="28" textAnchor="middle" fill="url(#goldFoil)" fontSize="9" fontWeight="500" letterSpacing="2" opacity="0.9" fontFamily="sans-serif">
              PREMIUM PACKAGING
            </text>
          </motion.g>

        </svg>
      </motion.div>
    </div>
  );
}
