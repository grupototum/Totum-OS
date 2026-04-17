import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, XCircle, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function PendingApproval() {
  const navigate = useNavigate();
  const location = useLocation();
  const status = (location.state as any)?.status ?? 'pending';
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
              background:
                'linear-gradient(to bottom, transparent, rgba(39,39,42,0.15), transparent)',
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
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: isRejected
            ? 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(239,35,60,0.08) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm mx-auto px-6 text-center"
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
        </div>

        <div className="border border-zinc-800 p-8 bg-black space-y-5">
          {isRejected ? (
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          ) : (
            <div className="relative mx-auto w-12 h-12">
              <Clock className="h-12 w-12 text-amber-400 mx-auto" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
            </div>
          )}

          <h1 className="font-manrope text-2xl font-bold text-white">
            {isRejected ? 'Acesso negado' : 'Aguardando aprovação'}
          </h1>

          <p className="text-sm text-zinc-400">
            {isRejected
              ? 'Seu cadastro foi rejeitado pelo administrador. Entre em contato com o suporte para mais informações.'
              : 'Seu cadastro foi recebido com sucesso e está aguardando aprovação do administrador. Você será notificado quando o acesso for liberado.'}
          </p>

          {!isRejected && (
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Notificação enviada ao admin
            </div>
          )}

          <button
            onClick={handleSignOut}
            className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 text-sm text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Voltar ao login
          </button>
        </div>

        <p className="mt-6 font-mono text-[10px] text-zinc-600">
          © {new Date().getFullYear()} Grupo Totum · Sistema de Agentes IA
        </p>
      </motion.div>
    </div>
  );
}
