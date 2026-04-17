/**
 * Telegram notification utilities
 * Uses VITE_TELEGRAM_BOT_TOKEN + VITE_TELEGRAM_ADMIN_CHAT_ID env vars
 */

const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
const ADMIN_CHAT_ID = import.meta.env.VITE_TELEGRAM_ADMIN_CHAT_ID || '';

/** Sends a raw Markdown message to the admin chat */
export async function sendTelegramMessage(text: string): Promise<void> {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
    console.warn('[Telegram] VITE_TELEGRAM_BOT_TOKEN ou VITE_TELEGRAM_ADMIN_CHAT_ID não configurados.');
    return;
  }
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text, parse_mode: 'Markdown' }),
    });
  } catch (err) {
    console.error('[Telegram] Falha ao enviar notificação:', err);
  }
}

/** Notifies the admin that a new user is pending approval */
export async function notifyNewUserPending(
  email: string,
  name?: string,
  provider: string = 'email'
): Promise<void> {
  const providerLabel = provider === 'google' ? 'Google OAuth' : 'Email/Senha';
  const text =
    `🔔 *Novo cadastro aguardando aprovação*\n\n` +
    `👤 Nome: ${name || '_Não informado_'}\n` +
    `📧 Email: ${email}\n` +
    `🔑 Método: ${providerLabel}\n` +
    `🕐 Data: ${new Date().toLocaleString('pt-BR')}\n\n` +
    `👉 Aprovar em: https://apps.grupototum.com/admin/approvals`;
  await sendTelegramMessage(text);
}
