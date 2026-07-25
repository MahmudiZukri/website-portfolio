"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#A27B5C_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="container px-4 md:px-8 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center border-2 border-primary bg-card px-3 py-1 text-sm text-card-foreground mb-8 shadow-[4px_4px_0_0_#000]">
            <span className="flex h-3 w-3 bg-[#a2df5c] mr-2 animate-pulse border border-[#2C3930]" />
            Available for new opportunities
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
        >
          Hi, I&apos;m{" "}
          <span className="text-primary">
            {siteConfig.shortName}
          </span>
          <br className="hidden md:block" />
          <span className="text-foreground"> {siteConfig.title}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-zinc-400 mb-10"
        >
          {siteConfig.bio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="#projects">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[160px] border-2 border-black shadow-[4px_4px_0_0_#000] rounded-none active:translate-y-1 active:shadow-none transition-all">
              View Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
