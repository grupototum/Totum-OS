import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { validateForgotPasswordForm, type ValidationErrors } from "@/lib/validation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação client-side
    const validationErrors = validateForgotPasswordForm(email);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error(validationErrors.email);
      return;
    }
    
    setErrors({});
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("E-mail de redefinição enviado!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao enviar e-mail.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError?: boolean) =>
    `w-full px-3.5 py-2.5 text-sm rounded-xl bg-input border text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 ${
      hasError ? "border-destructive focus:border-destructive focus:ring-destructive/10" : "border-border"
    }`;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${i * 20}%`,
              background: "linear-gradient(to bottom, transparent, hsl(var(--border) / 0.15), transparent)",
              animation: `grid-line-pulse ${3 + i * 0.5}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <div
        className="absolute pointer-events-none"
        style={{
          width: 600, height: 600, top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(247,105,38,0.08) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm mx-auto px-6"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-3">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663032548632/bvUyrRtbH5C9bH6F2BSBEC/totum-icon_c601ad50.png"
              alt="Totum"
              className="w-10 h-10 rounded-lg"
            />
            <span className="font-sans text-xl font-bold tracking-tight text-foreground">
              Totum OS
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-sans text-3xl font-bold text-foreground mb-2">
            {sent ? "E-mail enviado" : "Redefinir senha"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {sent
              ? "Verifique sua caixa de entrada e clique no link para redefinir sua senha."
              : "Informe seu e-mail para receber o link de redefinição."}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div
              className="rounded-2xl border border-border/60 p-6 space-y-4"
              style={{ background: "hsl(var(--card) / 0.6)", backdropFilter: "blur(12px)" }}
            >
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  placeholder="seu@email.com"
                  disabled={loading}
                  autoComplete="email"
                  className={inputClass(!!errors.email)}
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-3 rounded-xl font-sans font-semibold text-sm text-primary-foreground bg-primary overflow-hidden transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed animate-totum-glow"
            >
              {loading && <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />}
              {loading ? "Enviando..." : "Enviar link de redefinição"}
            </button>
          </form>
        ) : (
          <div
            className="rounded-2xl border border-border/60 p-6 text-center"
            style={{ background: "hsl(var(--card) / 0.6)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-sm text-muted-foreground mb-4">
              Enviamos um link para <strong className="text-foreground">{email}</strong>.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-xs text-primary hover:underline"
            >
              Reenviar para outro e-mail
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
