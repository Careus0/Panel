
"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Settings, PlusCircle, Shuffle, BotMessageSquare, PackagePlus, Trash2, Forward, RotateCcw, Import, Type, Image, Gift, FileVideo, ListX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState, useEffect, type ChangeEvent } from "react";

interface GroupRule {
  id: string;
  groupId: string;
  customInterval: string;
  messageStrategy: string;
}

interface MessageVariant {
  id: string;
  text: string;
  mediaUrl: string;
  mediaFile?: File | null;
  mediaType: 'text' | 'photo' | 'gif' | 'video';
}

const defaultMessageText = "Halo dari Bot Sentinel!";
const defaultGlobalInterval = "300";
const defaultInterGroupDelay = "60";
const defaultInlineButtonConfig = "";
const defaultMessageSendingMode = "primary";
const defaultMessageForwardingMode = "new";

const staticInitialMessageVariant: MessageVariant = {
  id: 'initial-message-variant-static',
  text: defaultMessageText,
  mediaUrl: "",
  mediaFile: null,
  mediaType: 'text',
};


export default function BotConfigPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const botId = params.botId as string;
  const botName = searchParams.get("name") || "Bot Tidak Dikenal";

  const [messageVariants, setMessageVariants] = useState<MessageVariant[]>([
    { ...staticInitialMessageVariant }
  ]);
  // messageVariantSelectKeys are used to force re-render of Select components for mediaType
  // when their value changes programmatically or when new variants are added/removed.
  // This is a workaround for potential issues with Select component not reflecting new default values.
  const [messageVariantSelectKeys, setMessageVariantSelectKeys] = useState<Record<string, string>>({});


  const [globalInterval, setGlobalInterval] = useState(defaultGlobalInterval);
  const [interGroupDelay, setInterGroupDelay] = useState(defaultInterGroupDelay);
  const [inlineButtonConfig, setInlineButtonConfig] = useState(defaultInlineButtonConfig);
  const [messageSendingMode, setMessageSendingMode] = useState(defaultMessageSendingMode);
  const [messageForwardingMode, setMessageForwardingMode] = useState(defaultMessageForwardingMode);

  const [groupRules, setGroupRules] = useState<GroupRule[]>([]);
  // groupRuleSelectKeys are used similarly to messageVariantSelectKeys for group-specific strategy Selects.
  const [groupRuleSelectKeys, setGroupRuleSelectKeys] = useState<Record<string, string>>({});


  const handleAddGroupRule = () => {
    const newRuleId = `rule-${Date.now()}`;
    setGroupRules(prevRules => [
      ...prevRules,
      {
        id: newRuleId,
        groupId: "",
        customInterval: "",
        messageStrategy: "default",
      }
    ]);
    setGroupRuleSelectKeys(prevKeys => ({ ...prevKeys, [newRuleId]: `select-key-${Date.now()}` }));
  };

  const handleRemoveGroupRule = (ruleId: string) => {
    setGroupRules(prevRules => prevRules.filter(rule => rule.id !== ruleId));
    setGroupRuleSelectKeys(prevKeys => {
        const newKeys = {...prevKeys};
        delete newKeys[ruleId];
        return newKeys;
    });
  };

  const handleGroupRuleChange = (ruleId: string, field: keyof Omit<GroupRule, 'id'>, value: string) => {
    setGroupRules(prevRules =>
      prevRules.map(r => (r.id === ruleId ? { ...r, [field]: value } : r))
    );
    if (field === 'messageStrategy') {
      // Force re-render of Select if its value changes, helpful if options depend on other state
       setGroupRuleSelectKeys(prevKeys => ({ ...prevKeys, [ruleId]: `gr-select-key-${Date.now()}` }));
    }
  };

  const handleAddMessageVariant = () => {
    const newVariantId = `variant-${Date.now()}-${messageVariants.length}`;
    setMessageVariants(prevVariants => [
      ...prevVariants,
      { id: newVariantId, text: "", mediaUrl: "", mediaFile: null, mediaType: 'text' }
    ]);
    setMessageVariantSelectKeys(prevKeys => ({ ...prevKeys, [newVariantId]: `mv-select-key-${Date.now()}` }));
  };

  const handleRemoveMessageVariant = (variantId: string) => {
    if (messageVariants.length <= 1) {
        toast({ title: "Tidak Dapat Menghapus", description: "Minimal satu varian pesan diperlukan.", variant: "destructive" });
        return;
    }
    setMessageVariants(prevVariants => prevVariants.filter(variant => variant.id !== variantId));
    setMessageVariantSelectKeys(prevKeys => {
        const newKeys = {...prevKeys};
        delete newKeys[variantId];
        return newKeys;
    });
  };

  const handleMessageVariantChange = (
    variantId: string,
    field: keyof MessageVariant,
    value: string | ChangeEvent<HTMLInputElement> | File | null
  ) => {
    setMessageVariants(prevVariants =>
      prevVariants.map(variant => {
        if (variant.id === variantId) {
          if (field === 'mediaFile' && value instanceof File) {
            return {
              ...variant,
              mediaFile: value,
              mediaUrl: value.name // Display filename in mediaUrl if file is chosen
            };
          }
          if (field === 'mediaFile' && value === null) { // For clearing a file
             return { ...variant, mediaFile: null, mediaUrl: "" };
          }
          if (typeof value === 'string') {
            return { ...variant, [field]: value };
          }
          // Fallback for ChangeEvent on text/url inputs if still needed, though mediaFile handling is more specific
          if (typeof value !== 'string' && 'target' in value) {
             const targetValue = (value.target as HTMLInputElement).value;
             return { ...variant, [field]: targetValue };
          }
        }
        return variant;
      })
    );
    if (field === 'mediaType') {
        // Force re-render of Select if its value changes
        setMessageVariantSelectKeys(prevKeys => ({ ...prevKeys, [variantId]: `mv-type-key-${Date.now()}` }));
    }
  };


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formDataToSubmit = {
        botId,
        botName: decodeURIComponent(botName),
        messages: messageVariants.map(v => ({
            id: v.id,
            text: v.text,
            mediaType: v.mediaType,
            mediaSource: v.mediaFile ? `file_lokal: ${v.mediaFile.name}` : (v.mediaUrl ? `url_atau_namafile: ${v.mediaUrl}`: "tidak_ada_media"),
        })),
        messageSendingMode,
        messageForwardingMode,
        inlineButtonConfig,
        globalInterval,
        interGroupDelay,
        groupSpecificRules: groupRules,
    };

    console.log("Menyimulasikan penyimpanan konfigurasi lanjutan untuk bot:", botId);
    console.log("Data Formulir (simulasi simpan):", formDataToSubmit);

    toast({
      title: "Konfigurasi Disimpan",
      description: `Pengaturan lanjutan untuk ${decodeURIComponent(botName)} telah disimpan (simulasi).`,
    });
  };

  const handleResetConfiguration = () => {
    setMessageVariants([{ ...staticInitialMessageVariant, mediaFile: null }]);
    setMessageVariantSelectKeys({ [staticInitialMessageVariant.id]: `mv-select-key-reset-${Date.now()}` });
    setGlobalInterval(defaultGlobalInterval);
    setInterGroupDelay(defaultInterGroupDelay);
    setInlineButtonConfig(defaultInlineButtonConfig);
    setMessageSendingMode(defaultMessageSendingMode);
    setMessageForwardingMode(defaultMessageForwardingMode);
    setGroupRules([]);
    setGroupRuleSelectKeys({});

    toast({
        title: "Konfigurasi Direset",
        description: "Pengaturan telah direset ke default (simulasi).",
    });
  };

  const handleImportConfiguration = () => {
    toast({
        title: "Impor Konfigurasi",
        description: "Fitur ini adalah placeholder dan belum diimplementasikan.",
        variant: "default",
    });
    console.log("Menyimulasikan impor konfigurasi untuk bot:", botId);
  };


  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.push("/dashboard")} className="mb-4 print:hidden">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali ke Dasbor
      </Button>

      <div className="flex items-center gap-2 mb-2">
        <Settings className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">
          Konfigurasi Bot: {decodeURIComponent(botName)}
        </h1>
      </div>
      <p className="text-muted-foreground">ID Bot: {botId}</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BotMessageSquare className="h-5 w-5 text-primary" />
                  Manajemen Pesan
                </CardTitle>
                <CardDescription>Definisikan pesan (teks, media), strategi pengiriman, penerusan, dan tombol inline.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {messageVariants.map((variant, index) => (
                  <div key={variant.id} className="space-y-3 border-t pt-4 first:border-t-0 first:pt-0">
                     <div className="flex justify-between items-center">
                        <Label className="font-semibold text-md">
                          {messageVariants.length === 1 && index === 0 ? 'Pesan Utama' : (index === 0 ? 'Pesan Utama/Default' : `Pesan Alternatif ${index}`)}
                        </Label>
                        {messageVariants.length > 1 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-destructive h-7 px-2"
                                onClick={() => handleRemoveMessageVariant(variant.id)}
                                type="button"
                            >
                                <Trash2 className="mr-1 h-3 w-3" /> Hapus Varian
                            </Button>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor={`mediaType-${variant.id}`}>Tipe Media</Label>
                        <Select
                            value={variant.mediaType}
                            onValueChange={(value) => handleMessageVariantChange(variant.id, 'mediaType', value as MessageVariant['mediaType'])}
                            key={messageVariantSelectKeys[variant.id] || `mv-type-${variant.id}-default`}
                        >
                            <SelectTrigger id={`mediaType-${variant.id}`}>
                                <SelectValue placeholder="Pilih tipe media" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="text"><Type className="inline-block mr-2 h-4 w-4 opacity-70"/>Teks Saja</SelectItem>
                                <SelectItem value="photo"><Image className="inline-block mr-2 h-4 w-4 opacity-70"/>Foto</SelectItem>
                                <SelectItem value="gif"><Gift className="inline-block mr-2 h-4 w-4 opacity-70"/>GIF</SelectItem>
                                <SelectItem value="video"><FileVideo className="inline-block mr-2 h-4 w-4 opacity-70"/>Video</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {variant.mediaType !== 'text' && (
                        <div className="space-y-1.5">
                            <Label htmlFor={`mediaFile-${variant.id}`}>File Media (Pilih dari perangkat)</Label>
                            <Input
                                id={`mediaFile-${variant.id}`}
                                name={`mediaFile-${variant.id}`}
                                type="file"
                                accept="image/*,video/*,.gif"
                                onChange={(e) => handleMessageVariantChange(variant.id, 'mediaFile', e.target.files ? e.target.files[0] : null)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Pilih file foto, GIF, atau video. File saat ini: {variant.mediaFile?.name || variant.mediaUrl || "Tidak ada"}
                            </p>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Label htmlFor={`messageText-${variant.id}`}>
                            {variant.mediaType === 'text' ? 'Teks Pesan' : 'Keterangan (Opsional untuk media)'}
                        </Label>
                        <Textarea
                        id={`messageText-${variant.id}`}
                        name={`messageText-${variant.id}`}
                        placeholder={variant.mediaType === 'text' ? "Masukkan teks pesan di sini..." : "Masukkan keterangan untuk media..."}
                        rows={variant.mediaType === 'text' ? 5 : 3}
                        value={variant.text}
                        onChange={(e) => handleMessageVariantChange(variant.id, 'text', e.target.value)}
                        />
                    </div>
                  </div>
                ))}

                <Button variant="outline" type="button" className="w-full sm:w-auto" onClick={handleAddMessageVariant}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Tambah Varian Pesan
                </Button>
                <p className="text-xs text-muted-foreground">
                  Definisikan beberapa varian pesan. Bot dapat memilih secara acak atau bergiliran (tergantung mode pengiriman).
                </p>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                    <Label htmlFor="messageSendingMode">Mode Pengiriman Pesan</Label>
                    <Select 
                        value={messageSendingMode} 
                        onValueChange={setMessageSendingMode}
                        name="messageSendingMode" 
                        id="messageSendingMode"
                    >
                        <SelectTrigger>
                        <SelectValue placeholder="Pilih mode pengiriman" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="primary">Kirim Pesan Utama/Default Saja</SelectItem>
                        <SelectItem value="random">Kirim Pesan Acak (dari varian - simulasi)</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="messageForwardingMode">Mode Penerusan Pesan</Label>
                        <Select 
                            value={messageForwardingMode} 
                            onValueChange={setMessageForwardingMode}
                            name="messageForwardingMode" 
                            id="messageForwardingMode"
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih mode penerusan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="new">Kirim sebagai Pesan Baru (Tidak Diteruskan)</SelectItem>
                                <SelectItem value="forwarded">Kirim sebagai Pesan Diteruskan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-1.5">
                  <Label htmlFor="inlineButtonConfig">Konfigurasi Tombol Inline (JSON - Placeholder)</Label>
                  <Textarea
                    id="inlineButtonConfig"
                    name="inlineButtonConfig"
                    placeholder='Contoh: [{"text": "Kunjungi Situs", "url": "https://contoh.com"}]'
                    rows={3}
                    value={inlineButtonConfig}
                    onChange={(e) => setInlineButtonConfig(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Definisikan tombol keyboard inline Telegram dalam format JSON. UI pembuat tombol segera hadir.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shuffle className="h-5 w-5 text-primary" />
                  Interval & Penundaan Global
                </CardTitle>
                <CardDescription>Atur waktu umum untuk pengiriman pesan untuk bot ini.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="globalInterval">Interval Pengiriman Global (detik)</Label>
                  <Input id="globalInterval" name="globalInterval" type="number" placeholder="Contoh: 300" value={globalInterval} onChange={(e) => setGlobalInterval(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Waktu antara pengiriman ke grup sama (jika tidak diganti aturan per grup).</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="interGroupDelay">Penundaan Antar Grup (detik)</Label>
                  <Input id="interGroupDelay" name="interGroupDelay" type="number" placeholder="Contoh: 60" value={interGroupDelay} onChange={(e) => setInterGroupDelay(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Penundaan setelah kirim ke satu grup sebelum ke grup berikutnya.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1 lg:col-span-12">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PackagePlus className="h-5 w-5 text-primary" />
                Aturan & Penggantian Spesifik Grup
                </CardTitle>
                <CardDescription>
                  Sesuaikan perilaku untuk grup/channel Telegram tertentu. Grup 'Jangan Kirim' efektif diblacklist.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={handleAddGroupRule}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Aturan Grup
                </Button>

                {groupRules.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Belum ada aturan grup. Klik 'Tambah Aturan Grup' untuk membuatnya.
                    </p>
                )}

                {groupRules.map((rule, index) => (
                    <div key={rule.id} className="mt-4 p-4 border rounded-md space-y-4 bg-muted/30">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-sm text-muted-foreground">Aturan Grup #{index + 1}</h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-destructive h-7 px-2"
                                onClick={() => handleRemoveGroupRule(rule.id)}
                                type="button"
                            >
                                <Trash2 className="mr-1 h-3 w-3" /> Hapus Aturan
                            </Button>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor={`groupRuleId-${rule.id}`}>ID atau Username Grup/Channel</Label>
                            <Input
                                id={`groupRuleId-${rule.id}`}
                                name={`groupRuleId-${rule.id}`}
                                placeholder="Contoh: grup1, @grup2, -100123456789"
                                value={rule.groupId}
                                onChange={(e) => handleGroupRuleChange(rule.id, 'groupId', e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Masukkan satu atau lebih ID/username Grup/Channel, dipisahkan koma.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor={`groupRuleInterval-${rule.id}`}>Interval Kustom (detik)</Label>
                            <Input
                                id={`groupRuleInterval-${rule.id}`}
                                name={`groupRuleInterval-${rule.id}`}
                                type="number"
                                placeholder="Contoh: 1800 (kosongkan untuk global)"
                                value={rule.customInterval}
                                onChange={(e) => handleGroupRuleChange(rule.id, 'customInterval', e.target.value)}
                            />
                             <p className="text-xs text-muted-foreground">
                                Mengganti interval global untuk grup ini.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor={`groupRuleMessageStrategy-${rule.id}`}>Strategi Pesan untuk Grup Ini</Label>
                            <Select
                                value={rule.messageStrategy}
                                onValueChange={(newValue) => handleGroupRuleChange(rule.id, 'messageStrategy', newValue)}
                                name={`groupRuleMessageStrategy-${rule.id}`}
                                key={groupRuleSelectKeys[rule.id] || `${rule.id}-strategy-default`}
                            >
                                <SelectTrigger id={`groupRuleMessageStrategy-${rule.id}`}>
                                <SelectValue placeholder="Pilih strategi pesan" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="default">Gunakan Pesan Default Bot</SelectItem>
                                <SelectItem value="specific_primary">Kirim Pesan Utama/Default Saja</SelectItem>
                                <SelectItem value="specific_alt1">Kirim Pesan Alternatif 1 (jika ada)</SelectItem>
                                <SelectItem value="disabled">Jangan Kirim (Blacklist untuk bot ini)</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                               Pilih cara pesan dikirim ke grup ini atau blacklist.
                            </p>
                        </div>
                    </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="print:hidden" />

        <div className="flex flex-col sm:flex-row justify-end gap-2 print:hidden">
          <Button type="button" variant="outline" onClick={handleImportConfiguration}>
            <Import className="mr-2 h-4 w-4" /> Impor Konfigurasi
          </Button>
           <Button type="button" variant="outline" onClick={handleResetConfiguration}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset Konfigurasi
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="mr-2 h-4 w-4" /> Simpan Semua Konfigurasi
          </Button>
        </div>
      </form>
    </div>
  );
}


    