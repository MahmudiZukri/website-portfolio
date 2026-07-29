"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { insforge } from "@/lib/insforge";

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      // 1. Save to database as a backup
      const { error } = await insforge.database
        .from("contact_submissions")
        .insert([{ name, email, message }]);

      if (error) {
        throw error;
      }

      // 2. Send email notification via Web3Forms if key exists
      const web3FormsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
      if (web3FormsKey) {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: web3FormsKey,
            subject: `New Portfolio Contact from ${name}`,
            from_name: "Portfolio Contact Form",
            name,
            email,
            message,
          }),
        }).catch(err => console.error("Web3Forms error:", err)); // Don't crash if email fails
      }

      toast.success("Message sent successfully! I'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again or email me directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 container mx-auto px-4 md:px-8 bg-background">
      <SectionHeading 
        title="Get In Touch" 
        subtitle="Have a question or want to work together? Feel free to drop a message."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center"
        >
          <h3 className="text-2xl font-bold text-foreground mb-6">Let&apos;s build something great together.</h3>
          <p className="text-foreground/80 mb-8 leading-relaxed">
            I&apos;m currently open for new opportunities. Whether you have a project to discuss or just want to say hi, my inbox is open.
          </p>
          
          <div className="flex flex-col space-y-6">
            <div className="flex items-center text-foreground hover:text-primary transition-colors group">
              <div className="w-12 h-12 bg-card border-2 border-primary shadow-[2px_2px_0_0_#000] group-hover:shadow-[4px_4px_0_0_#000] flex items-center justify-center mr-4 transition-all">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <a href={`mailto:${siteConfig.social.email}`} className="text-lg font-medium">
                {siteConfig.social.email}
              </a>
            </div>

            <div className="flex items-center text-foreground hover:text-primary transition-colors group">
              <div className="w-12 h-12 bg-[#25D366]/10 border-2 border-[#25D366] shadow-[2px_2px_0_0_#000] group-hover:shadow-[4px_4px_0_0_#000] flex items-center justify-center mr-4 transition-all">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
              </div>
              <a href="https://wa.me/6282162746388" target="_blank" rel="noopener noreferrer" className="text-lg font-medium">
                +62 821-6274-6388
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-6 md:p-8 bg-card border-2 border-primary shadow-[6px_6px_0_0_#000]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">Name</label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  className="bg-background border-2 border-primary focus-visible:ring-0 focus-visible:border-black text-foreground rounded-none shadow-[2px_2px_0_0_#000]" 
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">Email</label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  className="bg-background border-2 border-primary focus-visible:ring-0 focus-visible:border-black text-foreground rounded-none shadow-[2px_2px_0_0_#000]" 
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-primary mb-2 uppercase tracking-wider">Message</label>
                <Textarea 
                  id="message" 
                  name="message" 
                  required 
                  rows={5}
                  className="bg-background border-2 border-primary focus-visible:ring-0 focus-visible:border-black text-foreground resize-none rounded-none shadow-[2px_2px_0_0_#000]" 
                  placeholder="How can I help you?"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-black rounded-none shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
