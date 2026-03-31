export const mockData = {
  vps: [
    { name: "VPS 7GB", status: "online" as const, ram: 80, cpu: 40, disk: 50, description: "OpenClaw + Bot + Coordenação" },
    { name: "VPS KVM4", status: "online" as const, ram: 25, cpu: 20, disk: 30, description: "16GB RAM + IA Local + Hospedagem" },
  ],
  github: { status: "connected" as const, repo: "Apps_totum_Oficial" },
  ias: { active: 3, total: 3, names: "Miguel, Liz, Jarvis" },
  apps: [
    { name: "Atendente (Telegram)", status: "online" as const, icon: "💬", description: "@totum_agents_bot" },
    { name: "Gestor de Tráfego", status: "standby" as const, icon: "📊", description: "Aguardando deploy" },
    { name: "Radar Estratégico", status: "standby" as const, icon: "🎯", description: "Aguardando deploy" },
    { name: "Orquestrador (Kimi)", status: "online" as const, icon: "🤖", description: "Coordenando" },
    { name: "Notebook LM", status: "standby" as const, icon: "📓", description: "Aguardando config" },
  ],
  agents: [
    { name: "Miguel", role: "Arquiteto", status: "online" as const, tasks: 3, emoji: "🤖" },
    { name: "Liz", role: "Guardiã", status: "online" as const, tasks: 5, emoji: "👩‍💻" },
    { name: "Jarvis", role: "Executor", status: "standby" as const, tasks: 0, emoji: "🦾" },
  ],
  costs: {
    ia: 660,
    tools: 494,
    hosting: 60,
    total: 1214,
  },
  activities: [
    { time: "14:32", message: "Bot Atendente respondeu mensagem", type: "info" as const },
    { time: "14:15", message: "Sync GitHub: 3 commits enviados", type: "success" as const },
    { time: "13:50", message: "IA Local (Groq): 12 requisições", type: "info" as const },
    { time: "12:20", message: "Manutenção automática concluída", type: "success" as const },
    { time: "11:45", message: "Alerta: RAM VPS 7GB acima de 75%", type: "warning" as const },
    { time: "11:00", message: "Deploy Atendente v2.1.0 finalizado", type: "success" as const },
    { time: "10:30", message: "Backup automático executado", type: "info" as const },
    { time: "09:15", message: "Orquestrador: novo workflow criado", type: "info" as const },
    { time: "08:50", message: "SSL renovado automaticamente", type: "success" as const },
    { time: "08:00", message: "Sistema inicializado com sucesso", type: "success" as const },
  ],
  mex: {
    global: "synced" as const,
    atendente: "synced" as const,
    contextHub: "syncing" as const,
    lastSync: "2 minutos atrás",
  },
};

export type VpsStatus = "online" | "offline" | "standby";
export type AppStatus = "online" | "offline" | "standby";
export type AgentStatus = "online" | "offline" | "standby";
export type MexStatus = "synced" | "syncing" | "error";
export type ActivityType = "info" | "success" | "warning" | "error";
