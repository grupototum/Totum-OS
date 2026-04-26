import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Send, Bell, BellOff, CheckCircle } from 'lucide-react';
import { useTelegramNotification } from '@/hooks/useTelegramNotification';

interface TelegramNotificationProps {
  defaultChatId?: string;
  taskTitle?: string;
  taskDescription?: string;
}

export default function TelegramNotification({
  defaultChatId = '',
  taskTitle = '',
  taskDescription = '',
}: TelegramNotificationProps) {
  const [chatId, setChatId] = useState(defaultChatId);
  const [mensagem, setMensagem] = useState(taskDescription);
  const { sending, lastSent, error, isConfigured, notifyTarefa } = useTelegramNotification();

  const handleSend = async () => {
    if (!chatId) return;
    await notifyTarefa(chatId, taskTitle || 'Nova Notificação', mensagem, 'Totum OS');
  };

  if (!isConfigured) {
    return (
      <Card className="p-4 border-dashed border-yellow-300 bg-amber-500/10">
        <div className="flex items-center gap-2 text-yellow-400">
          <BellOff className="h-4 w-4" />
          <p className="text-sm">Telegram não configurado. Adicione <code className="bg-amber-500/15 px-1 rounded">VITE_TELEGRAM_BOT_TOKEN</code> no .env</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold">Notificação Telegram</h4>
        <Badge className="bg-green-500/15 text-green-400 border-0 text-xs">Ativo</Badge>
      </div>

      <div className="space-y-2">
        <div>
          <Label htmlFor="tg-chat-id" className="text-xs text-muted-foreground">Chat ID do operador</Label>
          <Input
            id="tg-chat-id"
            value={chatId}
            onChange={e => setChatId(e.target.value)}
            placeholder="ex: 123456789"
            className="h-8 text-sm mt-1"
          />
        </div>
        <div>
          <Label htmlFor="tg-mensagem" className="text-xs text-muted-foreground">Mensagem</Label>
          <Input
            id="tg-mensagem"
            value={mensagem}
            onChange={e => setMensagem(e.target.value)}
            placeholder="Detalhes da notificação..."
            className="h-8 text-sm mt-1"
          />
        </div>
      </div>

      <Button size="sm" onClick={handleSend} disabled={sending || !chatId} className="w-full">
        {sending ? (
          'Enviando...'
        ) : lastSent ? (
          <><CheckCircle className="h-3 w-3 mr-1" />Enviado!</>
        ) : (
          <><Send className="h-3 w-3 mr-1" />Enviar</>
        )}
      </Button>

      {error && <p className="text-xs text-destructive">{error}</p>}
      {lastSent && <p className="text-xs text-muted-foreground">Enviado às {lastSent.toLocaleTimeString('pt-BR')}</p>}
    </Card>
  );
}
