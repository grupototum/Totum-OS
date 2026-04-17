import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { usePageTransition } from '@/hooks/usePageTransition';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Lock,
  Unlock,
  Target,
  CheckCircle2,
  Circle,
  RefreshCw,
  Calendar,
  Users,
  Zap,
  TrendingUp,
  Bot,
  FileText,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const HARDCODED_PASSWORD = 'Totum@SupremoIsrael';

// ── Types ──────────────────────────────────────────────────
type KRStatus = 'done' | 'on-track' | 'at-risk' | 'pending';
type MilestoneStatus = 'done' | 'in-progress' | 'pending';
type Priority = 'alta' | 'média' | 'baixa';

interface KeyResult {
  text: string;
  status: KRStatus;
  progress: number;
}

interface OKR {
  objective: string;
  owner: string;
  progress: number;
  color: string;
  keyResults: KeyResult[];
}

interface SprintTask {
  title: string;
  priority: Priority;
  assignee: string;
  done: boolean;
}

interface Milestone {
  date: string;
  title: string;
  description: string;
  status: MilestoneStatus;
}

interface Decision {
  date: string;
  decision: string;
  owner: string;
  area: string;
}

// ── Data ───────────────────────────────────────────────────
const OKRS: OKR[] = [
  {
    objective: 'Escalar a entrega de conteúdo automatizado para clientes',
    owner: 'Israel L.',
    progress: 68,
    color: 'from-violet-500 to-purple-600',
    keyResults: [
      { text: 'Ativar pipeline de conteúdo para 10 clientes ativos', status: 'on-track', progress: 70 },
      { text: 'Reduzir tempo médio de produção de post para < 4 min', status: 'done', progress: 100 },
      { text: 'Atingir 95% de aprovação de conteúdo pelos clientes', status: 'at-risk', progress: 42 },
    ],
  },
  {
    objective: 'Consolidar a operação de tráfego pago com agentes IA',
    owner: 'Equipe Tráfego',
    progress: 52,
    color: 'from-emerald-500 to-teal-600',
    keyResults: [
      { text: 'Integrar relatórios automáticos Meta Ads + Google Ads', status: 'on-track', progress: 60 },
      { text: 'Reduzir CPL médio dos clientes em 15%', status: 'at-risk', progress: 33 },
      { text: 'Publicar 4 campanhas por semana usando o agente Gestor', status: 'on-track', progress: 65 },
    ],
  },
  {
    objective: 'Lançar e monetizar o produto SaaS Totum para terceiros',
    owner: 'Israel L.',
    progress: 30,
    color: 'from-rose-500 to-pink-600',
    keyResults: [
      { text: 'Concluir MVP da plataforma com auth + dashboard', status: 'on-track', progress: 55 },
      { text: 'Conquistar 3 clientes beta pagantes até Jun/26', status: 'at-risk', progress: 10 },
      { text: 'Publicar landing page e funil de vendas do produto', status: 'pending' as KRStatus, progress: 20 },
    ],
  },
];

const SPRINT = {
  name: 'Sprint 08 — Automação & Growth',
  period: '14 Abr – 25 Abr 2026',
  progress: 45,
  tasks: [
    { title: 'Integrar Hermione ao pipeline de postagens do Instagram', priority: 'alta' as Priority, assignee: 'Israel L.', done: true },
    { title: 'Criar fluxo de onboarding de novos clientes via Ada', priority: 'alta' as Priority, assignee: 'Israel L.', done: false },
    { title: 'Ajustar prompts do agente de relatório de tráfego', priority: 'média' as Priority, assignee: 'Equipe IA', done: true },
    { title: 'Subir wiki interna com SOPs de atendimento', priority: 'média' as Priority, assignee: 'Ops', done: false },
    { title: 'Publicar case de resultado de cliente no blog', priority: 'baixa' as Priority, assignee: 'Marketing', done: false },
    { title: 'Revisar e corrigir erros no QuadroTarefas mobile', priority: 'baixa' as Priority, assignee: 'Dev', done: false },
  ] as SprintTask[],
};

