"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { PricingPlan } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, CreditCard, CalendarDays, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// For prototype simplicity, plan data is included here.
const allAvailablePlans: PricingPlan[] = [
  {
    id: "trial_daily_monthly",
    name: "Uji Coba Harian",
    price: "Rp 0 (1 Hari)",
    userbotSlotsDescription: "1 Slot Userbot",
    features: ["Akses ke fitur Pro", "Berlaku selama 24 jam", "Pencatatan Standar", "Dukungan Komunitas"],
    cta: "Mulai Uji Coba Gratis",
  },
  {
    id: "pro_monthly",
    name: "Pro Bulanan",
    price: "Rp 29.000/bulan",
    userbotSlotsDescription: "5 Slot Userbot",
    features: ["Kontrol Bot Lanjutan", "Pencatatan Diperpanjang", "Dukungan Prioritas", "5 Pengaturan AutoBC", "Akses Awal ke Fitur"],
    highlight: true,
    cta: "Pilih Pro",
  },
  {
    id: "enterprise_monthly",
    name: "Enterprise Bulanan",
    price: "Rp 79.000/bulan",
    userbotSlotsDescription: "20 Slot Userbot",
    features: ["Semua Fitur Pro", "Agen Dukungan Khusus", "Integrasi Kustom", "Pengaturan AutoBC Tanpa Batas", "Akses API"],
    cta: "Pilih Enterprise",
  },
  {
    id: "trial_daily_yearly", 
    name: "Uji Coba Harian",
    price: "Rp 0 (1 Hari)",
    userbotSlotsDescription: "1 Slot Userbot",
    features: ["Akses ke fitur Pro", "Berlaku selama 24 jam", "Pencatatan Standar", "Dukungan Komunitas"],
    cta: "Mulai Uji Coba Gratis",
  },
  {
    id: "pro_yearly",
    name: "Pro Tahunan",
    price: "Rp 290.000/tahun",
    userbotSlotsDescription: "5 Slot Userbot",
    features: ["Kontrol Bot Lanjutan", "Pencatatan Diperpanjang", "Dukungan Prioritas", "5 Pengaturan AutoBC", "Akses Awal ke Fitur", "Ditagih Tahunan"],
    highlight: true,
    cta: "Pilih Pro",
  },
  {
    id: "enterprise_yearly",
    name: "Enterprise Tahunan",
    price: "Rp 790.000/tahun",
    userbotSlotsDescription: "20 Slot Userbot",
    features: ["Semua Fitur Pro", "Agen Dukungan Khusus", "Integrasi Kustom", "Pengaturan AutoBC Tanpa Batas", "Akses API", "Ditagih Tahunan"],
    cta: "Pilih Enterprise",
  },
];

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const planId = searchParams.get("planId");
    if (planId) {
      const plan = allAvailablePlans.find(p => p.id === planId);
      if (plan) {
        setSelectedPlan(plan);
      } else {
        toast({ title: "Error", description: "Paket yang dipilih tidak ditemukan. Silakan coba lagi.", variant: "destructive" });
        router.push("/pricing");
      }
    } else {
       toast({ title: "Error", description: "Tidak ada paket yang dipilih. Silakan pilih paket terlebih dahulu.", variant: "destructive" });
       router.push("/pricing");
    }
    setIsLoading(false);
  }, [searchParams, router, toast]);

  const handleConfirmPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);
    
    const isTrial = selectedPlan?.price.startsWith("Rp 0");

    console.log(`Menyimulasikan ${isTrial ? "aktivasi uji coba" : "pembayaran"} untuk paket:`, selectedPlan?.name);
    await new Promise(resolve => setTimeout(resolve, isTrial ? 1000 : 2000)); 

    setIsProcessing(false);
    toast({
      title: isTrial ? "Uji Coba Diaktifkan!" : "Pembayaran Berhasil!",
      description: `Anda telah ${isTrial ? "mengaktifkan" : "berlangganan"} ${selectedPlan?.name}. ${isTrial ? "Nikmati akses 24 jam Anda!" : "Selamat bergabung!"}`,
      variant: "default",
      duration: 5000,
    });
    router.push("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl py-8 px-4 space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-6 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <Card className="shadow-lg">
            <CardHeader><Skeleton className="h-8 w-3/4" /><Skeleton className="h-10 w-1/2 mt-2" /></CardHeader>
            <CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6 mt-2" /><Skeleton className="h-4 w-full mt-2" /></CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader><Skeleton className="h-8 w-3/4" /><Skeleton className="h-6 w-full mt-2" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-2 gap-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
        <div className="flex flex-col justify-center items-center h-[calc(100vh-10rem)] text-center">
            <h2 className="text-2xl font-semibold text-muted-foreground">Paket Tidak Ditemukan</h2>
            <p className="text-muted-foreground mt-2">Kami tidak dapat menemukan detail paket. Silakan kembali ke halaman harga dan pilih paket.</p>
            <Button onClick={() => router.push('/pricing')} className="mt-6">Ke Halaman Harga</Button>
        </div>
    );
  }

  const isTrialPlan = selectedPlan.price.startsWith("Rp 0");

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground">
          Anda akan {isTrialPlan ? "mengaktifkan uji coba Anda" : "berlangganan"}. Harap konfirmasi paket Anda {isTrialPlan ? "" : "dan masukkan detail pembayaran"}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Paket Anda: {selectedPlan.name}</CardTitle>
            <CardDescription className="text-3xl font-bold text-foreground mt-1">
              {selectedPlan.price.split('(')[0].trim()}
              {selectedPlan.price.includes('/') && !isTrialPlan && (
                <span className="text-sm font-normal text-muted-foreground">/{selectedPlan.price.split('/')[1].split('(')[0].trim()}</span>
              )}
               {selectedPlan.price.includes('(') && (
                <span className="text-sm font-normal text-muted-foreground"> ({selectedPlan.price.split('(')[1]}</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Termasuk {selectedPlan.userbotSlotsDescription}.
            </p>
            <h4 className="font-medium mb-2 text-sm">Fitur Utama:</h4>
            <ul className="space-y-1.5">
              {selectedPlan.features.slice(0, 5).map((feature, index) => (
                <li key={index} className="flex items-start text-sm">
                  <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
              {selectedPlan.features.length > 5 && <li className="text-sm text-muted-foreground ml-6">...dan lainnya.</li>}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              {isTrialPlan ? "Konfirmasi Aktivasi Uji Coba" : "Informasi Pembayaran"}
            </CardTitle>
            <CardDescription>
              {isTrialPlan ? "Konfirmasi untuk mengaktifkan uji coba gratis Anda." : "Masukkan detail pembayaran Anda. Semua transaksi aman (simulasi)."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleConfirmPayment} className="space-y-4">
              {!isTrialPlan && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="cardName">Nama pada Kartu</Label>
                    <Input id="cardName" type="text" placeholder="John M. Doe" required className="text-base"/>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cardNumber">Nomor Kartu</Label>
                    <div className="relative">
                      <Input id="cardNumber" type="text" placeholder="•••• •••• •••• ••••" required className="text-base"/>
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="expiryDate">Tanggal Kedaluwarsa</Label>
                       <div className="relative">
                        <Input id="expiryDate" type="text" placeholder="BB / TT" required className="text-base"/>
                        <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cvc">CVC</Label>
                      <div className="relative">
                        <Input id="cvc" type="text" placeholder="•••" required className="text-base"/>
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </>
              )}
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base whitespace-normal text-center h-auto" 
                disabled={isProcessing}
              >
                {isProcessing 
                  ? "Memproses..." 
                  : (isTrialPlan ? `Aktifkan ${selectedPlan.name}` :`Konfirmasi & Berlangganan ${selectedPlan.name}`)
                }
              </Button>
            </form>
          </CardContent>
           <CardFooter className="flex-col items-start gap-2">
            {!isTrialPlan && (
              <p className="text-xs text-muted-foreground">
                  Ini adalah pembayaran simulasi. Tidak ada transaksi nyata yang akan terjadi.
              </p>
            )}
            <p className="text-xs text-muted-foreground">
                Dengan mengklik "{isTrialPlan ? `Aktifkan ${selectedPlan.name}` : `Konfirmasi & Berlangganan ${selectedPlan.name}`}", Anda mengakui ini adalah demo dan menyetujui Persyaratan Layanan placeholder kami.
            </p>
           </CardFooter>
        </Card>
      </div>
       <div className="mt-10 text-center">
        <Button variant="outline" onClick={() => router.push('/pricing')} disabled={isProcessing}>
            Ubah Paket atau Kembali
        </Button>
       </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto max-w-3xl py-8 px-4 space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-6 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <Card className="shadow-lg">
            <CardHeader><Skeleton className="h-8 w-3/4" /><Skeleton className="h-10 w-1/2 mt-2" /></CardHeader>
            <CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6 mt-2" /><Skeleton className="h-4 w-full mt-2" /></CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader><Skeleton className="h-8 w-3/4" /><Skeleton className="h-6 w-full mt-2" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-2 gap-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  );
}
