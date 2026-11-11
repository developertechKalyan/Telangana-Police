import type { ReactNode } from "react";

/** Animated underline that grows in from the left on hover. Parent element needs the `group` class. */
export function HoverUnderline({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`relative ${className}`}>
      {children}
      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent-400 transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </span>
  );
}
