/**
 * OpenClaw Client
 * Cliente HTTP para comunicação com VPS OpenClaw
 */

import { OPENCLAW_CONFIG, getWebhookUrl } from '@/config/openclaw';
import type { 
  AgentPayload, 
  ExecutionResult, 
  SkillExecution 
} from '@/types/agents';

// ============================================
// MOCK RESPONSES (para desenvolvimento)
// ============================================

const MOCK_DELAY_MS = 2000;

function generateMockExecutionResult(payload: AgentPayload): ExecutionResult {
  const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();
  
  const logs: SkillExecution[] = payload.skills.map((skill, index) => {
    const duration = 800 + Math.random() * 1500;
    const tokens = Math.floor(100 + Math.random() * 300);
    const cost = (tokens / 1000) * (skill.model === 'claude' ? 0.003 : 0.0005);
    
    return {
      skill_id: skill.id,
      name: skill.id.replace(/_/g, ' '),
      status: 'success',
      duration_ms: Math.floor(duration),
      tokens_used: tokens,
      cost: parseFloat(cost.toFixed(4)),
      input: skill.inputs,
      output: generateMockOutput(skill.id),
    };
  });
  
  const totalTokens = logs.reduce((sum, log) => sum + (log.tokens_used || 0), 0);
  const totalCost = logs.reduce((sum, log) => sum + (log.cost || 0), 0);
  const totalDuration = logs.reduce((sum, log) => sum + log.duration_ms, 0);
  
  return {
    success: true,
    execution_id: executionId,
    result: {
      message: `Execução concluída com ${payload.skills.length} skills`,
      output: logs.map(l => l.output),
    },
    logs,
    total_tokens: totalTokens,
    total_cost: parseFloat(totalCost.toFixed(4)),
    duration_ms: totalDuration,
    created_at: now,
  };
}

function generateMockOutput(skillId: string): any {
  const outputs: Record<string, any> = {
    social_planning: {
      calendar: {
        posts: [
          { day: 'Segunda', time: '09:00', topic: 'Dica de produtividade' },
          { day: 'Quarta', time: '14:00', topic: 'Behind the scenes' },
          { day: 'Sexta', time: '18:00', topic: 'Case de sucesso' },
        ],
      },
      posts_outline: [
        { title: '5 dicas para dobrar sua produtividade', format: 'carousel' },
        { title: 'Como montamos nosso escritório', format: 'reels' },
        { title: 'Cliente aumentou vendas em 300%', format: 'story' },
      ],
      hashtags: ['#produtividade', '#marketing', '#empreendedorismo'],
    },
    trend_analysis: {
      trends: [
        { name: 'AI Tools', growth: '+145%', relevance: 95 },
        { name: 'Short Form Video', growth: '+89%', relevance: 92 },
      ],
      score: 87,
      recommendations: ['Focar em conteúdo educativo', 'Usar mais vídeos curtos'],
    },
    stable_diffusion_prompt: {
      prompt: 'professional marketing team, modern office, bright lighting, collaborative atmosphere, high quality, 8k',
      negative_prompt: 'blurry, dark, low quality, distorted faces',
      parameters: { steps: 30, cfg: 7, sampler: 'DPM++ 2M' },
    },
    content_validation: {
      score: 92,
      feedback: ['Tom está ótimo', 'Call-to-action claro'],
      suggestions: ['Adicionar emoji no início', 'Usar número na headline'],
      approved: true,
    },
    hashtag_generator: {
      hashtags: ['#marketingdigital', '#empreendedorismo', '#negocios', '#vendas', '#instagram'],
      categories: {
        high: ['#marketingdigital'],
        medium: ['#empreendedorismo', '#negocios'],
        low: ['#vendas', '#instagram'],
      },
      reach_estimate: 50000,
    },
    copywriting: {
      headlines: ['Dobre suas vendas em 30 dias', 'O segredo dos negócios de sucesso'],
      body: 'Transforme sua presença digital com estratégias comprovadas...',
      cta: 'Comece agora gratuitamente',
      variations: ['Versão A: Foco em resultado', 'Versão B: Foco em facilidade'],
    },
  };
  
  return outputs[skillId] || { message: `Output mock para ${skillId}` };
}

