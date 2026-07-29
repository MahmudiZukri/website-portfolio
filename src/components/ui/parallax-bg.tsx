"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function ParallaxBg() {
  const { scrollY } = useScroll();
  // Move the background slower than the scroll speed for a parallax effect
  const y = useTransform(scrollY, [0, 3000], [0, 600]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-background">
      <motion.div 
        className="absolute inset-[-50%] opacity-10 bg-[radial-gradient(#A27B5C_1px,transparent_1px)] [background-size:24px_24px]"
        style={{ y }}
      />
    </div>
  );
}
