
import * as React from "react"; // Ensure React is imported for React.use
import { SidebarProvider } from "@/components/ui/sidebar";
import { LoadingProvider } from "@/context/loading-context";
import type { ReactNode } from "react";
import { AuthenticatedPageContentInternal } from "./authenticated-page-content-internal";

interface AuthenticatedLayoutProps {
  children: ReactNode;
  params?: unknown; // Route params can be passed to layouts. Treat as unknown for React.use.
}

export default function AuthenticatedLayout({
  children,
  params,
}: AuthenticatedLayoutProps) {
  // Speculative: If `params` is a promise-like object passed by Next.js to layouts,
  // `React.use` will attempt to resolve it. This might influence how Next.js
  // handles it further down the server-side render tree, potentially avoiding
  // the enumeration error if the raw promise-like object was being enumerated.
  // This does not fix an explicit `Object.keys(params).filter()` on the original prop elsewhere.
  if (params) {
    try {
      // We are not using the result of this directly in this component,
      // but calling React.use might change how Next.js processes `params`.
      // Cast to Promise<any> as React.use expects a Promise or Context.
      React.use(params as Promise<any>);
    } catch (error) {
      // Handle or log suspense/error if necessary.
      // console.error("Error using params in AuthenticatedLayout:", error);
    }
  }

  return (
    <LoadingProvider>
      <SidebarProvider defaultOpen>
        <AuthenticatedPageContentInternal>
          {children}
        </AuthenticatedPageContentInternal>
      </SidebarProvider>
    </LoadingProvider>
  );
}
