"use client";

import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-primary"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link href={siteConfig.social.github} target="_blank" rel="noreferrer">
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
              <FaGithub className="h-5 w-5" />
            </Button>
          </Link>
          <Link href={siteConfig.social.linkedin} target="_blank" rel="noreferrer">
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
              <FaLinkedin className="h-5 w-5" />
            </Button>
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
