
"use client";

import { PricingCard } from "@/components/pricing/pricing-card";
import type { PricingPlan } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";

const monthlyPlans: PricingPlan[] = [
  {
    id: "trial_daily_monthly",
    name: "Uji Coba Harian", // Diubah
    price: "Rp 0 (1 Hari)", // Diubah
    userbotSlotsDescription: "1 Slot Userbot", // Diubah
    features: ["Akses ke fitur Pro", "Berlaku selama 24 jam", "Pencatatan Standar", "Dukungan Komunitas"], // Diubah
    cta: "Mulai Uji Coba Gratis", // Diubah
  },
  {
    id: "pro_monthly",
    name: "Pro",
    price: "Rp 29.000/bulan", // Diubah
    userbotSlotsDescription: "5 Slot Userbot", // Diubah
    features: ["Kontrol Bot Lanjutan", "Pencatatan Diperpanjang", "Dukungan Prioritas", "5 Pengaturan AutoBC", "Akses Awal ke Fitur"], // Diubah
    highlight: true,
    cta: "Pilih Pro", // Diubah
  },
  {
    id: "enterprise_monthly",
    name: "Enterprise",
    price: "Rp 79.000/bulan", // Diubah
    userbotSlotsDescription: "20 Slot Userbot", // Diubah
    features: ["Semua Fitur Pro", "Agen Dukungan Khusus", "Integrasi Kustom", "Pengaturan AutoBC Tanpa Batas", "Akses API"], // Diubah
    cta: "Pilih Enterprise", // Diubah
  },
  {
    id: "custom_monthly",
    name: "Kustom / Dipesan", // Diubah
    price: "Hubungi Kami", // Diubah
    userbotSlotsDescription: "Slot Skalabel & Disesuaikan", // Diubah
    features: [
      "Slot userbot berbasis volume",
      "Pengembangan fitur kustom",
      "Opsi infrastruktur khusus",
      "Keamanan tingkat perusahaan",
      "Dukungan personal & SLA",
    ], // Diubah
    cta: "Hubungi Penjualan", // Diubah
  },
];

const yearlyPlans: PricingPlan[] = [
   {
    id: "trial_daily_yearly",
    name: "Uji Coba Harian", // Diubah
    price: "Rp 0 (1 Hari)", // Diubah
    userbotSlotsDescription: "1 Slot Userbot", // Diubah
    features: ["Akses ke fitur Pro", "Berlaku selama 24 jam", "Pencatatan Standar", "Dukungan Komunitas"], // Diubah
    cta: "Mulai Uji Coba Gratis", // Diubah
  },
  {
    id: "pro_yearly",
    name: "Pro",
    price: "Rp 290.000/tahun", // Diubah
    userbotSlotsDescription: "5 Slot Userbot", // Diubah
    features: ["Kontrol Bot Lanjutan", "Pencatatan Diperpanjang", "Dukungan Prioritas", "5 Pengaturan AutoBC", "Akses Awal ke Fitur", "Ditagih Tahunan"], // Diubah
    highlight: true,
    cta: "Pilih Pro", // Diubah
  },
  {
    id: "enterprise_yearly",
    name: "Enterprise",
    price: "Rp 790.000/tahun", // Diubah
    userbotSlotsDescription: "20 Slot Userbot", // Diubah
    features: ["Semua Fitur Pro", "Agen Dukungan Khusus", "Integrasi Kustom", "Pengaturan AutoBC Tanpa Batas", "Akses API", "Ditagih Tahunan"], // Diubah
    cta: "Pilih Enterprise", // Diubah
  },
  {
    id: "custom_yearly",
    name: "Kustom / Dipesan", // Diubah
    price: "Hubungi Kami", // Diubah
    userbotSlotsDescription: "Slot Skalabel & Disesuaikan (Tagihan Tahunan)", // Diubah
    features: [
      "Slot userbot berbasis volume",
      "Pengembangan fitur kustom",
      "Opsi infrastruktur khusus",
      "Keamanan tingkat perusahaan",
      "Dukungan personal & SLA",
      "Tagihan tahunan dengan potensi diskon lebih lanjut",
    ], // Diubah
    cta: "Hubungi Penjualan", // Diubah
  },
];


export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const plansToDisplay = isYearly ? yearlyPlans : monthlyPlans;
  const router = useRouter();

  const handleSubscribe = (planId: string) => {
    if (planId.startsWith("custom_")) {
        router.push("/help");
        return;
    }
    console.log(`Navigasi ke checkout untuk paket ${planId}`);
    router.push(`/checkout?planId=${planId}`);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Harga Fleksibel untuk Semua</h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
          Pilih paket sempurna untuk kebutuhan Sentinel Ubot Anda. Tanpa biaya tersembunyi, batalkan kapan saja.
        </p>
      </div>

      <div className="flex items-center justify-center space-x-3 my-8">
        <Label htmlFor="billing-cycle" className={!isYearly ? "text-primary font-semibold" : "text-muted-foreground"}>Bulanan</Label>
        <Switch
          id="billing-cycle"
          checked={isYearly}
          onCheckedChange={setIsYearly}
          aria-label="Ganti siklus penagihan" // Diubah
        />
        <Label htmlFor="billing-cycle" className={isYearly ? "text-primary font-semibold" : "text-muted-foreground"}>
          Tahunan <span className="text-xs text-green-600 font-medium">(Hemat ~16%)</span>
        </Label>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {plansToDisplay.map((plan) => (
          <PricingCard key={plan.id} plan={plan} onSubscribe={handleSubscribe} />
        ))}
      </div>
       <p className="text-center text-sm text-muted-foreground mt-12">
        Semua harga dalam IDR. Butuh solusi khusus? Paket "Kustom / Dipesan" kami dirancang untuk Anda.
      </p>
    </div>
  );
}
