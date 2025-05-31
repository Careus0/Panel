
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, UserCircle, Settings, LogOut, MessageSquare } from "lucide-react"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "./theme-toggle";

export function AppHeader() {
  const router = useRouter();
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
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>
      <div className="flex items-center gap-2 sm:gap-4"> 
        <ThemeToggle /> 
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Obrolan Langsung" onClick={handleLiveChat}>
          <MessageSquare className="h-5 w-5" />
          <span className="sr-only">Obrolan Langsung</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notifikasi">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifikasi</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="Menu Pengguna">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/100x100.png" alt="Avatar Pengguna" data-ai-hint="user avatar" />
                <AvatarFallback>AP</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel> 
            
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserCircle className="mr-2 h-4 w-4" />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings"> 
                <Settings className="mr-2 h-4 w-4" />
                Pengaturan
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
