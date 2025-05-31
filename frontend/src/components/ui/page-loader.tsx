
"use client";

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex space-x-2">
        <div className="h-3 w-3 rounded-full bg-primary animate-bounce-dot-loader"></div>
        <div 
          className="h-3 w-3 rounded-full bg-primary animate-bounce-dot-loader" 
          style={{ animationDelay: '-0.16s' }}
        ></div>
        <div 
          className="h-3 w-3 rounded-full bg-primary animate-bounce-dot-loader" 
          style={{ animationDelay: '-0.32s' }}
        ></div>
      </div>
    </div>
  );
}
