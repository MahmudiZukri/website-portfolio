"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { insforge, type WorkExperience } from "@/lib/insforge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Briefcase, Loader2 } from "lucide-react";

export function Experience() {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      const { data, error } = await insforge.database
        .from("work_experience")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
        
      if (!error && data) {
        setExperiences(data);
      }
      setIsLoading(false);
    };

    fetchExperiences();
  }, []);

  return (
    <section id="experience" className="py-24 container mx-auto px-4 md:px-8 bg-background">
      <SectionHeading 
        title="Work Experience" 
        subtitle="My professional journey and the companies I've had the pleasure of working with."
      />

      <div className="max-w-4xl mx-auto mt-12 relative">
        {isLoading ? (
          <div className="flex justify-center my-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-primary transform md:-translate-x-1/2" />

            <div className="space-y-12">
              {experiences.map((job, index) => (
                <div key={job.id} className={`relative flex flex-col md:flex-row items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Timeline Icon */}
              <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-card border-2 border-primary shadow-[2px_2px_0_0_#000] flex items-center justify-center transform -translate-x-1/2 z-10 mt-1 md:mt-0">
                <Briefcase className="w-4 h-4 text-primary" />
              </div>

              {/* Content Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`w-full pl-12 md:pl-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}
              >
                <div className="p-6 bg-card border-2 border-primary shadow-[4px_4px_0_0_#000]">
                  <span className="text-sm font-bold text-primary block mb-2">{job.date_range}</span>
                  <h3 className="text-xl font-bold text-foreground">{job.role}</h3>
                  <h4 className="text-lg text-foreground/70 mb-4">{job.company}</h4>
                  
                  <ul className="space-y-2 text-foreground/80 text-sm">
                    {job.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2 text-primary mt-1">►</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
