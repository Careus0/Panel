
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save } from "lucide-react";

export default function ProfilePage() {
  const user = {
    firstName: "Pengguna", // Diubah
    lastName: "Sentinel", // Diubah
    email: "user@sentinel.com", // Diubah
    avatarUrl: "https://placehold.co/150x150.png",
    bio: "Penggemar bot Telegram dan pengguna Sentinel Ubot.", // Diubah
  };

  const handleSaveChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Menyimulasikan penyimpanan perubahan profil..."); // Diubah
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil Pengguna</h1>
        <p className="text-muted-foreground">
          Lihat dan kelola informasi profil Anda.
        </p>
      </div>

      <form onSubmit={handleSaveChanges}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Informasi Pribadi</CardTitle>
            <CardDescription>Perbarui detail pribadi dan avatar Anda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <div className="relative">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                  <AvatarImage src={user.avatarUrl} alt="Avatar Pengguna" data-ai-hint="user avatar" /> 
                  <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full bg-background"
                  aria-label="Ubah avatar" 
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-grow space-y-4 text-center sm:text-left">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">Nama Depan</Label>
                    <Input id="firstName" defaultValue={user.firstName} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Nama Belakang</Label>
                    <Input id="lastName" defaultValue={user.lastName} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Alamat Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} disabled />
                  <p className="text-xs text-muted-foreground">Email tidak dapat diubah untuk demo ini.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio Singkat</Label>
              <textarea
                id="bio"
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={user.bio}
                placeholder="Ceritakan sedikit tentang diri Anda" 
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
