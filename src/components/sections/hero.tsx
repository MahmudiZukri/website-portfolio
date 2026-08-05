"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { MagneticButton } from "@/components/ui/magnetic-button";
import { useSound } from "@/hooks/use-sound";

export function Hero({ resumeUrl }: { resumeUrl: string | null }) {
  const { playHover, playClick } = useSound();



  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">

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
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.1 }
            }
          }}
          initial="hidden"
          animate="visible"
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 flex flex-wrap justify-center items-center gap-x-3 gap-y-2 md:gap-x-4"
        >
          <motion.span variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } } }}>Hi,</motion.span>
          <motion.span variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } } }}>I&apos;m</motion.span>
          <motion.span variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } } }} className="text-primary">
            {siteConfig.shortName}
          </motion.span>
          <div className="basis-full h-0 hidden md:block" />
          {siteConfig.title.split(" ").map((word, i) => (
            <motion.span key={i} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } } }} className="text-foreground">
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-10"
        >
          {siteConfig.bio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <MagneticButton>
            <Link href="#projects">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[160px] border-2 border-black shadow-[4px_4px_0_0_#000] rounded-none active:translate-y-1 active:shadow-none transition-all"
                onMouseEnter={playHover}
                onClick={playClick}
              >
                View Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </MagneticButton>
          
          {resumeUrl && (
            <MagneticButton>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-card hover:bg-primary/20 text-card-foreground min-w-[160px] border-2 border-primary shadow-[4px_4px_0_0_#000] rounded-none active:translate-y-1 active:shadow-none transition-all"
                  onMouseEnter={playHover}
                  onClick={playClick}
                >
                  Download Resume
                </Button>
              </a>
            </MagneticButton>
          )}
        </motion.div>
      </div>
    </section>
  );
}
