// src/pages/ActionPlan.tsx
// ✅ CORREÇÃO: Senha hardcoded removida - usando Supabase

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Unlock } from 'lucide-react';

export const ActionPlan = () => {
  const [passInput, setPassInput] = useState('');
  const [autorizado, setAutorizado] = useState(false);
  const [loading, setLoading] = useState(false);

  const verificarAcesso = async () => {
    if (!passInput.trim()) {
      toast.error('Digite o código de acesso');
      return;
    }

    setLoading(true);

    try {
      // ✅ OPÇÃO 1: Verificar contra tabela no Supabase (recomendado)
      const { data, error } = await supabase
        .from('access_codes')
        .select('*')
        .eq('code', passInput)
        .eq('active', true)
        .single();

      if (error || !data) {
        toast.error('Código de acesso inválido ou expirado');
        setAutorizado(false);
        return;
      }

      // Verificar se expirou
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        toast.error('Código de acesso expirado');
        setAutorizado(false);
        return;
      }

      // Registrar acesso
      await supabase.from('access_logs').insert({
        code_id: data.id,
        accessed_at: new Date().toISOString(),
        user_agent: navigator.userAgent,
        ip: window.location.hostname
      });

      setAutorizado(true);
      toast.success('Acesso concedido');

    } catch (err) {
      console.error('Erro ao verificar acesso:', err);
      toast.error('Erro ao verificar código');
    } finally {
      setLoading(false);
    }
  };

  // ✅ OPÇÃO 2: Usar variável de ambiente (alternativa simples)
  // Descomente se preferir esta opção (sem necessidade de tabela)
  /*
  const verificarAcessoEnv = async () => {
    if (passInput === import.meta.env.VITE_ACTION_PLAN_PASSWORD) {
      setAutorizado(true);
      toast.success('Acesso concedido');
    } else {
      toast.error('Código de acesso inválido');
      setAutorizado(false);
    }
  };
  */

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      verificarAcesso();
    }
  };

  if (!autorizado) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4" style={{ backgroundColor: '#fcfbf8' }}>
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-primary/10">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold">Plano de Ação</h1>
            <p className="text-muted-foreground">
              Esta área é restrita. Digite o código de acesso para continuar.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Código de acesso"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <Button 
              onClick={verificarAcesso} 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  Verificando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Unlock className="w-4 h-4" />
                  Acessar
                </span>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Acesso registrado para auditoria
          </p>
        </div>
      </div>
    );
  }

  // ... resto do componente (conteúdo protegido)
  return (
    <div className="p-6">
      <h1>Plano de Ação - Conteúdo Protegido</h1>
      {/* Conteúdo real aqui */}
    </div>
  );
};
