/**
 * AGENT API - EXEMPLOS DE USO
 * 
 * Este arquivo demonstra como usar os endpoints da API de agentes
 */

// ============================================================================
// 1. EXECUTAR AGENTE
// ============================================================================

import { executeAgent, fetchAgentConfig, saveAgentConfig, addSkill, removeSkill, reorderSkills } from '@/api/agents';

// Exemplo básico: executar um agente
async function executarAgente() {
  try {
    const result = await executeAgent('agent-123', 'Olá, como você está?', {
      context: { userId: 'user-456' },
      execution_mode: 'fast',
    });

    console.log('Execução concluída:');
    console.log(`- Status: ${result.status}`);
    console.log(`- Duração: ${result.totalDuration}ms`);
    console.log(`- Tokens usados: ${result.totalTokensUsed}`);
    console.log(`- Custo: $${result.totalCost}`);
  } catch (error) {
    console.error('Erro ao executar agente:', error);
  }
}

// ============================================================================
// 2. OBTER CONFIGURAÇÃO DO AGENTE
// ============================================================================

async function obterConfig() {
  try {
    const config = await fetchAgentConfig('agent-123');

    console.log('Configuração do agente:');
    console.log(`- Nome: ${config.name}`);
    console.log(`- Emoji: ${config.emoji}`);
    console.log(`- Modelo: ${config.modelOverride}`);
    console.log(`- Status: ${config.status}`);
  } catch (error) {
    console.error('Erro ao obter config:', error);
  }
}

// ============================================================================
// 3. SALVAR CONFIGURAÇÃO DO AGENTE
// ============================================================================

async function salvarConfig() {
  try {
    const config = await saveAgentConfig('agent-123', {
      name: 'Novo Nome',
      emoji: '🎯',
      model_override: 'gpt-4-turbo',
      system_prompt: 'Você é um assistente helpful...',
      status: 'online',
    });

    console.log('Config salva:', config.name);
  } catch (error) {
    console.error('Erro ao salvar config:', error);
  }
}

// ============================================================================
// 4. ADICIONAR SKILL AO AGENTE
// ============================================================================

async function adicionarSkill() {
  try {
    const skill = await addSkill('agent-123', 'skill-send-email', 2);

    console.log('Skill adicionada:');
    console.log(`- Nome: ${skill.name}`);
    console.log(`- Categoria: ${skill.category}`);
    console.log(`- Custo: ${skill.cost}`);
  } catch (error) {
    console.error('Erro ao adicionar skill:', error);
  }
}

// ============================================================================
// 5. REMOVER SKILL DO AGENTE
// ============================================================================

async function removerSkill() {
  try {
    await removeSkill('agent-123', 'skill-send-email');
    console.log('Skill removida com sucesso');
  } catch (error) {
    console.error('Erro ao remover skill:', error);
  }
}

// ============================================================================
// 6. REORDENAR SKILLS DO AGENTE
// ============================================================================

async function reordenarSkills() {
  try {
    const skills = await reorderSkills('agent-123', [
      'skill-analyze',
      'skill-send-email',
      'skill-create-task',
    ]);

    console.log('Skills reordenadas:');
    skills.forEach((skill, index) => {
      console.log(`${index + 1}. ${skill.name}`);
    });
  } catch (error) {
    console.error('Erro ao reordenar skills:', error);
  }
}

// ============================================================================
// React Hook - Usar em componentes
// ============================================================================

// Exemplo de uso em um componente React:
/*
import { useState, useEffect } from 'react';
import type { AgentConfig } from '@/api/agents';
import { fetchAgentConfig, saveAgentConfig } from '@/api/agents';

function AgentConfigComponent({ agentId }: { agentId: string }) {
  const [config, setConfig] = useState<AgentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
  }, [agentId]);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const data = await fetchAgentConfig(agentId);
      setConfig(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updates: Partial<AgentConfig>) => {
    try {
      setLoading(true);
      const updated = await saveAgentConfig(agentId, {
        name: updates.name,
        emoji: updates.emoji,
        model_override: updates.modelOverride,
        system_prompt: updates.systemPrompt,
        status: updates.status,
      });
      setConfig(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!config) return <div>Nenhuma config encontrada</div>;

  return (
    <div>
      <h1>{config.name}</h1>
      <p>Status: {config.status}</p>
      <button onClick={() => handleSave({ name: 'Novo Nome' })}>
        Atualizar
      </button>
    </div>
  );
}

export default AgentConfigComponent;
*/

// ============================================================================
// ERROR HANDLING PATTERNS
// ============================================================================

// Padrão de tratamento de erro completo
async function exemploComTratamento() {
  try {
    // Obter config
    const config = await fetchAgentConfig('agent-123');

    // Atualizar
    const updated = await saveAgentConfig('agent-123', {
      name: config.name.toUpperCase(),
    });

    // Executar
    const result = await executeAgent('agent-123', 'Teste');

    return { config: updated, result };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        console.error('Agente não encontrado');
      } else if (error.message.includes('401')) {
        console.error('Não autorizado');
      } else {
        console.error('Erro:', error.message);
      }
    }
    throw error;
  }
}

// ============================================================================
// TYPE SAFETY
// ============================================================================

import type { ExecutionResult, APIResponse } from '@/api/agents';

// Type-safe response handling
async function typeCheckExample() {
  const result = await executeAgent('agent-123', 'test');

  // TypeScript knows result is ExecutionResult
  const duration: number = result.totalDuration;
  const cost: number = result.totalCost;
  const steps = result.steps.map(step => ({
    name: step.skillName,
    status: step.status,
  }));

  console.log(steps);
}

export {
  executarAgente,
  obterConfig,
  salvarConfig,
  adicionarSkill,
  removerSkill,
  reordenarSkills,
  exemploComTratamento,
  typeCheckExample,
};
