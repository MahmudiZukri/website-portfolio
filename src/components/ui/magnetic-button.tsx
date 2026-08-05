"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function MagneticButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Snappy physics for the magnetic pull
  const springConfig = { damping: 15, stiffness: 200, mass: 0.2 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    
    // Calculate distance from center of the button
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Apply a pull factor (higher number = more magnetism)
    x.set(middleX * 0.4);
    y.set(middleY * 0.4);
  };

  const handleMouseLeave = () => {
    // Snap back to original position
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}
