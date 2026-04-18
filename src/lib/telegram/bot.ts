import { toast } from 'sonner';
import { sendMessageToAI, hasAIConfig } from '@/services/aiService';

export interface TelegramBotConfig {
  token: string;
  systemPrompt: string;
  agentName: string;
}

export class TelegramBot {
  private token: string;
  private systemPrompt: string;
  private agentName: string;
  private isRunning: boolean = false;
  private offset: number = 0;
  private intervalId: number | null = null;
  private apiUrl: string;

  constructor(config: TelegramBotConfig) {
    this.token = config.token;
    this.systemPrompt = config.systemPrompt;
    this.agentName = config.agentName;
    this.apiUrl = `https://api.telegram.org/bot${this.token}`;
  }

  async start(): Promise<boolean> {
    if (this.isRunning) {
      console.log('Bot já está rodando');
      return true;
    }

    try {
      // Testar conexão
      const response = await fetch(`${this.apiUrl}/getMe`);
      const data = await response.json();

      if (!data.ok) {
        throw new Error('Token inválido');
      }

      console.log(`Bot iniciado: ${data.result.username}`);
      this.isRunning = true;
      
      // Iniciar polling
      this.startPolling();
      
      toast.success(`Bot @${data.result.username} iniciado!`);
      return true;
    } catch (error: any) {
      console.error('Erro ao iniciar bot:', error);
      toast.error('Erro ao iniciar bot: ' + error.message);
      return false;
    }
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('Bot parado');
    toast.info('Bot parado');
  }

  private startPolling(): void {
    // Polling a cada 2 segundos
    this.intervalId = window.setInterval(async () => {
      if (!this.isRunning) return;
      await this.pollUpdates();
    }, 2000);
  }

  private async pollUpdates(): Promise<void> {
    try {
      const response = await fetch(
        `${this.apiUrl}/getUpdates?offset=${this.offset + 1}&limit=10`
      );
      const data = await response.json();

      if (!data.ok || !data.result) return;

      for (const update of data.result) {
        this.offset = update.update_id;
        
        if (update.message && update.message.text) {
          await this.handleMessage(update.message);
        }
      }
    } catch (error) {
      console.error('Erro no polling:', error);
    }
  }

  private async handleMessage(message: any): Promise<void> {
    const chatId = message.chat.id;
    const text = message.text;
    const userName = message.from?.first_name || 'Usuário';

    console.log(`Mensagem de ${userName}: ${text}`);

    // Comandos básicos
    if (text === '/start') {
      await this.sendMessage(
        chatId,
        `Olá, ${userName}! 👋\n\nEu sou ${this.agentName}, seu assistente virtual.\n\nComo posso ajudar?`
      );
      return;
    }

    if (text === '/help') {
      await this.sendMessage(
        chatId,
        `Comandos disponíveis:\n/start - Iniciar conversa\n/help - Ajuda\n/status - Status do agente`
      );
      return;
    }

    if (text === '/status') {
      await this.sendMessage(
        chatId,
        `🟢 ${this.agentName} está online\n\nSystem prompt configurado: ${this.systemPrompt.substring(0, 100)}...`
      );
      return;
    }

    // Resposta simulada (em produção, chamar API de IA)
    const response = await this.generateResponse(text, userName);
    await this.sendMessage(chatId, response);
  }

  private async sendMessage(chatId: number, text: string): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
        }),
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  }

  private async generateResponse(userMessage: string, userName: string): Promise<string> {
    // Tentar chamar API de IA real (Kimi/Groq/OpenAI)
    if (hasAIConfig()) {
      try {
        const response = await sendMessageToAI([
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: `${userName}: ${userMessage}` },
        ]);

        if (response.error) {
          console.warn('[TelegramBot] IA error:', response.error);
          // Fallback para resposta simulada
        } else if (response.content) {
          return response.content;
        }
      } catch (err) {
        console.warn('[TelegramBot] Falha ao chamar IA, usando fallback:', err);
      }
    }

    // Fallback: resposta simulada quando não há IA configurada ou deu erro
    const responses = [
      `Entendi, ${userName}. Estou processando sua solicitação sobre "${userMessage}"...`,
      `Interessante! Com base no meu conhecimento, posso ajudar com isso.`,
      `${userName}, vou analisar "${userMessage}" e te retorno em breve.`,
      `Claro! Como ${this.agentName}, posso ajudar com essa demanda.`,
    ];

    await new Promise(resolve => setTimeout(resolve, 1000));
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getStatus(): boolean {
    return this.isRunning;
  }
}

// Singleton para gerenciar bots ativos
const activeBots = new Map<string, TelegramBot>();

export class TelegramBotManager {
  static getOrCreateBot(agentId: string, config: TelegramBotConfig): TelegramBot {
    if (activeBots.has(agentId)) {
      return activeBots.get(agentId)!;
    }
    
    const bot = new TelegramBot(config);
    activeBots.set(agentId, bot);
    return bot;
  }

  static async stopBot(agentId: string): Promise<void> {
    const bot = activeBots.get(agentId);
    if (bot) {
      await bot.stop();
      activeBots.delete(agentId);
    }
  }

  static getBotStatus(agentId: string): boolean {
    const bot = activeBots.get(agentId);
    return bot ? bot.getStatus() : false;
  }
}

// Exports compatíveis
export const getOrCreateBot = TelegramBotManager.getOrCreateBot;
export const stopBot = TelegramBotManager.stopBot;
export const getBotStatus = TelegramBotManager.getBotStatus;

// Aliases para uso na API
export namespace TelegramBot {
  export const getOrCreateBot = TelegramBotManager.getOrCreateBot;
  export const stopBot = TelegramBotManager.stopBot;
  export const getBotStatus = TelegramBotManager.getBotStatus;
}
