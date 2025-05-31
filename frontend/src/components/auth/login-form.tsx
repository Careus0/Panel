"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";

// TypeScript interface for Telegram auth data
interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  const handleTelegramAuth = async (user: TelegramAuthData) => {
    setIsLoading(true);
    
    try {
      // Use auth context to login
      await login(user);

      toast({
        title: "Login Berhasil",
        description: `Selamat datang, ${user.first_name}!`,
        duration: 3000,
      });

      // Redirect to dashboard after a short delay to show the welcome message
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
      
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Login Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat login. Pastikan Anda menggunakan akun Telegram yang valid.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Define global callback function for Telegram widget
    (window as any).onTelegramAuth = handleTelegramAuth;

    // Create and append the Telegram login button script
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', 'Mr_Sakamotobot');
    script.setAttribute('data-size', 'medium');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    
    const container = document.getElementById('telegram-login-widget');
    if (container) {
      container.innerHTML = ''; // Clear any existing content
      container.appendChild(script);
      setScriptLoaded(true);
    }

    // Cleanup function when component unmounts
    return () => {
      delete (window as any).onTelegramAuth;
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  const handleScriptError = () => {
    setScriptLoaded(false);
    setScriptError(true);
    toast({
      title: "Error",
      description: "Gagal memuat widget Telegram. Silakan refresh halaman atau coba lagi nanti.",
      variant: "destructive",
      duration: 5000,
    });
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Masuk ke Sentinel Ubot</CardTitle>
        <CardDescription className="text-center">
          Klik tombol di bawah untuk masuk atau mendaftar melalui Telegram.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        {isLoading && (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Memproses login...</span>
          </div>
        )}
        
        {!scriptLoaded && !scriptError && (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Memuat widget Telegram...</span>
          </div>
        )}

        <div id="telegram-login-widget">
          {/* Telegram widget will be injected here by useEffect */}
        </div>
        
        {scriptError && (
          <div className="text-center text-red-500">
            <p>Gagal memuat widget Telegram.</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-sm underline hover:text-red-600"
            >
              Klik disini untuk refresh halaman
            </button>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-center text-sm text-muted-foreground">
            Anda akan masuk menggunakan akun Telegram Anda.
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Pastikan Anda telah mengizinkan pop-up untuk situs ini.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