const TIMELINE: Milestone[] = [
  { date: 'Abr 01', title: 'Kickoff Q2 2026', description: 'Alinhamento de OKRs, distribuição de squads e revisão do roadmap.', status: 'done' },
  { date: 'Abr 14', title: 'Sprint 08 — Automação & Growth', description: 'Foco em pipeline de conteúdo e integrações de IA para produção.', status: 'in-progress' },
  { date: 'Abr 30', title: 'Revisão Mid-Quarter', description: 'Check-in de OKRs, ajuste de prioridades e apresentação de métricas.', status: 'pending' },
  { date: 'Mai 15', title: 'Beta fechado do produto SaaS', description: 'Primeiro cliente beta com acesso à plataforma Totum.', status: 'pending' },
  { date: 'Mai 31', title: 'Expansão para 15 clientes ativos', description: 'Meta de crescimento de carteira e onboarding automatizado.', status: 'pending' },
  { date: 'Jun 20', title: 'Fechamento Q2 & QBR', description: 'Quarterly Business Review: resultados, aprendizados e plano Q3.', status: 'pending' },
];

const DECISIONS: Decision[] = [
  { date: '10 Abr', decision: 'Migrar agente Hermione de OpenAI para Gemini 1.5 Flash como modelo principal', owner: 'Israel L.', area: 'Tecnologia' },
  { date: '07 Abr', decision: 'Pausar desenvolvimento do módulo de relatórios até Sprint 09 para focar em onboarding', owner: 'Israel L.', area: 'Produto' },
  { date: '03 Abr', decision: 'Adotar Supabase como backend principal para todos os novos módulos', owner: 'Dev', area: 'Arquitetura' },
  { date: '01 Abr', decision: 'Aumentar ticket médio dos clientes de agência em 20% com novo pacote Premium IA', owner: 'Comercial', area: 'Negócios' },
  { date: '28 Mar', decision: 'Implementar sistema de créditos de IA para controle de custos por cliente', owner: 'Israel L.', area: 'Financeiro' },
];

// ── Helpers ────────────────────────────────────────────────
const KRStatusConfig: Record<KRStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  done:       { label: 'Concluído', cls: 'bg-emerald-500/15 text-emerald-600 border-transparent', icon: <CheckCircle2 className="w-3 h-3" /> },
  'on-track': { label: 'No prazo',  cls: 'bg-blue-500/15 text-blue-600 border-transparent',      icon: <TrendingUp className="w-3 h-3" /> },
  'at-risk':  { label: 'Em risco',  cls: 'bg-rose-500/15 text-rose-600 border-transparent',       icon: <AlertTriangle className="w-3 h-3" /> },
  'pending':  { label: 'Pendente',  cls: 'bg-zinc-500/15 text-zinc-400 border-transparent',       icon: <Circle className="w-3 h-3" /> },
};

const PriorityConfig: Record<Priority, { cls: string }> = {
  alta:  { cls: 'bg-rose-500/15 text-rose-600 border-transparent' },
  média: { cls: 'bg-amber-500/15 text-amber-600 border-transparent' },
  baixa: { cls: 'bg-zinc-500/15 text-zinc-500 border-transparent' },
};

const MilestoneIcon = ({ status }: { status: MilestoneStatus }) => {
  if (status === 'done')        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
  if (status === 'in-progress') return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" style={{ animationDuration: '3s' }} />;
  return <Circle className="w-5 h-5 text-zinc-500" />;
};

