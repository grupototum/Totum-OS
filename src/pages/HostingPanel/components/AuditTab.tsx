import React from 'react';
import { Shield, Activity, RefreshCw } from 'lucide-react';
import { useHostingAudit } from '../hooks';
import {
  DSCard,
  DSLabel,
  DSButton,
  DSDot,
} from './DSComponents';

export function AuditTab() {
  const { logs, loading, load } = useHostingAudit();

  return (
    <div className="space-y-5">
      <DSCard accent className="p-6">
        <div className="flex items-center justify-between border-b border-zinc-800 border-dashed pb-3 mb-5">
          <DSLabel>Permissões & Roles</DSLabel>
          <DSDot active />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              role: 'Admin',
              color: '#ef233c',
              desc: 'Acesso total: clientes, containers, billing, subdomínios',
            },
            {
              role: 'Gerenciador',
              color: '#a855f7',
              desc: 'Criar subdomínios, visualizar containers e billing',
            },
            {
              role: 'Leitor',
              color: '#3b82f6',
              desc: 'Apenas visualização de dados',
            },
          ].map((r) => (
            <div
              key={r.role}
              className="border border-zinc-800 p-5 bg-black group hover:border-zinc-700 transition-colors relative overflow-hidden"
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-1 transition-transform duration-200"
                style={{ backgroundColor: r.color }}
              />
              <p className="text-sm text-white font-medium ml-3">{r.role}</p>
              <p className="text-xs text-zinc-500 mt-1.5 ml-3 font-sans leading-relaxed">
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </DSCard>

      <DSCard className="overflow-hidden">
        <div className="p-4 border-b border-zinc-800 border-dashed flex justify-between items-center">
          <DSLabel>Audit Log</DSLabel>
          <DSButton variant="outline" size="sm" onClick={load}>
            <RefreshCw className="h-3 w-3" />
            Atualizar
          </DSButton>
        </div>
        {loading ? (
          <div className="p-10 text-center text-zinc-600 font-mono text-xs uppercase tracking-wider">
            Carregando logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-10 text-center">
            <Activity className="h-6 w-6 mx-auto mb-2 text-zinc-700" />
            <p className="text-zinc-600 font-mono text-xs uppercase tracking-wider">
              Nenhum registro no audit log
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50 max-h-96 overflow-y-auto">
            {logs.map((l) => (
              <div
                key={l.id}
                className="px-4 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors group relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ef233c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-200" />
                <Activity className="h-3.5 w-3.5 text-zinc-700 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    <span className="font-medium">{l.action}</span>
                    {l.target && (
                      <span className="text-zinc-500"> → {l.target}</span>
                    )}
                  </p>
                  {l.user_email && (
                    <p className="text-[10px] text-zinc-600 font-mono">
                      {l.user_email}
                    </p>
                  )}
                </div>
                <span className="text-[10px] text-zinc-600 font-mono shrink-0">
                  {new Date(l.created_at).toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </DSCard>
    </div>
  );
}
