
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { KeyRound, Smartphone, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { Bot } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface AddNewBotDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onBotAdded: (newBotData: { name: string; method: 'session' | 'phone'; sessionString?: string; phoneNumber?: string }) => void;
}

export function AddNewBotDialog({ isOpen, onOpenChange, onBotAdded }: AddNewBotDialogProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("session");
  const [botName, setBotName] = useState("");
  const [sessionString, setSessionString] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (activeTab === "session") {
      if (!botName.trim() || !sessionString.trim()) {
        toast({ title: "Kesalahan Validasi", description: "Nama Bot dan String Sesi diperlukan.", variant: "destructive" }); // Diubah
        setIsSubmitting(false);
        return;
      }
      console.log("Menambahkan bot dengan string sesi:", { name: botName, sessionString });
      onBotAdded({ name: botName, method: 'session', sessionString });
    } else { 
      if (!botName.trim() || !phoneNumber.trim()) {
        toast({ title: "Kesalahan Validasi", description: "Nama Bot dan Nomor Telepon diperlukan.", variant: "destructive" }); // Diubah
        setIsSubmitting(false);
        return;
      }
      console.log("Menambahkan bot via nomor telepon:", { name: botName, phoneNumber });
      toast({ title: "OTP (Simulasi)", description: `OTP akan dikirim ke ${phoneNumber}. (Bagian ini tidak diimplementasikan dalam prototipe)` }); // Diubah
      onBotAdded({ name: botName, method: 'phone', phoneNumber });
    }

    setIsSubmitting(false);
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    if (isOpen) {
        setBotName("");
        setSessionString("");
        setPhoneNumber("");
    }
    onOpenChange(false);
  };
  
  const handleTabChange = (value: string) => {
    setBotName(""); 
    setActiveTab(value);
  }


  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Tambah Userbot Sentinel Baru</DialogTitle> 
          <DialogDescription>
            Pilih metode pilihan Anda untuk menambahkan dan mengkonfigurasi userbot baru.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto py-1 pr-2 space-y-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sticky top-0 bg-background z-10">
              <TabsTrigger value="session" disabled={isSubmitting}>
                <KeyRound className="mr-2 h-4 w-4" /> Gunakan String Sesi
              </TabsTrigger>
              <TabsTrigger value="phone" disabled={isSubmitting}>
                <Smartphone className="mr-2 h-4 w-4" /> Buat Baru
              </TabsTrigger>
            </TabsList>
            
            <div className="space-y-1.5 pt-4">
              <Label htmlFor="botNameGeneral">Nama Bot</Label>
              <Input
                id="botNameGeneral"
                placeholder="Contoh: Bot Pemasaran Saya" // Diubah
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <TabsContent value="session" className="space-y-4 pt-0">
              <div className="space-y-1.5">
                <Label htmlFor="sessionString">String Sesi Telegram</Label>
                <Textarea
                  id="sessionString"
                  placeholder="Tempel string sesi Telethon atau Pyrogram Anda di sini" // Diubah
                  rows={5}
                  value={sessionString}
                  onChange={(e) => setSessionString(e.target.value)}
                  required={activeTab === 'session'}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Pastikan string sesi ini dirahasiakan. String yang tidak valid akan gagal.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="phone" className="space-y-4 pt-0">
              <div className="space-y-1.5">
                <Label htmlFor="phoneNumber">Nomor Telepon (dengan kode negara)</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Contoh: +6281234567890" // Diubah
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required={activeTab === 'phone'}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Anda akan (disimulasikan) menerima OTP di Telegram untuk verifikasi.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter className="mt-6 pt-4 border-t sticky bottom-0 bg-background z-10 pb-1">
            <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]">
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...</> 
              ) : (activeTab === "session" ? "Tambah Bot" : "Buat & Tambah Bot")} 
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
