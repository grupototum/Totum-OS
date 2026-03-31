import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Bem-vindo à Totum!");
      navigate("/hub");
    } catch (err: any) {
      toast.error(err.message || "Credenciais inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
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
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              Apps Totum
            </span>
          </div>
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Central de Agentes IA
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            Bem-vindo de volta.
          </h1>
          <p className="text-sm text-muted-foreground">
            Acesse a central de agentes de IA da Totum
          </p>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-2xl border border-border/60 p-6 space-y-4"
            style={{ background: "hsl(var(--card) / 0.6)", backdropFilter: "blur(12px)" }}
          >
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Usuário ou E-mail
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Totum ou seu@email.com"
                disabled={loading}
                autoComplete="username"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 pr-11 text-sm rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full py-3 rounded-xl font-heading font-semibold text-sm text-primary-foreground bg-primary overflow-hidden transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed animate-totum-glow"
          >
            {/* Particle dots */}
            <div className="absolute inset-0 pointer-events-none">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-0.5 rounded-full bg-primary-foreground/20"
                  style={{
                    left: `${15 + i * 14}%`,
                    top: `${30 + (i % 3) * 20}%`,
                  }}
                />
              ))}
            </div>
            {loading && <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />}
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 space-y-3 text-center">
          <p className="text-xs text-muted-foreground/60">
            Acesso restrito · Apenas por convite do administrador
          </p>
          <p className="text-xs text-muted-foreground/40">
            © {new Date().getFullYear()} Grupo Totum · Sistema de Agentes IA
          </p>
        </div>
      </motion.div>
    </div>
  );
}
