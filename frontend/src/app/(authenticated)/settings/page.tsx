
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">
          Kelola preferensi akun dan aplikasi Anda.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Informasi Profil</CardTitle>
          <CardDescription>Perbarui detail pribadi Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">Nama Depan</Label>
              <Input id="firstName" defaultValue="Pengguna" /> 
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Nama Belakang</Label>
              <Input id="lastName" defaultValue="Sentinel" /> 
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Alamat Email</Label>
            <Input id="email" type="email" defaultValue="user@sentinel.com" disabled /> 
            <p className="text-xs text-muted-foreground">Email tidak dapat diubah.</p>
          </div>
           <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="mr-2 h-4 w-4" /> Simpan Profil
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Preferensi Notifikasi</CardTitle>
          <CardDescription>Pilih bagaimana Anda ingin diberitahu.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="emailNotifications" className="font-semibold">Notifikasi Email</Label>
              <p className="text-sm text-muted-foreground">Terima pembaruan dan peringatan melalui email.</p>
            </div>
            <Switch id="emailNotifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="pushNotifications" className="font-semibold">Notifikasi Push</Label>
              <p className="text-sm text-muted-foreground">Dapatkan peringatan waktu nyata di perangkat Anda.</p>
            </div>
            <Switch id="pushNotifications" />
          </div>
           <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="mr-2 h-4 w-4" /> Simpan Preferensi
          </Button>
        </CardContent>
      </Card>

       <Separator />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Keamanan</CardTitle>
          <CardDescription>Kelola pengaturan keamanan akun Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Button variant="outline">Ubah Kata Sandi</Button>
            <Button variant="destructive">Hapus Akun</Button>
             <p className="text-xs text-muted-foreground">Penghapusan akun bersifat permanen dan tidak dapat dibatalkan.</p>
        </CardContent>
      </Card>
    </div>
  );
}
