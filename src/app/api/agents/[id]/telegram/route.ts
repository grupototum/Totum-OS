/**
 * API: /api/agents/[id]/telegram
 * POST - Controla o bot do Telegram (start/stop)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { TelegramBot, TelegramControlRequest, TelegramControlResponse } from '@/lib/telegram/bot';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RouteParams {
  params: { id: string };
}

/**
 * POST /api/agents/[id]/telegram
 * Controla o bot do Telegram (start/stop)
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<TelegramControlResponse>> {
  try {
    const { id } = params;
    const body: TelegramControlRequest = await request.json();
    const { action } = body;

    if (!action || !['start', 'stop'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Ação inválida. Use "start" ou "stop"' },
        { status: 400 }
      );
    }

    // Buscar agente
    const { data: agent, error: agentError } = await supabase
      .from('agents_config')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (agentError || !agent) {
      return NextResponse.json(
        { success: false, message: 'Agente não encontrado' },
        { status: 404 }
      );
    }

    // Buscar config do Telegram
    const { data: channel } = await supabase
      .from('agent_channels')
      .select('*')
      .eq('agent_id', id)
      .eq('channel_type', 'telegram')
      .single();

    if (!channel || !channel.is_enabled) {
      return NextResponse.json(
        { success: false, message: 'Canal do Telegram não configurado' },
        { status: 400 }
      );
    }

    const token = channel.config?.token;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token do Telegram não configurado' },
        { status: 400 }
      );
    }

    if (action === 'start') {
      // Criar/Obter bot
      const bot = TelegramBot.getOrCreateBot(id, {
        token,
        systemPrompt: agent.system_prompt,
        agentName: agent.name,
      });

      // Iniciar
      const started = await bot.start();

      if (started) {
        // Atualizar status no banco
        await supabase
          .from('agents_config')
          .update({ status: 'online' })
          .eq('id', id);

        return NextResponse.json({
          success: true,
          message: `Bot do Telegram iniciado para ${agent.name}`,
        });
      } else {
        return NextResponse.json(
          { success: false, message: 'Erro ao iniciar bot' },
          { status: 500 }
        );
      }
    } else {
      // Parar bot
      await TelegramBot.stopBot(id);

      // Atualizar status no banco
      await supabase
        .from('agents_config')
        .update({ status: 'offline' })
        .eq('id', id);

      return NextResponse.json({
        success: true,
        message: `Bot do Telegram parado para ${agent.name}`,
      });
    }
  } catch (error: any) {
    console.error('Erro POST /api/agents/[id]/telegram:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/agents/[id]/telegram
 * Retorna status do bot do Telegram
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<{ running: boolean; status: string }>> {
  try {
    const { id } = params;

    const running = TelegramBot.getBotStatus(id);

    // Buscar status do agente no banco
    const { data: agent } = await supabase
      .from('agents_config')
      .select('status')
      .eq('id', id)
      .single();

    return NextResponse.json({
      running,
      status: agent?.status || 'unknown',
    });
  } catch (error: any) {
    console.error('Erro GET /api/agents/[id]/telegram:', error);
    return NextResponse.json(
      { running: false, status: 'error' },
      { status: 500 }
    );
  }
}
