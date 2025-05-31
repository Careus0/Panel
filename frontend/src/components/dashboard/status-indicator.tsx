
import { cn } from "@/lib/utils";
import type { Bot } from "@/types";

interface StatusIndicatorProps {
  status: Bot['status'];
  className?: string;
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const statusStyles = {
    online: "bg-green-500",
    offline: "bg-slate-400",
    restarting: "bg-yellow-500 animate-pulse",
    error: "bg-red-500",
  };

  const statusText = {
    online: "Online",
    offline: "Offline",
    restarting: "Memulai Ulang", // Diubah
    error: "Error",
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "h-3 w-3 rounded-full",
          statusStyles[status]
        )}
        title={statusText[status]}
      />
      <span className="text-sm capitalize text-muted-foreground">{statusText[status]}</span>
    </div>
  );
}
