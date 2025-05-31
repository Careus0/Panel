
"use client";

import { useState } from "react";
import type { Subscription } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Edit, XCircle, ExternalLink, Star } from "lucide-react";
import Link from "next/link";

const initialSubscriptions: Subscription[] = [
  {
    id: "pro_monthly_active",
    name: "Paket Pro", // Diubah
    price: "Rp 29.000/bulan", // Diubah
    userbotSlotsDescription: "5 Slot Userbot", // Diubah
    features: ["Kontrol Bot Lanjutan", "Pencatatan Diperpanjang", "Dukungan Prioritas", "5 Pengaturan AutoBC", "Akses Awal ke Fitur"], // Diubah
    subscribedOn: "2023-10-15",
    renewsOn: "2024-08-15",
    isActive: true,
    cta: "Kelola Paket", // Diubah
    highlight: true,
  },
  {
    id: "enterprise_monthly_cancelled",
    name: "Paket Enterprise (Dibatalkan)", // Diubah
    price: "Rp 79.000/bulan", // Diubah
    userbotSlotsDescription: "20 Slot Userbot", // Diubah
    features: ["Semua Fitur Pro", "Agen Dukungan Khusus", "Integrasi Kustom", "Pengaturan AutoBC Tanpa Batas"], // Diubah
    subscribedOn: "2023-01-01",
    isActive: false,
    cta: "Aktifkan Kembali Paket", // Diubah
  }
];

export default function SubscriptionManagementPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);

  const handleManagePlan = (subscriptionId: string) => {
    console.log(`Mengelola paket ${subscriptionId}`);
  };

  const handleReactivatePlan = (subscriptionId: string) => {
    console.log(`Mengaktifkan kembali paket ${subscriptionId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Langganan Saya</h1>
        <p className="text-muted-foreground">Lihat dan kelola langganan aktif dan sebelumnya.</p>
      </div>

      {subscriptions.length > 0 ? (
        <div className="space-y-6">
          {subscriptions.map((sub) => (
            <Card key={sub.id} className={`shadow-lg ${sub.isActive && sub.highlight ? 'border-primary border-2' : 'border'}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                      {sub.name}
                      {sub.highlight && sub.isActive && <Star className="h-5 w-5 text-yellow-500 fill-yellow-400" />}
                    </CardTitle>
                    <CardDescription className="text-lg font-bold text-foreground">{sub.price}</CardDescription>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${sub.isActive ? 'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-700/20 dark:text-slate-300'}`}>
                    {sub.isActive ? "Aktif" : "Dibatalkan"} 
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {sub.userbotSlotsDescription}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {sub.features.slice(0,3).map((feature, index) => ( 
                    <li key={index} className="flex items-center text-sm">
                      {sub.isActive ? <CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> : <XCircle className="mr-2 h-4 w-4 text-muted-foreground" />}
                      {feature}
                    </li>
                  ))}
                  {sub.features.length > 3 && <li className="text-sm text-muted-foreground ml-6">...dan lainnya</li>} 
                </ul>
                <div className="mt-4 text-xs text-muted-foreground space-y-0.5">
                  <p>Berlangganan pada: {new Date(sub.subscribedOn).toLocaleDateString('id-ID')}</p> 
                  {sub.isActive && sub.renewsOn && (
                    <p>Diperbarui pada: {new Date(sub.renewsOn).toLocaleDateString('id-ID')}</p> 
                  )}
                  {!sub.isActive && (
                     <p>Berakhir pada: {new Date(new Date(sub.subscribedOn).setMonth(new Date(sub.subscribedOn).getMonth() + (sub.price.includes("month") || sub.price.includes("bulan") ? 1 : 12) )).toLocaleDateString('id-ID')} (Contoh)</p> // Diubah
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                {sub.isActive ? (
                  <Button variant="outline" onClick={() => handleManagePlan(sub.id)}>
                    <Edit className="mr-2 h-4 w-4" /> {sub.cta}
                  </Button>
                ) : (
                  <Button variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => handleReactivatePlan(sub.id)}>
                    {sub.cta}
                  </Button>
                )}
                <Button variant="link" className="ml-auto text-primary">
                  Lihat Faktur <ExternalLink className="ml-1 h-3 w-3"/> 
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-muted-foreground">Tidak ada langganan aktif.</h3>
          <p className="text-muted-foreground mt-1">
            Kunjungi halaman <Link href="/pricing" className="text-primary hover:underline">harga</Link> kami untuk memilih paket. 
          </p>
        </div>
      )}
       <div className="text-center mt-8">
            <Link href="/pricing">
                <Button variant="default" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Jelajahi Semua Paket
                </Button>
            </Link>
        </div>
    </div>
  );
}
