import { useState, useCallback } from 'react';
import { sendTelegramNotification, isTelegramConfigured, TelegramNotificationPayload } from '@/services/telegramService';

interface NotificationState {
  sending: boolean;
  lastSent: Date | null;
  error: string | null;
}

export const useTelegramNotification = () => {
  const [state, setState] = useState<NotificationState>({
    sending: false,
    lastSent: null,
    error: null,
  });

  const isConfigured = isTelegramConfigured();

  const notify = useCallback(async (payload: TelegramNotificationPayload): Promise<boolean> => {
    if (!isConfigured) {
      setState(s => ({ ...s, error: 'Telegram não configurado. Adicione VITE_TELEGRAM_BOT_TOKEN.' }));
      return false;
    }

    setState(s => ({ ...s, sending: true, error: null }));

    try {
      const success = await sendTelegramNotification(payload);
      setState(s => ({
        ...s,
        sending: false,
        lastSent: success ? new Date() : s.lastSent,
        error: success ? null : 'Falha ao enviar notificação',
      }));
      return success;
    } catch (err: any) {
      setState(s => ({ ...s, sending: false, error: err.message }));
      return false;
    }
  }, [isConfigured]);

  // Notificação de tarefa atribuída
  const notifyTarefa = useCallback((
    chatId: string,
    titulo: string,
    descricao: string,
    responsavel: string
  ) => {
    return notify({
      destinatario: chatId,
      titulo: `Nova tarefa: ${titulo}`,
      mensagem: `${descricao}\n\nResponsável: ${responsavel}`,
      tipo: 'tarefa',
      prioridade: 'media',
    });
  }, [notify]);

  // Notificação de alerta de sistema
  const notifyAlerta = useCallback((chatId: string, titulo: string, mensagem: string) => {
    return notify({
      destinatario: chatId,
      titulo,
      mensagem,
      tipo: 'alerta',
      prioridade: 'alta',
    });
  }, [notify]);

  return { ...state, isConfigured, notify, notifyTarefa, notifyAlerta };
};
