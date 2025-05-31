
"use client";
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface LoadingContextType {
  isLoading: boolean;
  // We might not need to expose setIsLoading if the provider handles all state changes.
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    // Only trigger loading if the pathname has actually changed from the previous one
    // and it's not the initial render (previousPathnameRef.current is not null).
    if (previousPathnameRef.current !== null && previousPathnameRef.current !== pathname) {
      setIsLoading(true);
      // Simulate loading time
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 750); // Adjust delay as needed

      return () => clearTimeout(timer);
    }
    
    // Update previous pathname *after* the check for the next navigation cycle.
    // This ensures on the very first load, we don't set isLoading to true.
    if (previousPathnameRef.current === null && pathname) {
        previousPathnameRef.current = pathname;
    } else if (previousPathnameRef.current !== pathname) {
        previousPathnameRef.current = pathname;
    }

  }, [pathname]);

  return (
    <LoadingContext.Provider value={{ isLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading(): LoadingContextType {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
