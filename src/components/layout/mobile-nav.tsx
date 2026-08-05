"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { motion } from "framer-motion";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger 
        render={<Button variant="ghost" size="icon" className="text-foreground" />}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle menu</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-full h-full bg-background/80 backdrop-blur-2xl border-l-4 border-primary p-8 flex flex-col justify-center">
        <SheetHeader className="absolute top-8 left-8">
          <SheetTitle className="text-left text-2xl text-foreground font-black tracking-tighter uppercase">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-6 mt-16">
          {siteConfig.navItems.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
            >
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-4xl sm:text-6xl font-black text-foreground hover:text-primary hover:pl-4 transition-all tracking-tight uppercase inline-block"
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
