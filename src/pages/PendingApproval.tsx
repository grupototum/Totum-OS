import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, XCircle, LogOut, CheckCircle2, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function PendingApproval() {
  const navigate = useNavigate();
  const location = useLocation();
  const status = (location.state as any)?.status ?? 'pending';
  const email  = (location.state as any)?.email ?? '';
  const isRejected = status === 'rejected';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${i * 20}%`,
              background: 'linear-gradient(to bottom, transparent, rgba(39,39,42,0.15), transparent)',
            }}
          />
        ))}
      </div>

      {/* Glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600, height: 600,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: isRejected
            ? 'radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(239,35,60,0.07) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-auto px-6 text-center"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="grid grid-cols-2 w-8 h-8 gap-1">
              <div className="bg-[#ef233c] w-full h-full" />
              <div className="bg-zinc-700 w-full h-full" />
              <div className="bg-zinc-800 w-full h-full" />
              <div className="bg-white w-full h-full shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
            </div>
            <span className="font-manrope text-xl font-bold tracking-tight text-white">Totum</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Apps Totum · Sistema de Agentes IA
          </span>
        </div>

        <div className="border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm p-8 space-y-6">

          {/* Icon */}
          {isRejected ? (
            <div className="flex justify-center">
              <XCircle className="h-14 w-14 text-red-500" />
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border border-amber-400/30 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-amber-400" />
                </div>
                <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-amber-400" />
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <h1 className="font-manrope text-2xl font-bold text-white mb-2">
              {isRejected ? 'Acesso não autorizado' : 'Cadastro recebido!'}
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {isRejected
                ? 'Seu cadastro foi analisado e não foi aprovado. Entre em contato com o administrador para mais informações.'
                : 'Seu cadastro foi registrado com sucesso. O administrador irá analisar e aprovar o seu acesso em breve.'}
            </p>
          </div>

          {/* Steps (only for pending) */}
          {!isRejected && (
            <div className="text-left space-y-3 border border-zinc-800 p-4 bg-zinc-900/50">
              <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
                Próximos passos
              </p>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span className="text-xs text-zinc-300">Cadastro enviado ao administrador</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full border border-amber-400/60 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                </div>
                <span className="text-xs text-zinc-300">Aguardando aprovação do administrador</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0 mt-0.5" />
                <span className="text-xs text-zinc-500">Acesso liberado — você poderá fazer login</span>
              </div>
            </div>
          )}

          {/* Email hint */}
          {email && !isRejected && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 justify-center">
              <Mail className="h-3.5 w-3.5" />
              <span>Notificação enviada para <span className="text-zinc-300">{email}</span></span>
            </div>
          )}

          {/* Back button */}
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-white transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            {isRejected ? 'Voltar ao login' : 'Sair e aguardar aprovação'}
          </button>
        </div>

        <p className="mt-6 font-mono text-[10px] text-zinc-600">
          © {new Date().getFullYear()} Grupo Totum
        </p>
      </motion.div>
    </div>
  );
}
