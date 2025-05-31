
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send, Github, Users, Navigation, Phone, MessageSquare } from "lucide-react"; // MessageSquare needed if Live Chat moves to sidebar
import { Button } from "@/components/ui/button"; // If Start Live Chat button is here
import { useToast } from "@/hooks/use-toast"; // If Start Live Chat button is here


const faqItems = [
  {
    value: "item-1",
    question: "Bagaimana cara menambahkan userbot baru?", // Diubah
    answer: "Anda dapat menambahkan userbot baru dari Panel Kontrol dengan mengklik tombol 'Tambah Bot Baru'. Anda akan memerlukan ID dan Hash API Telegram Anda.", // Diubah
  },
  {
    value: "item-2",
    question: "Apa arti status bot yang berbeda?", // Diubah
    answer: "'Online' berarti bot aktif. 'Offline' berarti berhenti. 'Restarting' menunjukkan sedang dalam proses restart. 'Error' berarti ada masalah yang mencegahnya berjalan.", // Diubah
  },
  {
    value: "item-3",
    question: "Bagaimana cara meningkatkan paket saya?", // Diubah
    answer: "Kunjungi halaman 'Harga' untuk melihat paket yang tersedia. Anda dapat meningkatkan atau mengubah langganan Anda dari halaman 'Langganan Saya'.", // Diubah
  },
  {
    value: "item-4",
    question: "Di mana saya dapat menemukan faktur saya?", // Diubah
    answer: "Faktur Anda tersedia di halaman 'Langganan Saya'. Cari tautan 'Lihat Faktur'.", // Diubah
  },
];

interface ContactLinkProps {
  href: string;
  icon: React.ElementType;
  text: string;
  target?: string;
}

const ContactLink: React.FC<ContactLinkProps> = ({ href, icon: Icon, text, target }) => {
  const commonProps = {
    className: "inline-flex items-center gap-1.5 text-sm text-foreground hover:text-primary transition-colors focus:outline-none focus:underline",
    target: target,
    rel: target === "_blank" ? "noopener noreferrer" : undefined,
  };

  return (
    <a href={href} {...commonProps}>
      <Icon className="h-4 w-4 text-primary flex-shrink-0" />
      <span>{text}</span>
    </a>
  );
};


export default function HelpPage() {
  const { toast } = useToast(); 

  // handleLiveChat function moved to AppSidebar/AppHeader, but we keep it here
  // if the button is decided to be on this page later.
  // const handleLiveChat = () => { 
  //   toast({
  //     title: "Obrolan Langsung",
  //     description: "Menghubungkan ke agen dukungan... (Simulasi)",
  //     duration: 3000,
  //   });
  //   console.log("Obrolan langsung dimulai (simulasi).");
  // };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bantuan & Dukungan</h1>
        <p className="text-muted-foreground">
          Temukan jawaban untuk pertanyaan umum dan pelajari cara memaksimalkan Sentinel Ubot.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Pertanyaan yang Sering Diajukan</CardTitle>
          <CardDescription>Jawaban cepat untuk pertanyaan umum.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger className="text-left hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-6 w-6 text-primary" />
              Hubungi Dukungan
            </CardTitle>
            <CardDescription>
              Tidak dapat menemukan jawaban? Hubungi tim kami melalui berbagai saluran.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-3">
               {/* The Live Chat button is moved to AppHeader as an icon, or AppSidebar as menu item.
                   If you want it here as a prominent button, uncomment and adjust.
              <Button 
                variant="default" // Or "outline"
                className="w-full justify-start sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleLiveChat} 
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Mulai Obrolan Langsung (Simulasi)
              </Button>
              */}
              <ContactLink
                href="mailto:support@sentinel.com" // Diubah
                icon={Mail}
                text="Email Kami: support@sentinel.com" // Diubah
              />
              <ContactLink
                href="https://t.me/sentinelsupport" // Placeholder, Diubah
                icon={Send}
                text="Obrolan Dukungan Telegram" // Diubah
                target="_blank"
              />
              <ContactLink
                href="https://wa.me/1234567890" // Placeholder
                icon={Phone} 
                text="Dukungan WhatsApp" // Diubah
                target="_blank"
              />
              <ContactLink
                href="https://github.com/sentinelubot" // Placeholder, Diubah
                icon={Github}
                text="Kunjungi GitHub kami" // Diubah
                target="_blank"
              />
              <ContactLink
                href="https://t.me/sentinel_group" // Placeholder, Diubah
                icon={Users}
                text="Bergabunglah dengan Grup Telegram kami" // Diubah
                target="_blank"
              />
              <ContactLink
                href="https://t.me/sentinel_channel" // Placeholder, Diubah
                icon={Navigation}
                text="Ikuti Channel Telegram kami" // Diubah
                target="_blank"
              />
            </div>
             <p className="mt-4 text-xs text-muted-foreground">
              Kami biasanya merespons dalam 24 jam kerja.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
