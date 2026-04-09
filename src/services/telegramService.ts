// Serviço de notificações via Telegram Bot API

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  disable_notification?: boolean;
}

export interface TelegramNotificationPayload {
  destinatario: string; // chat_id do operador
  titulo: string;
  mensagem: string;
  tipo: 'tarefa' | 'alerta' | 'info' | 'erro';
  prioridade: 'alta' | 'media' | 'baixa';
}

// Emojis por tipo
const tipoEmoji: Record<string, string> = {
  tarefa: '📋',
  alerta: '⚠️',
  info: 'ℹ️',
  erro: '🔴',
};

const prioridadeLabel: Record<string, string> = {
  alta: '🔴 ALTA',
  media: '🟡 MÉDIA',
  baixa: '🟢 BAIXA',
};

// Envia mensagem simples
export const sendTelegramMessage = async (msg: TelegramMessage): Promise<boolean> => {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('[Telegram] BOT_TOKEN não configurado');
    return false;
  }

  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
    return res.ok;
  } catch (err) {
    console.error('[Telegram] Falha ao enviar mensagem:', err);
    return false;
  }
};

// Envia notificação formatada de tarefa/alerta
export const sendTelegramNotification = async (
  payload: TelegramNotificationPayload
): Promise<boolean> => {
  const emoji = tipoEmoji[payload.tipo] || 'ℹ️';
  const prioridade = prioridadeLabel[payload.prioridade] || payload.prioridade;

  const text = `${emoji} <b>${payload.titulo}</b>\n\n${payload.mensagem}\n\n<i>Prioridade: ${prioridade}</i>\n<i>Apps Totum • ${new Date().toLocaleString('pt-BR')}</i>`;

  return sendTelegramMessage({
    chat_id: payload.destinatario,
    text,
    parse_mode: 'HTML',
  });
};

// Verifica se o bot está configurado
export const isTelegramConfigured = (): boolean => !!TELEGRAM_BOT_TOKEN;
