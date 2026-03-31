import {
  Headphones, TrendingUp, Search, Eye, AlertTriangle, ShieldAlert,
  CalendarCheck, Clock, Mic, FileText, BarChart3, Zap, Shield,
  Share2, UserCheck, Bot, Megaphone, BookOpen, HardDrive, MessageSquare,
  Download, RefreshCw, Speaker, Lightbulb, TrendingDown, Scale,
  PenTool, Image, Video, Hash, Layout, Layers, Target, Users2,
  Notebook, FolderOpen, Globe, Database, Headset,
} from "lucide-react";

export interface SubAgent {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

export interface MainAgent {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string; // tailwind gradient
  accentClass: string; // text-blue-400 etc
  chatRoute: string;
  subAgents: SubAgent[];
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

export const mainAgents: MainAgent[] = [
  {
    id: "atendente",
    name: "Atendente Totum",
    description: "Atendimento inteligente, classificação de demandas e follow-ups automáticos.",
    icon: Headphones,
    color: "from-blue-500 to-indigo-500",
    accentClass: "text-blue-400",
    chatRoute: "/agent/atendente",
    subAgents: [
      { id: "monitor-grupos", name: "Monitor de Grupos", description: "Detecta menções, classifica por tipo, departamento e urgência.", icon: Eye },
      { id: "detector-churn", name: "Detector de Churn", description: "Identifica sinais de cancelamento e risco de perda de clientes.", icon: AlertTriangle },
      { id: "mataburro-atendimento", name: "Mataburro", description: "Follow-ups automáticos para garantir resolução completa.", icon: RefreshCw },
      { id: "auditor-sla", name: "Auditor SLA", description: "Monitora tempos de resposta e compliance com SLA.", icon: ShieldAlert },
      { id: "agendador", name: "Agendador", description: "Agendamento inteligente de compromissos e reuniões.", icon: CalendarCheck },
      { id: "gestor-tarefas-data", name: "Gestor de Tarefas", description: "Organização e priorização de tarefas por data.", icon: Clock },
      { id: "transcritor-audio", name: "Transcritor", description: "Transcrição automática de áudios e reuniões.", icon: Mic },
      { id: "gerador-relatorios-atend", name: "Relatórios", description: "Geração de relatórios de atendimento e métricas.", icon: FileText },
    ],
  },
  {
    id: "gestor",
    name: "Gestor de Tráfego",
    description: "Gestão e otimização de campanhas de tráfego pago com IA.",
    icon: TrendingUp,
    color: "from-emerald-500 to-teal-500",
    accentClass: "text-green-400",
    chatRoute: "/agent/gestor",
    subAgents: [
      { id: "auditor-diario", name: "Auditor Diário", description: "Análise diária de performance de campanhas.", icon: BarChart3 },
      { id: "detector-anomalias", name: "Detector de Anomalias", description: "Identifica comportamentos atípicos em métricas.", icon: Zap },
      { id: "protetor-contas", name: "Protetor de Contas", description: "Alertas de violação de políticas de plataformas.", icon: Shield },
      { id: "insight-semanal", name: "Insight Semanal", description: "Relatório semanal com insights e recomendações.", icon: Lightbulb },
      { id: "escala-budget", name: "Escala Inteligente", description: "Ajuste automático de budget baseado em performance.", icon: Scale },
      { id: "analise-criativos", name: "Análise de Criativos", description: "A/B testing e análise de performance de criativos.", icon: Image },
      { id: "diagnostico-conversao", name: "Diagnóstico Conversão", description: "Análise do funil de conversão e gargalos.", icon: TrendingDown },
      { id: "relatorio-executivo", name: "Relatório Executivo", description: "Relatório consolidado para apresentação ao cliente.", icon: FileText },
      { id: "mataburro-sla-trafego", name: "Mataburro SLA", description: "Follow-ups automáticos de SLA de tráfego.", icon: RefreshCw },
    ],
  },
  {
    id: "radar",
    name: "Radar Estratégica",
    description: "Planejamento de conteúdo por cliente com análise de referências e trends.",
    icon: Search,
    color: "from-violet-500 to-purple-500",
    accentClass: "text-purple-400",
    chatRoute: "/agent/radar",
    subAgents: [
      { id: "entrada-referencias", name: "Análise de Referências", description: "Coleta e análise de referências visuais e de conteúdo.", icon: BookOpen },
      { id: "analise-conteudos", name: "Planejamento de Conteúdo", description: "Análise de conteúdos pendentes e planejamento editorial.", icon: PenTool },
      { id: "trends-pesquisas", name: "Trends e Pesquisas", description: "Pesquisa de trends no TikTok, Instagram e Google.", icon: Hash },
      { id: "criacao-hooks", name: "Criação de Hooks", description: "Sugestão de hooks fortes para captar atenção.", icon: Target },
      { id: "matriz-reaproveitamento", name: "Matriz de Reaproveitamento", description: "Conteúdos reaproveitáveis em múltiplos formatos.", icon: Layers },
      { id: "estrutura-carrossel", name: "Estrutura de Carrossel", description: "Templates e estruturas otimizadas para carrosséis.", icon: Layout },
      { id: "ideias-reels", name: "Ideias de Reels", description: "Ângulos estratégicos para criação de Reels.", icon: Video },
      { id: "indicador-trafego", name: "Indicador P/Tráfego", description: "Seleção de conteúdos para impulsionar com tráfego pago.", icon: Target },
      { id: "agente-captacao", name: "Agente de Captação", description: "Captação geral de oportunidades e leads orgânicos.", icon: Users2 },
    ],
  },
];

export const centralResources: Resource[] = [
  { id: "notebook-lm", name: "Notebook LM", description: "Google Notebook LM integrado.", icon: Notebook },
  { id: "google-drive", name: "Google Drive", description: "Acesso e gestão de arquivos.", icon: FolderOpen },
  { id: "chat-especifico", name: "Chat Específico", description: "Chat dedicado por contexto.", icon: MessageSquare },
  { id: "website-downloader", name: "Website Downloader", description: "Download de sites para análise.", icon: Download },
  { id: "backup-sync", name: "Backup Sync", description: "Sincronização e backup automático.", icon: Database },
  { id: "integracao-alexa", name: "Integração Alexa", description: "Comandos de voz via Alexa.", icon: Headset },
];

export interface TipCategory {
  id: string;
  title: string;
  tips: { name: string; description: string; url?: string }[];
}

export const tipCategories: TipCategory[] = [
  {
    id: "ia-geral",
    title: "IA Geral",
    tips: [
      { name: "Claude Code Hacks", description: "Computer use, economia, códigos secretos" },
      { name: "Gemini Modo Honesto", description: "Respostas sem filtro do Gemini" },
      { name: "ChatGPT Atlas", description: "Mapeamento visual de conhecimento" },
      { name: "Goblin.tools", description: "Ferramentas de IA para produtividade" },
      { name: "LLM Council", description: "Comparação entre modelos de IA" },
      { name: "DeepSeek OCR", description: "Extração de texto por IA" },
    ],
  },
  {
    id: "programacao",
    title: "Programação",
    tips: [
      { name: "Kimi K2.5", description: "Visual Code, Office Agent, Agent Swarm" },
      { name: "Google Antigravity", description: "Easter eggs e ferramentas ocultas" },
      { name: "Wind Surf IDE", description: "IDE com IA integrada" },
      { name: "Data Button", description: "Criação de apps com IA" },
      { name: "Skills do Claude Code", description: "Funcionalidades avançadas" },
    ],
  },
  {
    id: "design",
    title: "Design",
    tips: [
      { name: "Google Vibe Design", description: "Stitch - design com IA" },
      { name: "Magic Animator", description: "Animações geradas por IA" },
      { name: "Super Designer", description: "Design automatizado" },
      { name: "Kim Slides", description: "Apresentações com IA" },
    ],
  },
  {
    id: "imagens",
    title: "Imagens",
    tips: [
      { name: "Método CAMP", description: "Framework para prompts de imagem" },
      { name: "Flux 2", description: "Geração de imagens de alta qualidade" },
      { name: "Seedream 4.0", description: "Geração de imagens Google" },
      { name: "Upscale.media", description: "Aumento de resolução" },
      { name: "Moondream 3", description: "Visão computacional leve" },
    ],
  },
  {
    id: "videos",
    title: "Vídeos",
    tips: [
      { name: "Runway ML", description: "Edição e geração de vídeos" },
      { name: "Kling AI", description: "Vídeos com IA" },
      { name: "Hailuo 2.3", description: "Geração de vídeos realistas" },
      { name: "Remotion", description: "Vídeos programáticos em React" },
    ],
  },
  {
    id: "estudos",
    title: "Estudos",
    tips: [
      { name: "Hack de Aulas", description: "Otimização de aprendizado" },
      { name: "Hack Google Drive", description: "Produtividade no Drive" },
      { name: "Engenharia de Prompt", description: "Técnicas avançadas de prompt" },
      { name: "Otimizador de Prompt", description: "Melhore seus prompts automaticamente" },
    ],
  },
];
