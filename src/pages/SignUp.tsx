import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Sun, Moon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { lovable } from "@/integrations/lovable/index";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { validateSignUpForm, type ValidationErrors } from "@/lib/validation";

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { theme, toggleTheme } = useTheme();

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || "Erro ao entrar com Google.");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação client-side
    const validationErrors = validateSignUpForm(email, password, confirmPassword, name);
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
      await signUp(email, password, name || undefined);
      toast.success("Conta criada com sucesso!");
      navigate("/hub");
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar conta.");
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
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-card/60 border border-border/40 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors"
        title={theme === "dark" ? "Modo Claro" : "Modo Escuro"}
      >
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
      {/* Grid lines background */}
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
        {[1, 2, 3].map((i) => (
          <div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-px"
            style={{
              top: `${i * 25}%`,
              background: "linear-gradient(to right, transparent, hsl(var(--border) / 0.1), transparent)",
            }}
          />
        ))}
      </div>

      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(247,105,38,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm mx-auto px-6"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-3">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663032548632/bvUyrRtbH5C9bH6F2BSBEC/totum-icon_c601ad50.png"
              alt="Totum"
              className="w-10 h-10 rounded-lg"
            />
            <span className="font-sans text-xl font-bold tracking-tight text-foreground">
              Apps Totum
            </span>
          </div>
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Central de Agentes IA
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="font-sans text-3xl font-bold text-foreground mb-2">
            Criar conta
          </h1>
          <p className="text-sm text-muted-foreground">
            Cadastre-se para acessar os agentes de IA da Totum
          </p>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div
            className="rounded-2xl border border-border/60 p-6 space-y-4"
            style={{ background: "hsl(var(--card) / 0.6)", backdropFilter: "blur(12px)" }}
          >
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Nome completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                placeholder="Seu nome"
                disabled={loading}
                autoComplete="name"
                className={inputClass(!!errors.name)}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
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

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Senha
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Confirmar senha
              </label>
              <div className="relative">
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
                  className={`${inputClass(!!errors.confirmPassword)} pr-11`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border/40" />
              <span className="text-xs text-muted-foreground/50 uppercase tracking-wider">ou</span>
              <div className="flex-1 h-px bg-border/40" />
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full py-3 rounded-xl font-sans font-semibold text-sm border border-border/60 text-foreground bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-border disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                </svg>
              )}
              {googleLoading ? "Entrando..." : "Cadastrar com Google"}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full py-3 rounded-xl font-sans font-semibold text-sm text-primary-foreground bg-primary overflow-hidden transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed animate-totum-glow"
          >
            {loading && <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />}
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 space-y-3 text-center">
          <p className="text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Entrar
            </Link>
          </p>
          <p className="text-xs text-muted-foreground/40">
            © {new Date().getFullYear()} Grupo Totum · Sistema de Agentes IA
          </p>
        </div>
      </motion.div>
    </div>
  );
}
