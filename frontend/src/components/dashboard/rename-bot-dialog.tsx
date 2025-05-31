
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
import { useState, useEffect, type FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface RenameBotDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentBotName: string;
  onRenameConfirm: (newName: string) => Promise<void> | void;
}

export function RenameBotDialog({
  isOpen,
  onOpenChange,
  currentBotName,
  onRenameConfirm,
}: RenameBotDialogProps) {
  const { toast } = useToast();
  const [newBotName, setNewBotName] = useState(currentBotName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewBotName(currentBotName);
    }
  }, [isOpen, currentBotName]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newBotName.trim()) {
      toast({
        title: "Kesalahan Validasi", // Diubah
        description: "Nama bot tidak boleh kosong.", // Diubah
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await onRenameConfirm(newBotName.trim());
      onOpenChange(false); 
    } catch (error) {
      console.error("Ganti nama gagal:", error); // Diubah
      toast({
        title: "Error",
        description: "Gagal mengganti nama bot. Silakan coba lagi.", // Diubah
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ganti Nama Bot</DialogTitle> 
          <DialogDescription>
            Masukkan nama baru untuk bot Anda &quot;{currentBotName}&quot;.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="botName" className="text-right col-span-1">
                Nama Baru
              </Label>
              <Input
                id="botName"
                value={newBotName}
                onChange={(e) => setNewBotName(e.target.value)}
                className="col-span-3"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> 
              ) : (
                "Simpan Nama"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
