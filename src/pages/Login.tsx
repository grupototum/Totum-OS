import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { validateLoginForm, type ValidationErrors } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const wasRemembered = localStorage.getItem("totum_remember_me") === "true";
    if (wasRemembered) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          navigate("/hub", { replace: true });
        }
      });
    }

    const savedEmail = localStorage.getItem("totum_remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || "Erro ao entrar com Google.");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstError = Object.values(validationErrors)[0];
      toast.error(firstError);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await signIn(email, password);
      if (rememberMe) {
        localStorage.setItem("totum_remember_email", email);
        localStorage.setItem("totum_remember_me", "true");
      } else {
        localStorage.removeItem("totum_remember_email");
        localStorage.removeItem("totum_remember_me");
      }
      toast.success("Bem-vindo à Totum!");
      navigate("/hub");
    } catch (err: any) {
      if (err.approvalStatus === "pending" || err.approvalStatus === "rejected") {
        navigate("/pending-approval", {
          replace: true,
          state: { status: err.approvalStatus, email: err.userEmail || email },
        });
        return;
      }
      toast.error(err.message || "Credenciais inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-container-high px-4 py-12">
      {/* Soft editorial radial wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, hsl(var(--accent) / 0.08) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="ds-panel p-8 sm:p-10 bg-surface-container">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-3">
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
            <span className="label-mono">Editorial Design System</span>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-2">
              Bem-vindo de volta
            </h1>
            <p className="paragraph text-muted-foreground">
              Acesse a central de agentes de IA da Totum
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="label-mono block">
                Usuário ou E-mail
              </label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                }}
                placeholder="seu@email.com"
                disabled={loading}
                autoComplete="username"
                aria-describedby={errors.email ? "email-error" : undefined}
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-destructive mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="label-mono block">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={`pr-11 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-xs text-destructive mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember me + forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors shrink-0 ${
                    rememberMe
                      ? "bg-foreground border-foreground"
                      : "border-border bg-transparent group-hover:border-muted-foreground"
                  }`}
                >
                  {rememberMe && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="hsl(var(--background))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  Lembrar de mim
                </span>
              </label>
              <Link to="/forgot-password" className="text-xs text-accent hover:underline font-medium">
                Esqueci minha senha
              </Link>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                ou
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
                </svg>
              )}
              <span>{googleLoading ? "Entrando..." : "Entrar com Google"}</span>
            </Button>

            {/* Primary submit */}
            <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            Não tem conta?{" "}
            <Link to="/signup" className="text-foreground hover:underline font-medium">
              Cadastre-se
            </Link>
          </p>
          <p className="label-mono">
            © {new Date().getFullYear()} Grupo Totum · Sistema de Agentes IA
          </p>
        </div>
      </motion.div>
    </div>
  );
}
