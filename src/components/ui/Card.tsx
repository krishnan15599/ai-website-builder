import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface-elevated text-foreground shadow-soft-md p-5 transition-shadow duration-200 hover:shadow-soft-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
