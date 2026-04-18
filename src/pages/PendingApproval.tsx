import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, XCircle, LogOut, CheckCircle2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export default function PendingApproval() {
  const navigate = useNavigate();
  const location = useLocation();
  const status = (location.state as any)?.status ?? "pending";
  const email = (location.state as any)?.email ?? "";
  const isRejected = status === "rejected";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-container-high px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: isRejected
            ? "radial-gradient(60% 50% at 50% 0%, hsl(var(--destructive) / 0.08) 0%, transparent 70%)"
            : "radial-gradient(60% 50% at 50% 0%, hsl(var(--accent) / 0.08) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md text-center"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="grid grid-cols-2 w-9 h-9 gap-1">
              <div className="bg-foreground w-full h-full rounded-[4px]" />
              <div className="bg-foreground/70 w-full h-full rounded-[4px]" />
              <div className="bg-foreground/40 w-full h-full rounded-[4px]" />
              <div className="bg-accent w-full h-full rounded-[4px]" />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight text-foreground">
              Totum
            </span>
          </div>
          <span className="label-mono">Apps Totum · Sistema de Agentes IA</span>
        </div>

        <div className="ds-panel p-8 sm:p-10 bg-surface-container space-y-6 text-left">
          {/* Icon */}
          {isRejected ? (
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-amber-500" />
              </div>
            </div>
          )}

          {/* Title */}
          <div className="text-center">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-2">
              {isRejected ? "Acesso não autorizado" : "Cadastro recebido!"}
            </h1>
            <p className="paragraph text-muted-foreground leading-relaxed">
              {isRejected
                ? "Seu cadastro foi analisado e não foi aprovado. Entre em contato com o administrador para mais informações."
                : "Seu cadastro foi registrado com sucesso. O administrador irá analisar e aprovar o seu acesso em breve."}
            </p>
          </div>

          {/* Steps (only for pending) */}
          {!isRejected && (
            <div className="rounded-2xl border border-border bg-muted/40 p-5 space-y-3">
              <p className="label-mono">Próximos passos</p>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">Cadastro enviado ao administrador</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-amber-500/70 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                </div>
                <span className="text-sm text-foreground">
                  Aguardando aprovação do administrador
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full border border-border shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Acesso liberado — você poderá fazer login
                </span>
              </div>
            </div>
          )}

          {/* Email hint */}
          {email && !isRejected && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
              <Mail className="h-3.5 w-3.5" />
              <span>
                Notificação enviada para{" "}
                <span className="text-foreground font-medium">{email}</span>
              </span>
            </div>
          )}

          {/* Back button */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleSignOut}
            className="w-full"
          >
            <LogOut className="h-4 w-4" />
            <span>{isRejected ? "Voltar ao login" : "Sair e aguardar aprovação"}</span>
          </Button>
        </div>

        <p className="mt-6 label-mono">
          © {new Date().getFullYear()} Grupo Totum
        </p>
      </motion.div>
    </div>
  );
}