// ============================================
// HTTP CLIENT
// ============================================

interface RequestOptions {
  retryCount?: number;
  timeout?: number;
}

/**
 * Executa um agente via OpenClaw
 */
export async function executeAgent(
  payload: AgentPayload,
  options: RequestOptions = {}
): Promise<ExecutionResult> {
  const { retryCount = 0, timeout = OPENCLAW_CONFIG.TIMEOUT } = options;
  
  // Modo Mock: retorna resposta simulada
  if (OPENCLAW_CONFIG.MOCK_MODE) {
    console.log('[OpenClaw] Mock mode - simulating execution', payload);
    
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
    
    return generateMockExecutionResult(payload);
  }
  
  // Modo Real: chama VPS
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(getWebhookUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENCLAW_CONFIG.AUTH_TOKEN}`,
        'X-Agent-ID': payload.agent,
        'X-Timestamp': new Date().toISOString(),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`OpenClaw error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (OPENCLAW_CONFIG.ENABLE_LOGS) {
      console.log('[OpenClaw] Execution result:', result);
    }
    
    return result as ExecutionResult;
    
  } catch (error) {
    console.error('[OpenClaw] Execution failed:', error);
    
    // Retry logic
    if (retryCount < OPENCLAW_CONFIG.RETRY_ATTEMPTS) {
      console.log(`[OpenClaw] Retrying... (${retryCount + 1}/${OPENCLAW_CONFIG.RETRY_ATTEMPTS})`);
      
      await new Promise(resolve => 
        setTimeout(resolve, OPENCLAW_CONFIG.RETRY_DELAY_MS * (retryCount + 1))
      );
      
      return executeAgent(payload, { ...options, retryCount: retryCount + 1 });
    }
    
    // Retorna erro formatado
    return {
      success: false,
      execution_id: `error_${Date.now()}`,
      result: null,
      logs: [{
        skill_id: 'system',
        name: 'System Error',
        status: 'error',
        duration_ms: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      }],
      total_tokens: 0,
      total_cost: 0,
      duration_ms: 0,
      created_at: new Date().toISOString(),
    };
  }
}

/**
 * Verifica saúde do OpenClaw
 */
export async function checkOpenClawHealth(): Promise<{ healthy: boolean; message: string }> {
  if (OPENCLAW_CONFIG.MOCK_MODE) {
    return { healthy: true, message: 'Mock mode active' };
  }
  
  try {
    const response = await fetch(`${OPENCLAW_CONFIG.VPS_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENCLAW_CONFIG.AUTH_TOKEN}`,
      },
    });
    
    if (response.ok) {
      return { healthy: true, message: 'OpenClaw is healthy' };
    }
    
    return { healthy: false, message: `Health check failed: ${response.status}` };
    
  } catch (error) {
    return { 
      healthy: false, 
      message: error instanceof Error ? error.message : 'Connection failed' 
    };
  }
}

/**
 * Monta payload para execução
 */
export function buildAgentPayload(
  agentId: string,
  skills: Array<{ id: string; inputs: Record<string, any> }>,
  systemPrompt: string,
  options?: {
    ragContext?: string;
    executionMode?: 'sequential' | 'parallel' | 'conditional';
    context?: AgentPayload['context'];
  }
): AgentPayload {
  const { ragContext, executionMode = 'sequential', context } = options || {};
  
  return {
    agent: agentId,
    skills: skills.map(s => ({
      id: s.id,
      prompt: `Execute skill ${s.id}`,
      inputs: s.inputs,
      model: 'claude',
    })),
    system_prompt: systemPrompt,
    rag_context: ragContext,
    execution_mode: executionMode,
    context,
  };
}

// Exporta config para verificação
export { OPENCLAW_CONFIG };
