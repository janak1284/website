import React from 'react';
import { motion } from 'framer-motion';

export function ResonanceWordmark() {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 2.5, bounce: 0 },
        opacity: { duration: 0.5 }
      }
    }
  };

  const drawDelayed = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 2.5, bounce: 0, delay: 0.5 },
        opacity: { duration: 0.5, delay: 0.5 }
      }
    }
  };

  // Paths designed on a 900x120 grid for ultra-wide tracking and stencil gaps
  // X Offsets: R=0, E=105, S=210, O=315, N=420, A=525, N=630, C=735, E=840
  const letterPaths = [
    // R (Stencil gaps)
    "M 10 110 L 10 10 M 20 10 L 50 10 A 25 25 0 0 1 50 60 L 20 60 M 25 60 L 60 110",
    // E (Stencil gaps)
    "M 165 10 L 125 10 M 115 110 L 115 10 M 165 110 L 125 110 M 125 60 L 155 60",
    // S
    "M 270 25 C 270 10 210 10 210 30 C 210 50 270 60 270 90 C 270 110 210 110 210 95",
    // N
    "M 430 110 L 430 10 L 480 110 L 480 10",
    // A (Stencil gaps at top peak and crossbar)
    "M 525 110 L 552 10 M 558 10 L 585 110 M 545 65 L 565 65",
    // N
    "M 640 110 L 640 10 L 690 110 L 690 10",
    // C
    "M 795 30 C 795 10 735 10 735 60 C 735 110 795 110 795 90",
    // E (Stencil gaps)
    "M 900 10 L 860 10 M 850 110 L 850 10 M 900 110 L 860 110 M 860 60 L 890 60"
  ];

  return (
    <div className="w-full max-w-[1100px] mx-auto drop-shadow-2xl">
      <svg
        viewBox="0 -20 920 160"
        className="w-full h-auto"
        fill="none"
        stroke="white"
        strokeWidth="4.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <defs>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur1" />
            <feGaussianBlur stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#neonGlow)">
          {/* Letters */}
          {letterPaths.map((path, index) => (
            <motion.path
              key={`letter-${index}`}
              d={path}
              variants={draw}
              initial="hidden"
              animate="visible"
            />
          ))}

          {/* O Glyph (Offset: cx=345) */}
          <g>
            <motion.circle
              cx="345" cy="60" r="30"
              variants={draw}
              initial="hidden"
              animate="visible"
            />
            <motion.ellipse
              cx="345" cy="60" rx="55" ry="10"
              strokeWidth="2.5"
              variants={drawDelayed}
              initial="hidden"
              animate="visible"
            />
            <motion.line
              x1="345" y1="-10" x2="345" y2="130"
              strokeWidth="2.5"
              variants={drawDelayed}
              initial="hidden"
              animate="visible"
            />
            {/* Center Star */}
            <motion.path
              d="M 345 48 L 346.5 58.5 L 357 60 L 346.5 61.5 L 345 72 L 343.5 61.5 L 333 60 L 343.5 58.5 Z"
              fill="white"
              stroke="none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
