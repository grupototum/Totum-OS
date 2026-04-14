/**
 * API: /api/agents/[id]
 * GET - Retorna detalhes de um agente
 * PATCH - Atualiza agente
 * DELETE - Remove agente (soft delete)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AgentAdapter } from '@/lib/agents/adapter';
import type { TotumAgentConfig, UpdateAgentRequest, AgentResponse } from '@/types/agents-elizaos';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/agents/[id]
 * Retorna detalhes completos de um agente
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<AgentResponse>> {
  try {
    const { id } = params;

    // Buscar agente
    const { data: agent, error: agentError } = await supabase
      .from('agents_config')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (agentError || !agent) {
      return NextResponse.json(
        { success: false, agent: null as any, errors: ['Agente não encontrado'] },
        { status: 404 }
      );
    }

    // Buscar canais
    const { data: channels } = await supabase
      .from('agent_channels')
      .select('*')
      .eq('agent_id', id);

    // Buscar skills
    const { data: skills } = await supabase
      .from('agent_skills_config')
      .select('*')
      .eq('agent_id', id)
      .order('position');

    // Buscar knowledge
    const { data: knowledge } = await supabase
      .from('agent_knowledge_access')
      .select('document_id')
      .eq('agent_id', id);

    const agentWithRelations: TotumAgentConfig = {
      ...agent,
      channels: channels || [],
      skills: skills || [],
      knowledge_sources: knowledge?.map((k) => k.document_id) || [],
    } as TotumAgentConfig;

    const character = AgentAdapter.toElizaCharacter(agentWithRelations);

    return NextResponse.json({
      success: true,
      agent: agentWithRelations,
      character,
    });
  } catch (error: any) {
    console.error('Erro GET /api/agents/[id]:', error);
    return NextResponse.json(
      { success: false, agent: null as any, errors: [error.message] },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/agents/[id]
 * Atualiza um agente existente
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<AgentResponse>> {
  try {
    const { id } = params;
    const body: UpdateAgentRequest = await request.json();

    // Verificar se agente existe
    const { data: existing } = await supabase
      .from('agents_config')
      .select('id')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (!existing) {
      return NextResponse.json(
        { success: false, agent: null as any, errors: ['Agente não encontrado'] },
        { status: 404 }
      );
    }

    // Montar payload de atualização
    const updatePayload: any = {};

    if (body.name) updatePayload.name = body.name;
    if (body.bio) updatePayload.bio = body.bio;
    if (body.system_prompt) updatePayload.system_prompt = body.system_prompt;
    if (body.tier) updatePayload.tier = body.tier;
    if (body.knowledge_sources) {
      updatePayload.knowledge_sources = body.knowledge_sources;
      updatePayload.knowledge_enabled = body.knowledge_sources.length > 0;
    }

    // Atualizar agente
    const { data: agentData, error: agentError } = await supabase
      .from('agents_config')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (agentError || !agentData) {
      console.error('Erro ao atualizar agente:', agentError);
      return NextResponse.json(
        { success: false, agent: null as any, errors: ['Erro ao atualizar agente'] },
        { status: 500 }
      );
    }

    // Atualizar canais se fornecidos
    if (body.channels) {
      // Remover canais existentes
      await supabase.from('agent_channels').delete().eq('agent_id', id);

      // Inserir novos
      const enabledChannels = body.channels.filter((c) => c.enabled);
      if (enabledChannels.length > 0) {
        await supabase.from('agent_channels').insert(
          enabledChannels.map((ch) => ({
            agent_id: id,
            channel_type: ch.type,
            is_enabled: ch.enabled,
            config: ch.config,
          }))
        );
      }
    }

    // Atualizar knowledge access se fornecido
    if (body.knowledge_sources) {
      await supabase.from('agent_knowledge_access').delete().eq('agent_id', id);

      if (body.knowledge_sources.length > 0) {
        await supabase.from('agent_knowledge_access').insert(
          body.knowledge_sources.map((docId) => ({
            agent_id: id,
            document_id: docId,
            access_level: 'read',
          }))
        );
      }
    }

    // Buscar dados atualizados
    const { data: updatedAgent } = await supabase
      .from('agents_config')
      .select('*')
      .eq('id', id)
      .single();

    const { data: channels } = await supabase
      .from('agent_channels')
      .select('*')
      .eq('agent_id', id);

    const agentWithRelations: TotumAgentConfig = {
      ...updatedAgent,
      channels: channels || [],
      skills: [],
    } as TotumAgentConfig;

    // Regenerar Character File
    const character = AgentAdapter.toElizaCharacter(agentWithRelations);
    await supabase
      .from('agents_config')
      .update({ exported_character: character })
      .eq('id', id);

    return NextResponse.json({
      success: true,
      agent: agentWithRelations,
      character,
    });
  } catch (error: any) {
    console.error('Erro PATCH /api/agents/[id]:', error);
    return NextResponse.json(
      { success: false, agent: null as any, errors: [error.message] },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/agents/[id]
 * Remove um agente (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<{ success: boolean; message?: string }>> {
  try {
    const { id } = params;

    // Soft delete
    const { error } = await supabase
      .from('agents_config')
      .update({ is_active: false, status: 'offline' })
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar agente:', error);
      return NextResponse.json(
        { success: false, message: 'Erro ao deletar agente' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Agente removido com sucesso',
    });
  } catch (error: any) {
    console.error('Erro DELETE /api/agents/[id]:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
