import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { lovable } from "@/integrations/lovable/index";
import { motion } from "framer-motion";
import { validateLoginForm, type ValidationErrors } from "@/lib/validation";
import { GlowButton, BeamButton } from "@/components/ui/button";

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

  // Pre-fill email if previously remembered
  useEffect(() => {
    const saved = localStorage.getItem("totum_remember_email");
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

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
      // Persist or clear remembered email
      if (rememberMe) {
        localStorage.setItem("totum_remember_email", email);
      } else {
        localStorage.removeItem("totum_remember_email");
      }
      toast.success("Bem-vindo à Totum!");
      navigate("/hub");
    } catch (err: any) {
      toast.error(err.message || "Credenciais inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Grid lines background */}
      <div className="absolute inset-0 pointer-events-none">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${i * 20}%`,
              background: "linear-gradient(to bottom, transparent, rgba(39, 39, 42, 0.15), transparent)",
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
              background: "linear-gradient(to right, transparent, rgba(39, 39, 42, 0.1), transparent)",
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
          background: "radial-gradient(circle, rgba(239,35,60,0.08) 0%, transparent 70%)",
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
            <div className="grid grid-cols-2 w-8 h-8 gap-1">
              <div className="bg-[#ef233c] w-full h-full" />
              <div className="bg-zinc-700 w-full h-full" />
              <div className="bg-zinc-800 w-full h-full" />
              <div className="bg-white w-full h-full shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
            </div>
            <span className="font-manrope text-xl font-bold tracking-tight text-white">
              Totum
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Live Design System
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="font-manrope text-4xl font-medium text-white tracking-tighter mb-2">
            Design System
          </h1>
          <p className="paragraph-lg text-zinc-400">
            Acesse a central de agentes de IA da Totum
          </p>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="border border-zinc-800 p-6 space-y-4 bg-black">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="label-mono text-zinc-500">
                Usuário ou E-mail
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                }}
                placeholder="Totum ou seu@email.com"
                disabled={loading}
                autoComplete="username"
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`input-ds focus:outline-2 focus:outline-[#ef233c] focus:outline-offset-2 ${
                  errors.email ? "border-[#ef233c]" : "border-zinc-800"
                }`}
              />
              {errors.email && (
                <p id="email-error" className="text-xs text-[#ef233c] mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="label-mono text-zinc-500">
                Senha
              </label>
              <div className="relative">
                <input
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
                  className={`input-ds pr-11 focus:outline-2 focus:outline-[#ef233c] focus:outline-offset-2 ${
                    errors.password ? "border-[#ef233c]" : "border-zinc-800"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-2 focus:outline-[#ef233c] focus:outline-offset-2 rounded px-1"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-xs text-[#ef233c] mt-1">{errors.password}</p>
              )}
            </div>
            
            {/* Remember me + forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 border flex items-center justify-center transition-colors shrink-0 ${
                    rememberMe
                      ? "bg-[#ef233c] border-[#ef233c]"
                      : "border-zinc-700 bg-transparent group-hover:border-zinc-500"
                  }`}
                >
                  {rememberMe && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  Lembrar de mim
                </span>
              </label>
              <Link to="/forgot-password" className="text-xs text-[#ef233c] hover:underline">
                Esqueci minha senha
              </Link>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">ou</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full py-3 font-manrope font-semibold text-sm border border-zinc-800 text-white bg-zinc-900 overflow-hidden transition-all duration-300 hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
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
              {googleLoading ? "Entrando..." : "Entrar com Google"}
            </button>
          </div>

          {/* Submit - Primary Glow Button */}
          <GlowButton
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Entrando..." : "Entrar"}
          </GlowButton>
        </form>

        {/* Footer */}
        <div className="mt-6 space-y-3 text-center">
          <p className="text-sm text-zinc-400">
            Não tem conta?{" "}
            <Link to="/signup" className="text-[#ef233c] hover:underline font-medium">
              Cadastre-se
            </Link>
          </p>
          <p className="font-mono text-[10px] text-zinc-600">
            © {new Date().getFullYear()} Grupo Totum · Sistema de Agentes IA
          </p>
        </div>
      </motion.div>
    </div>
  );
}
