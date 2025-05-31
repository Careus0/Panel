"use client";

import { Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { useEffect, useState } from "react";

// Simulate fetching logs
const generatePlaceholderLogs = (botId: string, count: number = 50) => {
  const logs = [];
  const startTime = new Date();
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(startTime.getTime() - i * Math.random() * 60000); 
    const logType = ["INFO", "PERINGATAN", "ERROR", "DEBUG"][Math.floor(Math.random() * 4)];
    let message = "";
    switch (logType) {
      case "INFO":
        message = `Bot ${botId} memproses tugas #${Math.floor(Math.random() * 1000)}.`;
        break;
      case "PERINGATAN":
        message = `Potensi masalah terdeteksi: batas tarif API mendekati untuk ${botId}.`;
        break;
      case "ERROR":
        message = `Gagal menjalankan perintah 'contoh_perintah' untuk ${botId}. Kode error: ${Math.floor(Math.random() * 500) + 400}.`;
        break;
      case "DEBUG":
        message = `Variabel 'hitung_pengguna' untuk bot ${botId} adalah ${Math.floor(Math.random() * 100)}.`;
        break;
    }
    logs.push({
      timestamp: timestamp.toISOString(),
      level: logType,
      message: message,
    });
  }
  return logs.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

function BotLogsPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const botId = params.botId as string;
  const botName = searchParams.get("name") || "Bot Tidak Dikenal";

  const [logs, setLogs] = useState<{timestamp: string; level: string; message: string}[]>([]);

  useEffect(() => {
    if (botId) {
      setLogs(generatePlaceholderLogs(botId));
    }
  }, [botId]);

  const getLogLevelClass = (level: string) => {
    switch (level) {
      case "ERROR":
        return "text-destructive";
      case "PERINGATAN":
        return "text-yellow-500 dark:text-yellow-400";
      case "INFO":
        return "text-blue-500 dark:text-blue-400";
      case "DEBUG":
        return "text-gray-500 dark:text-gray-400";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.push("/dashboard")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali ke Dasbor
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Log untuk {decodeURIComponent(botName)}</CardTitle> 
          </div>
          <CardDescription>Menampilkan aktivitas terkini untuk ID bot: {botId}</CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <div className="bg-muted/30 dark:bg-muted/20 p-4 rounded-md max-h-[600px] overflow-y-auto">
              <pre className="text-xs whitespace-pre-wrap break-all">
                {logs.map((log, index) => (
                  <div key={index} className="mb-1.5 flex">
                    <span className="text-muted-foreground min-w-[180px] pr-2">
                      {new Date(log.timestamp).toLocaleString('id-ID')} 
                    </span>
                    <span className={`font-semibold min-w-[80px] ${getLogLevelClass(log.level)}`}>
                      [{log.level}]
                    </span>
                    <span className="ml-2 flex-1">{log.message}</span>
                  </div>
                ))}
              </pre>
            </div>
          ) : (
            <p className="text-muted-foreground">Tidak ada log tersedia untuk bot ini, atau log masih dimuat.</p> 
          )}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">
                Menampilkan {logs.length} entri log terakhir. Ini adalah tampilan prototipe.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function BotLogsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="bg-muted/30 p-4 rounded-md animate-pulse">
          <div className="h-10 bg-gray-200 mb-4 rounded"></div>
          <div className="h-[600px] bg-gray-100 rounded"></div>
        </div>
      </div>
    }>
      <BotLogsPageContent />
    </Suspense>
  );
}
