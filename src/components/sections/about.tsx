"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { insforge, type Skill, type SiteSettings } from "@/lib/insforge";
import { SectionHeading } from "@/components/ui/section-heading";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export function About({ skills, avatar }: { skills: Skill[], avatar: string | null }) {



  const frontendSkills = skills.filter(s => s.category === 'frontend');
  const backendSkills = skills.filter(s => s.category === 'backend');
  const toolSkills = skills.filter(s => s.category === 'tools');

  return (
    <section id="about" className="py-24 container mx-auto px-4 md:px-8">
      <SectionHeading
        title="About Me"
        subtitle="Here is a little bit about myself and the technologies I work with."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="space-y-6 text-foreground/80 text-lg leading-relaxed flex flex-col items-center md:items-start"
        >
          <div className="relative w-48 h-48 mb-4 border-4 border-primary shadow-[6px_6px_0_0_#000] overflow-hidden bg-card flex items-center justify-center">
            {avatar ? (
              <Image 
                src={avatar} 
                alt="Avatar" 
                fill
                priority
                className="object-cover" 
              />
            ) : (
              <span className="text-4xl text-primary font-bold">MZ</span>
            )}
          </div>

          <p className="w-full">
            Hello! I&apos;m {siteConfig.name}, a passionate Full-Stack Developer and AI Engineer. My journey started with building simple applications and has evolved into architecting complex, end-to-end web and mobile applications using modern frameworks.
          </p>
          <p>
            I specialize in the Flutter ecosystem and integrating backend-as-a-service platforms like Supabase, Firebase, and InsForge. I love building intelligent, AI-powered applications that provide real value.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-6 md:p-8 bg-card border-2 border-primary shadow-[4px_4px_0_0_#000]">
            <h3 className="text-xl font-bold text-foreground mb-6">Skills & Technologies</h3>
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Frontend</h4>
                <div className="relative overflow-hidden flex w-full group">
                  <motion.div
                    className="flex gap-4 whitespace-nowrap min-w-max py-2"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ ease: "linear", duration: 15, repeat: Infinity }}
                  >
                    {[...frontendSkills, ...frontendSkills, ...frontendSkills, ...frontendSkills].map((skill, idx) => (
                      <span key={`${skill.id}-${idx}`} className="px-4 py-2 bg-background text-foreground border-2 border-primary shadow-[2px_2px_0_0_#000] text-sm font-bold">
                        {skill.name}
                      </span>
                    ))}
                  </motion.div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Backend</h4>
                <div className="relative overflow-hidden flex w-full group">
                  <motion.div
                    className="flex gap-4 whitespace-nowrap min-w-max py-2"
                    animate={{ x: ["-50%", "0%"] }}
                    transition={{ ease: "linear", duration: 15, repeat: Infinity }}
                  >
                    {[...backendSkills, ...backendSkills, ...backendSkills, ...backendSkills].map((skill, idx) => (
                      <span key={`${skill.id}-${idx}`} className="px-4 py-2 bg-background text-foreground border-2 border-primary shadow-[2px_2px_0_0_#000] text-sm font-bold">
                        {skill.name}
                      </span>
                    ))}
                  </motion.div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Tools & Others</h4>
                <div className="relative overflow-hidden flex w-full group">
                  <motion.div
                    className="flex gap-4 whitespace-nowrap min-w-max py-2"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ ease: "linear", duration: 15, repeat: Infinity }}
                  >
                    {[...toolSkills, ...toolSkills, ...toolSkills, ...toolSkills].map((skill, idx) => (
                      <span key={`${skill.id}-${idx}`} className="px-4 py-2 bg-background text-foreground border-2 border-primary shadow-[2px_2px_0_0_#000] text-sm font-bold">
                        {skill.name}
                      </span>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
