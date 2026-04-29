import type { Skill } from "@/types/agents";

export const skillOverrides: Record<string, Skill> = {
  skill_router: {
    id: "skill_router",
    name: "Skill Router",
    emoji: "🚦",
    description: "Descobre, prioriza e recomenda quais skills devem ser usadas para cada objetivo antes da execução.",
    version: "1.0.0",
    category: "automation",
    inputs: {
      objective: {
        type: "string",
        required: true,
        description: "Objetivo ou pedido do usuário que precisa ser roteado",
      },
      context: {
        type: "object",
        required: false,
        description: "Contexto adicional do cliente, canal, projeto ou tarefa",
      },
    },
    outputs: {
      recommended_skills: {
        type: "array",
        description: "Lista priorizada de skills recomendadas para o objetivo",
      },
      execution_plan: {
        type: "object",
        description: "Plano sugerido de execução com ordem e justificativas",
      },
    },
    model_preference: "claude",
    cost_per_call: 0.03,
    success_rate: 0.98,
    prompt_template: "prompts/skill_router.md",
    dependencies: [],
    status: "active",
    estimated_duration_ms: 1200,
    is_primary: true,
    routing_priority: 1000,
    tags: ["router", "planner", "orchestration", "skills", "alexandria"],
  },
};
