import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { validateResetPasswordForm, type ValidationErrors } from "@/lib/validation";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    // Check for recovery event from the URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get("type");
    if (type === "recovery") {
      setReady(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação client-side
    const validationErrors = validateResetPasswordForm(password, confirmPassword);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Mostra o primeiro erro
      const firstError = Object.values(validationErrors)[0];
      toast.error(firstError);
      return;
    }
    
    setErrors({});
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Senha redefinida com sucesso!");
      navigate("/hub");
    } catch (err: any) {
      toast.error(err.message || "Erro ao redefinir senha.");
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
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              Apps Totum
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            Nova senha
          </h1>
          <p className="text-sm text-muted-foreground">
            Defina sua nova senha de acesso
          </p>
        </div>

        {!ready ? (
          <div
            className="rounded-2xl border border-border/60 p-6 text-center"
            style={{ background: "hsl(var(--card) / 0.6)", backdropFilter: "blur(12px)" }}
          >
            <p className="text-sm text-muted-foreground">
              Link inválido ou expirado. Solicite um novo link de redefinição.
            </p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="mt-4 text-sm text-primary hover:underline font-medium"
            >
              Solicitar novo link
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div
              className="rounded-2xl border border-border/60 p-6 space-y-4"
              style={{ background: "hsl(var(--card) / 0.6)", backdropFilter: "blur(12px)" }}
            >
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Nova senha
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    placeholder="Mínimo 6 caracteres"
                    disabled={loading}
                    autoComplete="new-password"
                    className={`${inputClass(!!errors.password)} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Confirmar nova senha
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                  placeholder="Repita a senha"
                  disabled={loading}
                  autoComplete="new-password"
                  className={inputClass(!!errors.confirmPassword)}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-3 rounded-xl font-heading font-semibold text-sm text-primary-foreground bg-primary overflow-hidden transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed animate-totum-glow"
            >
              {loading && <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />}
              {loading ? "Salvando..." : "Redefinir senha"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
