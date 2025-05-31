
import { Bot } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  showText?: boolean;
}

export function Logo({ className, showText = true, ...divProps }: LogoProps) {
  return (
    <div
      className={cn(
        "flex items-center",
        showText ? "gap-x-2" : "w-full justify-center", // if showText, use gap. If not (collapsed), fill width and center icon.
        className
      )}
      {...divProps}
    >
      <Bot className="h-8 w-8 shrink-0" /> {/* Increased icon size */}
      {showText && <h1 className="text-2xl font-semibold whitespace-nowrap">Sentinel Ubot</h1>} {/* Increased text size */}
    </div>
  );
}
