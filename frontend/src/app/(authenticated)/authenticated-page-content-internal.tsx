
"use client";

import { SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { useLoading } from "@/context/loading-context";
import { PageLoader } from "@/components/ui/page-loader";
import type { ReactNode } from "react";

export function AuthenticatedPageContentInternal({ children }: { children: ReactNode }) {
  const { isLoading } = useLoading();
  return (
    <>
      {isLoading && <PageLoader />}
      <AppSidebar />
      <SidebarRail />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}
