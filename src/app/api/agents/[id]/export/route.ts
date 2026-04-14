/**
 * API: /api/agents/[id]/export
 * GET - Exporta agente como Character File (JSON ou TypeScript)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AgentAdapter } from '@/lib/agents/adapter';
import type { TotumAgentConfig, ExportAgentResponse } from '@/types/agents-elizaos';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/agents/[id]/export?format=json|typescript
 * Exporta o agente como elizaOS Character File
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ExportAgentResponse | { error: string }>> {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    // Buscar agente
    const { data: agent, error: agentError } = await supabase
      .from('agents_config')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (agentError || !agent) {
      return NextResponse.json(
        { error: 'Agente não encontrado' },
        { status: 404 }
      );
    }

    // Buscar canais
    const { data: channels } = await supabase
      .from('agent_channels')
      .select('*')
      .eq('agent_id', id);

    const agentWithRelations: TotumAgentConfig = {
      ...agent,
      channels: channels || [],
      skills: [],
    } as TotumAgentConfig;

    // Gerar Character
    const character = AgentAdapter.toElizaCharacter(agentWithRelations);
    const json = JSON.stringify(character, null, 2);

    // Gerar TypeScript se solicitado
    let typescript: string | undefined;
    if (format === 'typescript') {
      typescript = generateTypeScript(character);
    }

    return NextResponse.json({
      success: true,
      character,
      json,
      typescript,
    });
  } catch (error: any) {
    console.error('Erro GET /api/agents/[id]/export:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Gera código TypeScript do Character
 */
function generateTypeScript(character: any): string {
  return `import { Character } from '@elizaos/core';

export const character: Character = {
  id: "${character.id}",
  name: "${character.name}",
  username: "${character.username || character.name.toLowerCase()}",
  bio: ${JSON.stringify(character.bio)},
  ${character.lore?.length ? `lore: ${JSON.stringify(character.lore)},` : ''}
  ${character.adjectives?.length ? `adjectives: ${JSON.stringify(character.adjectives)},` : ''}
  system: ${JSON.stringify(character.system)},
  modelProvider: "${character.modelProvider}",
  models: ${JSON.stringify(character.models)},
  plugins: ${JSON.stringify(character.plugins)},
  clients: ${JSON.stringify(character.clients)},
  settings: ${JSON.stringify(character.settings)},
  ${character.knowledge?.length ? `knowledge: ${JSON.stringify(character.knowledge)},` : ''}
};

export default character;
`;
}
