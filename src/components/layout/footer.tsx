import { siteConfig } from "@/config/site";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="border-t-2 border-primary bg-background py-12 text-foreground/80">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <span className="text-xl font-bold text-primary">
            {siteConfig.name}
          </span>
          <p className="mt-2 text-sm max-w-sm">
            {siteConfig.bio}
          </p>
        </div>
        
        <div className="flex flex-col items-center md:items-end">
          <div className="flex space-x-4 mb-4">
            <a href={siteConfig.social.github} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              <span className="sr-only">GitHub</span>
              <FaGithub className="h-5 w-5" />
            </a>
            <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              <span className="sr-only">LinkedIn</span>
              <FaLinkedin className="h-5 w-5" />
            </a>
            <a href={siteConfig.social.twitter} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              <span className="sr-only">Twitter</span>
              <FaTwitter className="h-5 w-5" />
            </a>
            <a href={`mailto:${siteConfig.social.email}`} className="hover:text-foreground transition-colors">
              <span className="sr-only">Email</span>
              <Mail className="h-5 w-5" />
            </a>
          </div>
          <p className="text-sm text-foreground/60">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
