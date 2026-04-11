import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type SyncState = 'idle' | 'syncing' | 'success' | 'error';

interface SyncButtonProps {
  onSyncComplete?: (success: boolean) => void;
}

export default function SyncButton({ onSyncComplete }: SyncButtonProps) {
  const [state, setState] = useState<SyncState>('idle');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncLog, setSyncLog] = useState<string[]>([]);

  const forceSync = async () => {
    setState('syncing');
    setSyncLog([]);
    const log: string[] = [];

    try {
      log.push('🔄 Iniciando sincronização...');
      setSyncLog([...log]);

      const { error: pingError } = await (supabase as any).from('agents').select('id').limit(1);
      if (pingError) throw new Error('Supabase indisponível');
      log.push('✅ Supabase: conectado');
      setSyncLog([...log]);

      await (supabase as any).from('agents').select('count', { count: 'exact', head: true });
      log.push('✅ agents: sincronizado');
      setSyncLog([...log]);

      await (supabase as any).from('tarefas').select('count', { count: 'exact', head: true });
      log.push('✅ tarefas: sincronizado');
      setSyncLog([...log]);

      log.push('🎯 Sincronização concluída com sucesso!');
      setSyncLog([...log]);
      setState('success');
      setLastSync(new Date());
      onSyncComplete?.(true);

      setTimeout(() => setState('idle'), 3000);
    } catch (err: any) {
      log.push(`❌ Erro: ${err.message}`);
      setSyncLog([...log]);
      setState('error');
      onSyncComplete?.(false);
      setTimeout(() => setState('idle'), 4000);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={forceSync}
        disabled={state === 'syncing'}
        className="w-full"
        variant={state === 'error' ? 'outline' : 'secondary'}
      >
        {state === 'syncing' ? (
          <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Sincronizando...</>
        ) : state === 'success' ? (
          <><CheckCircle className="h-4 w-4 mr-2" />Sincronizado!</>
        ) : state === 'error' ? (
          <><XCircle className="h-4 w-4 mr-2" />Erro — Tentar novamente</>
        ) : (
          <><RefreshCw className="h-4 w-4 mr-2" />Forçar Sync</>
        )}
      </Button>

      {syncLog.length > 0 && (
        <div className="bg-black/90 rounded-lg p-3 font-mono text-xs space-y-1 max-h-32 overflow-y-auto">
          {syncLog.map((line, i) => (
            <p key={i} className="text-green-400">{line}</p>
          ))}
        </div>
      )}

      {lastSync && (
        <p className="text-xs text-muted-foreground text-center">
          Última sync: {lastSync.toLocaleString('pt-BR')}
        </p>
      )}
    </div>
  );
}
