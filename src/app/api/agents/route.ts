/**
 * API: /api/agents
 * GET - Lista todos os agentes
 * POST - Cria novo agente
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AgentAdapter } from '@/lib/agents/adapter';
import type { TotumAgentConfig, CreateAgentRequest, AgentsListResponse, AgentResponse } from '@/types/agents-elizaos';

// Cliente Supabase com service role para APIs
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/agents
 * Lista todos os agentes (view simplificada para dashboard)
 */
export async function GET(request: NextRequest): Promise<NextResponse<AgentsListResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const tier = searchParams.get('tier');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('agents_config')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (tier) {
      query = query.eq('tier', parseInt(tier));
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Erro ao listar agentes:', error);
      return NextResponse.json(
        { success: false, agents: [], total: 0 },
        { status: 500 }
      );
    }

    const agents = (data || []).map((agent: any) => AgentAdapter.toAgentCard(agent as TotumAgentConfig));

    return NextResponse.json({
      success: true,
      agents,
      total: count || 0,
    });
  } catch (error: any) {
    console.error('Erro GET /api/agents:', error);
    return NextResponse.json(
      { success: false, agents: [], total: 0 },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agents
 * Cria um novo agente
 */
export async function POST(request: NextRequest): Promise<NextResponse<AgentResponse>> {
  try {
    const body: CreateAgentRequest = await request.json();

    // Validações básicas
    if (!body.name || !body.bio || !body.system_prompt) {
      return NextResponse.json(
        { success: false, agent: null as any, errors: ['Nome, bio e system_prompt são obrigatórios'] },
        { status: 400 }
      );
    }

    const hasEnabledChannel = body.channels.some((c) => c.enabled);
    if (!hasEnabledChannel) {
      return NextResponse.json(
        { success: false, agent: null as any, errors: ['Pelo menos um canal deve estar ativado'] },
        { status: 400 }
      );
    }

    // Gerar agent_id (slug)
    const agent_id = AgentAdapter.generateAgentId(body.name);

    // Verificar se já existe
    const { data: existing } = await supabase
      .from('agents_config')
      .select('id')
      .eq('agent_id', agent_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, agent: null as any, errors: ['Já existe um agente com este nome'] },
        { status: 409 }
      );
    }

    // Criar agente
    const agentPayload = {
      agent_id,
      name: body.name,
      bio: body.bio,
      tier: body.tier,
      system_prompt: body.system_prompt,
      emoji: '🤖',
      adjectives: [],
      temperature: 0.7,
      max_tokens: 2000,
      knowledge_enabled: (body.knowledge_sources || []).length > 0,
      knowledge_sources: body.knowledge_sources || [],
      rag_mode: 'static',
      plugins: ['@elizaos/plugin-bootstrap'],
      status: 'offline',
      is_active: true,
    };

    const { data: agentData, error: agentError } = await supabase
      .from('agents_config')
      .insert(agentPayload)
      .select()
      .single();

    if (agentError || !agentData) {
      console.error('Erro ao criar agente:', agentError);
      return NextResponse.json(
        { success: false, agent: null as any, errors: ['Erro ao criar agente no banco'] },
        { status: 500 }
      );
    }

    // Inserir canais
    const enabledChannels = body.channels.filter((c) => c.enabled);
    if (enabledChannels.length > 0) {
      const { error: channelsError } = await supabase.from('agent_channels').insert(
        enabledChannels.map((ch) => ({
          agent_id: agentData.id,
          channel_type: ch.type,
          is_enabled: ch.enabled,
          config: ch.config,
        }))
      );

      if (channelsError) {
        console.error('Erro ao criar canais:', channelsError);
      }
    }

    // Inserir knowledge access
    if (body.knowledge_sources && body.knowledge_sources.length > 0) {
      const { error: knowledgeError } = await supabase.from('agent_knowledge_access').insert(
        body.knowledge_sources.map((docId) => ({
          agent_id: agentData.id,
          document_id: docId,
          access_level: 'read',
        }))
      );

      if (knowledgeError) {
        console.error('Erro ao criar knowledge access:', knowledgeError);
      }
    }

    // Gerar Character File
    const agentWithRelations: TotumAgentConfig = {
      ...agentData,
      channels: enabledChannels,
      skills: [],
    } as TotumAgentConfig;

    const character = AgentAdapter.toElizaCharacter(agentWithRelations);

    // Atualizar com o exported_character
    await supabase
      .from('agents_config')
      .update({ exported_character: character })
      .eq('id', agentData.id);

    return NextResponse.json(
      {
        success: true,
        agent: agentWithRelations,
        character,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erro POST /api/agents:', error);
    return NextResponse.json(
      { success: false, agent: null as any, errors: [error.message] },
      { status: 500 }
    );
  }
}
