
"use client";

import type { Bot } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  StopCircle, 
  RefreshCw, 
  FileText, 
  MoreVertical, 
  Trash2, 
  Edit3, // Icon for Edit Configuration
  Pencil 
} from "lucide-react";
import { StatusIndicator } from "./status-indicator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RenameBotDialog } from "./rename-bot-dialog"; 

interface BotStatusCardProps {
  bot: Bot;
  onStart: (botId: string) => void;
  onStop: (botId: string) => void;
  onRestart: (botId: string) => void;
  onViewLogs: (botId: string) => void;
  onDelete: (botId: string) => void;
  onRename: (botId: string, newName: string) => void; 
}

export function BotStatusCard({ bot, onStart, onStop, onRestart, onViewLogs, onDelete, onRename }: BotStatusCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false); 
  const router = useRouter(); 
  
  const handleAction = (action: (botId: string) => void) => {
    action(bot.id);
  };

  const navigateToConfigPage = () => {
    router.push(`/dashboard/bot/${bot.id}/config?name=${encodeURIComponent(bot.name)}`);
  };

  const handleRenameConfirm = async (newName: string) => {
    onRename(bot.id, newName);
    setIsRenameDialogOpen(false); 
  };
  
  return (
    <>
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">{bot.name}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Tindakan lainnya</span> 
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsRenameDialogOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Ganti Nama Bot
                </DropdownMenuItem>
                <DropdownMenuItem onClick={navigateToConfigPage}>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Konfigurasi 
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive focus:bg-destructive/10" 
                    onSelect={(e) => e.preventDefault()} 
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus Bot
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="flex-grow space-y-3">
            <StatusIndicator status={bot.status} />
            <p className="text-sm text-muted-foreground truncate" title={bot.id}>ID Bot: {bot.id}</p> 
            {bot.uptime && <p className="text-sm text-muted-foreground">Aktif: {bot.uptime}</p>} 
            {bot.lastActivity && <p className="text-sm text-muted-foreground">Aktivitas Terakhir: {bot.lastActivity}</p>} 
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-2 pt-4 border-t">
            <Button variant="outline" size="sm" onClick={() => handleAction(onStart)} disabled={bot.status === 'online' || bot.status === 'restarting'}>
              <Play className="mr-2 h-4 w-4" /> Mulai
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAction(onStop)} disabled={bot.status === 'offline' || bot.status === 'restarting'}>
              <StopCircle className="mr-2 h-4 w-4" /> Henti
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAction(onRestart)} disabled={bot.status === 'offline'}>
              <RefreshCw className="mr-2 h-4 w-4" /> Ulang
            </Button>
            <Button variant="secondary" size="sm" onClick={() => handleAction(onViewLogs)}>
              <FileText className="mr-2 h-4 w-4" /> Log
            </Button>
          </CardFooter>
        </Card>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle> 
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus bot "{bot.name}" secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleting(false)}>Batal</AlertDialogCancel> 
            <AlertDialogAction
              onClick={() => {
                handleAction(onDelete);
                setIsDeleting(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <RenameBotDialog
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        currentBotName={bot.name}
        onRenameConfirm={handleRenameConfirm}
      />
    </>
  );
}
