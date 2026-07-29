import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle, className, ...props }: SectionHeadingProps) {
  return (
    <div className={cn("mb-12 flex flex-col items-center justify-center text-center", className)}>
      <h2 
        className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground"
        {...props}
      >
        {title}
      </h2>
      <div className="mt-4 h-1 w-20 bg-primary shadow-[2px_2px_0_0_#000]" />
      {subtitle && (
        <p className="mt-4 max-w-[700px] text-lg text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}
