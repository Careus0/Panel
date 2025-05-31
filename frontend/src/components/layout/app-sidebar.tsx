
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import {
  LayoutDashboard,
  CreditCard,
  ShoppingBag,
  Settings,
  LogOut,
  HelpCircle,
  ShieldCheck,
  IdCard,
  MessageSquare,
} from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Data pengguna tiruan untuk ditampilkan di sidebar
const mockUserData = {
  userId: "usr_sn73kdn92",
  planName: "Pro Bulanan", // Diubah ke Bahasa Indonesia
  planStatus: "Aktif", // Diubah ke Bahasa Indonesia
};

const menuItems = [
  { href: "/dashboard", label: "Dasbor", icon: LayoutDashboard }, // Diubah
  { href: "/pricing", label: "Harga", icon: ShoppingBag }, // Diubah
  { href: "/subscriptions", label: "Langganan Saya", icon: CreditCard }, // Diubah
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const { toast } = useToast();

  const handleLogout = () => {
    router.push("/login");
  };

  const handleLiveChat = () => {
    toast({
      title: "Obrolan Langsung", // Diubah
      description: "Menghubungkan ke agen dukungan... (Simulasi)", // Diubah
      duration: 3000,
    });
    console.log("Obrolan langsung dimulai (simulasi).");
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="border-b border-sidebar-border items-center">
        <Logo
          className={cn(
            "text-sidebar-foreground h-10",
            state === 'expanded' ? "" : "w-10"
          )}
          showText={state === 'expanded'}
        />
      </SidebarHeader>

      {state === 'expanded' && (
        <>
          <SidebarSeparator className="my-3 bg-sidebar-border/50"/>
          <div className="px-3 py-2 text-xs text-sidebar-foreground/80 space-y-1.5">
            <div className="flex items-center gap-2">
              <IdCard className="h-4 w-4 text-sidebar-primary flex-shrink-0" />
              <div className="truncate">
                ID Pengguna: <span className="font-medium text-sidebar-foreground">{mockUserData.userId}</span> 
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-sidebar-primary flex-shrink-0" />
              <div className="truncate">
                Paket: <span className="font-medium text-sidebar-foreground">{mockUserData.planName}</span>
                (<span className="font-semibold text-green-400">{mockUserData.planStatus}</span>)
              </div>
            </div>
          </div>
          <SidebarSeparator className="mt-2 mb-1 bg-sidebar-border/50"/>
        </>
      )}

      <SidebarContent className={cn("p-2", state === 'expanded' ? 'pt-1' : 'pt-2')}>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                  tooltip={{ children: item.label, className:"bg-primary text-primary-foreground" }}
                  className={cn(
                    "justify-start",
                    (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)))
                      ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/admin" passHref legacyBehavior>
                    <SidebarMenuButton
                    isActive={pathname.startsWith("/admin")}
                    tooltip={{ children: "Panel Admin", className:"bg-primary text-primary-foreground" }} // Diubah
                     className={cn(
                        "justify-start",
                        pathname.startsWith("/admin")
                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    >
                        <ShieldCheck className="h-5 w-5" />
                        <span>Panel Admin</span> 
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLiveChat}
                  tooltip={{ children: "Obrolan Langsung", className:"bg-primary text-primary-foreground" }} // Diubah
                  className={cn(
                      "justify-start",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Obrolan Langsung</span> 
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <Link href="/settings" passHref legacyBehavior>
                    <SidebarMenuButton
                    isActive={pathname.startsWith("/settings")}
                    tooltip={{ children: "Pengaturan", className:"bg-primary text-primary-foreground" }} // Diubah
                     className={cn(
                        "justify-start",
                        pathname.startsWith("/settings")
                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    >
                        <Settings className="h-5 w-5" />
                        <span>Pengaturan</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                 <Link href="/help" passHref legacyBehavior>
                    <SidebarMenuButton
                    isActive={pathname.startsWith("/help")}
                    tooltip={{ children: "Bantuan & Dukungan", className:"bg-primary text-primary-foreground" }} // Diubah
                     className={cn(
                        "justify-start",
                        pathname.startsWith("/help")
                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    >
                        <HelpCircle className="h-5 w-5" />
                        <span>Bantuan & Dukungan</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarSeparator className="my-2 bg-sidebar-border/50"/>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip={{ children: "Keluar", className:"bg-destructive text-destructive-foreground" }} // Diubah
                className="justify-start text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
                <span>Keluar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
