/**
 * OnboardingModal — First-time user experience
 * Shows once on first login, stored in localStorage.
 * 6 steps: Welcome → Agentes → Alexandria → Workspace → Ferramentas → Pronto
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  BookOpen,
  Search,
  Sparkles,
  ChevronRight,
  X,
  Command,
  KanbanSquare,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  emoji: string;
  icon: React.ElementType;
  title: string;
  description: string;
  cta?: { label: string; path: string };
  color: string;
}

const STEPS: Step[] = [
  {
    id: "welcome",
    emoji: "👋",
    icon: Sparkles,
    title: "Bem-vindo à Totum",
    description:
      "Sua plataforma de infraestrutura de crescimento com agentes de IA, base de conhecimento e ferramentas integradas. Vamos fazer um tour rápido.",
    color: "from-primary/20 to-primary/5",
  },
  {
    id: "agents",
    emoji: "🤖",
    icon: Bot,
    title: "Hub de Agentes",
    description:
      "Acesse o Hub para ver todos os agentes disponíveis — Radar, Gestor, Social, Atendente, SDR e mais. Cada agente tem um chat dedicado para você interagir diretamente.",
    cta: { label: "Abrir Hub de Agentes", path: "/hub" },
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    id: "hermione",
    emoji: "📚",
    icon: BookOpen,
    title: "Alexandria & Hermione",
    description:
      "A Alexandria é a biblioteca de conhecimento da Totum. A Hermione é a IA guardiã — converse com ela para buscar POPs, documentação e qualquer informação interna.",
    cta: { label: "Conversar com Hermione", path: "/hermione" },
    color: "from-amber-500/20 to-amber-500/5",
  },
  {
    id: "workspace",
    emoji: "📋",
    icon: KanbanSquare,
    title: "Workspace",
    description:
      "Gerencie tarefas no quadro Kanban, acompanhe o pipeline de conteúdo, monte planos de ação e organize o escritório. Tudo em um só lugar.",
    cta: { label: "Ver Tarefas", path: "/tasks" },
    color: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    id: "tools",
    emoji: "🛠️",
    icon: Cpu,
    title: "Ferramentas",
    description:
      "Documentação, Cráudio Codete e Claude Code estão à sua disposição. E não esqueça: pressione ⌘K para buscar e navegar rapidamente por qualquer área.",
    cta: { label: "Abrir Documentação", path: "/docs" },
    color: "from-violet-500/20 to-violet-500/5",
  },
  {
    id: "commandk",
    emoji: "⌘",
    icon: Command,
    title: "Busca Rápida ⌘K",
    description:
      "Pressione Cmd+K (Mac) ou Ctrl+K (Windows) de qualquer página para abrir a paleta de busca global. Navegue para qualquer área do sistema em segundos.",
    color: "from-rose-500/20 to-rose-500/5",
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ open, onClose }: Props) {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  const handleNext = () => {
    if (isLast) {
      handleClose();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleCta = () => {
    if (current.cta) {
      handleClose();
      navigate(current.cta.path);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Card */}
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md bg-card border border-border shadow-2xl overflow-hidden"
          >
            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Skip button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 left-4 text-[11px] font-mono uppercase tracking-wider text-muted-foreground/60 hover:text-muted-foreground transition-colors z-10"
            >
              Pular tour
            </button>

            {/* Hero gradient area */}
            <div className={cn("bg-gradient-to-br p-8 pb-6 mt-2", current.color)}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-5xl mb-4"
              >
                {current.emoji}
              </motion.div>
              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-xl font-semibold text-foreground"
              >
                {current.title}
              </motion.h2>
            </div>

            {/* Content */}
            <div className="p-6 pt-4">
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-muted-foreground leading-relaxed mb-6"
              >
                {current.description}
              </motion.p>

              {/* CTA secondary button */}
              {current.cta && (
                <motion.button
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  onClick={handleCta}
                  className="w-full mb-3 flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-muted/50 hover:bg-muted transition-colors text-sm font-medium text-foreground group"
                >
                  {current.cta.label}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
              )}

              {/* Primary action */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button className="w-full" onClick={handleNext}>
                  {isLast ? "Começar agora" : "Próximo"}
                  {!isLast && <ChevronRight className="w-4 h-4 ml-1" />}
                </Button>
              </motion.div>
            </div>

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-1.5 pb-5">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    i === step
                      ? "w-5 h-1.5 bg-primary"
                      : "w-1.5 h-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  )}
                />
              ))}
            </div>

            {/* Step counter */}
            <div className="text-center pb-3">
              <span className="text-[10px] font-mono text-muted-foreground/40">
                {step + 1} / {STEPS.length}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
