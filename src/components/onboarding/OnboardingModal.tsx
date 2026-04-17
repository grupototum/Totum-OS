/**
 * OnboardingModal — First-time user experience
 * Shows once on first login, stored in localStorage.
 * 4 steps: Welcome → Agentes → Alexandria/Hermione → Command+K
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, BookOpen, Search, Sparkles, ChevronRight, X, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "totum_onboarded_v1";

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
    id: "commandk",
    emoji: "⌡",
    icon: Command,
    title: "Busca Rápida ⌘K",
    description:
      "Pressione Cmd+K (Mac) ou Ctrl+K (Windows) de qualquer página para abrir a paleta de busca global. Navegue para qualquer área do sistema em segundos.",
    color: "from-violet-500/20 to-violet-500/5",
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function OnboardingModal({ open, onClose }: Props) {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

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
    localStorage.setItem(STORAGE_KEY, "true");
    onClose();
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
            className="relative z-10 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Hero gradient area */}
            <div className={cn("bg-gradient-to-br p-8 pb-6", current.color)}>
              <div className="text-5xl mb-4">{current.emoji}</div>
              <h2 className="text-xl font-semibold text-foreground">{current.title}</h2>
            </div>

            {/* Content */}
            <div className="p-6 pt-4">
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {current.description}
              </p>

              {/* CTA secondary button */}
              {current.cta && (
                <button
                  onClick={handleCta}
                  className="w-full mb-3 flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-muted/50 hover:bg-muted transition-colors text-sm font-medium text-foreground group"
                >
                  {current.cta.label}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              {/* Primary action */}
              <Button className="w-full" onClick={handleNext}>
                {isLast ? "Começar agora" : "Próximo"}
                {!isLast && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook — manages open state + localStorage check.
 * Mount in AppLayout (only renders for authenticated users).
 */
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      // Small delay to avoid flash on first render
      const t = setTimeout(() => setShowOnboarding(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  return {
    showOnboarding,
    closeOnboarding: () => {
      localStorage.setItem(STORAGE_KEY, "true");
      setShowOnboarding(false);
    },
  };
}