// ── Protected content ──────────────────────────────────────
function ActionPlanContent() {
  const completedTasks = SPRINT.tasks.filter((t) => t.done).length;
  const pageTransition = usePageTransition();

  return (
    <AppLayout>
      <motion.div {...pageTransition} className="min-h-screen p-6 max-w-5xl mx-auto space-y-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">Plano de Ação Totum</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Visão estratégica, OKRs e execução do trimestre</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20 font-mono">
              <Calendar className="w-3 h-3" />
              Q2 2026
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 font-mono">
              <Zap className="w-3 h-3" />
              Ativo
            </span>
          </div>
        </motion.div>

        {/* ── OKRs ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            <Target className="w-4 h-4" />
            OKRs — Q2 2026
          </h2>
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
            {OKRS.map((okr, oi) => (
              <Card key={oi} className="rounded-2xl bg-card border-border p-0 overflow-hidden">
                {/* gradient accent */}
                <div className={cn('h-1 bg-gradient-to-r', okr.color)} />
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground leading-snug">{okr.objective}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3 text-muted-foreground shrink-0" />
                    <span className="text-[11px] text-muted-foreground">{okr.owner}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-mono text-foreground">{okr.progress}%</span>
                    </div>
                    <Progress value={okr.progress} className="h-1.5" />
                  </div>
                  <div className="space-y-2 pt-1">
                    {okr.keyResults.map((kr, ki) => {
                      const cfg = KRStatusConfig[kr.status];
                      return (
                        <div key={ki} className="flex items-start gap-2">
                          <span className={cn('inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-mono shrink-0 mt-0.5', cfg.cls)}>
                            {cfg.icon}
                          </span>
                          <p className="text-[11px] text-muted-foreground leading-snug">{kr.text}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* ── Sprint atual ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            <Zap className="w-4 h-4" />
            Sprint Atual
          </h2>
          <Card className="rounded-2xl bg-card border-border overflow-hidden p-0">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
            <CardContent className="p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{SPRINT.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {SPRINT.period}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 min-w-[120px]">
                  <span className="text-xs text-muted-foreground font-mono">
                    {completedTasks}/{SPRINT.tasks.length} tarefas
                  </span>
                  <Progress value={SPRINT.progress} className="h-1.5 w-32" />
                </div>
              </div>
              <div className="divide-y divide-border">
                {SPRINT.tasks.map((task, ti) => (
                  <div key={ti} className={cn('flex items-center gap-3 py-2.5', task.done && 'opacity-50')}>
                    <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0', task.done ? 'bg-emerald-500 border-emerald-500' : 'border-border')}>
                      {task.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <p className={cn('flex-1 text-sm text-foreground', task.done && 'line-through text-muted-foreground')}>{task.title}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-mono', PriorityConfig[task.priority].cls)}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-muted-foreground hidden sm:block">{task.assignee}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* ── Timeline ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            <ChevronRight className="w-4 h-4" />
            Timeline Q2 2026
          </h2>
          <Card className="rounded-2xl bg-card border-border overflow-hidden p-0">
            <CardContent className="p-5">
              <div className="relative">
                {/* vertical line */}
                <div className="absolute left-[22px] top-3 bottom-3 w-px bg-border" />
                <div className="space-y-6">
                  {TIMELINE.map((ms, mi) => (
                    <div key={mi} className="flex items-start gap-4">
                      <div className="relative z-10 shrink-0 w-11 flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
                          <MilestoneIcon status={ms.status} />
                        </div>
                      </div>
                      <div className="flex-1 pb-1">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-mono text-muted-foreground">{ms.date}</span>
                          <h4 className="text-sm font-semibold text-foreground">{ms.title}</h4>
                          {ms.status === 'in-progress' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-500 font-mono">Em andamento</span>
                          )}
                          {ms.status === 'done' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-mono">Concluído</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{ms.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* ── Decisions log ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            <FileText className="w-4 h-4" />
            Log de Decisões Estratégicas
          </h2>
          <Card className="rounded-2xl bg-card border-border overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-[10px] font-mono text-muted-foreground uppercase tracking-wider px-5 py-3 w-20">Data</th>
                    <th className="text-left text-[10px] font-mono text-muted-foreground uppercase tracking-wider px-5 py-3">Decisão</th>
                    <th className="text-left text-[10px] font-mono text-muted-foreground uppercase tracking-wider px-5 py-3 w-24 hidden sm:table-cell">Área</th>
                    <th className="text-left text-[10px] font-mono text-muted-foreground uppercase tracking-wider px-5 py-3 w-28 hidden md:table-cell">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {DECISIONS.map((d, di) => (
                    <tr key={di} className="hover:bg-secondary/40 transition-colors">
                      <td className="px-5 py-3 text-[11px] font-mono text-muted-foreground whitespace-nowrap">{d.date}</td>
                      <td className="px-5 py-3 text-xs text-foreground leading-relaxed">{d.decision}</td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-500/10 text-zinc-400 font-mono">{d.area}</span>
                      </td>
                      <td className="px-5 py-3 text-[11px] text-muted-foreground hidden md:table-cell">{d.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.section>

        {/* Footer */}
        <p className="text-center text-[10px] text-muted-foreground/40 pb-4 font-mono">
          Totum Digital · Plano de Ação Q2 2026 · Uso restrito
        </p>
      </motion.div>
    </AppLayout>
  );
}

// ── Page (with password gate) ─────────────────────────────
const ActionPlan = () => {
  const [passInput, setPassInput] = useState('');
  const [autorizado, setAutorizado] = useState(false);

  const verificarAcesso = () => {
    if (passInput === HARDCODED_PASSWORD) {
      setAutorizado(true);
      toast.success('Acesso concedido');
    } else {
      toast.error('Código de acesso inválido');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') verificarAcesso();
  };

  if (!autorizado) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4" style={{ backgroundColor: '#EAEAE5' }}>
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-primary/10">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold">Plano de Ação</h1>
            <p className="text-muted-foreground">
              Esta área é restrita. Digite o código de acesso para continuar.
            </p>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Código de acesso"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={verificarAcesso} className="w-full">
              <Unlock className="w-4 h-4 mr-2" />
              Acessar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <ActionPlanContent />;
};

export default ActionPlan;
