import React from 'react';
import { DollarSign } from 'lucide-react';
import { useHostingBilling } from '../hooks';
import {
  DSCard,
  DSLabel,
  DSButton,
  DSBadge,
  DSDot,
  DSTable,
  DSStatCard,
} from './DSComponents';

export function BillingTab() {
  const {
    billing,
    clients,
    loading,
    totalFaturado,
    totalPago,
    totalPendente,
    clientName,
    markPaid,
  } = useHostingBilling();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DSStatCard
          label="Faturamento Mensal"
          value={`R$ ${totalFaturado.toFixed(2)}`}
          accent
        />
        <DSStatCard
          label="Total Recebido"
          value={`R$ ${totalPago.toFixed(2)}`}
          sub="PAGO"
        />
        <DSStatCard
          label="Pendente"
          value={`R$ ${totalPendente.toFixed(2)}`}
          sub="AGUARDANDO"
        />
      </div>

      <DSCard className="overflow-hidden">
        <div className="p-4 border-b border-zinc-800 border-dashed flex justify-between items-center">
          <DSLabel>Clientes x Faturamento</DSLabel>
          <DSDot />
        </div>
        <DSTable
          headers={['Cliente', 'Valor Mensal', 'Status']}
          loading={loading}
          empty={
            <div className="p-8 text-center text-zinc-600 font-mono text-xs uppercase tracking-wider">
              Nenhum dado
            </div>
          }
        >
          {clients.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-3 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors"
            >
              <div className="text-sm text-white font-medium">
                {c.company_name}
              </div>
              <div className="text-sm text-white font-mono">
                R$ {(c.monthly_value || 0).toFixed(2)}
              </div>
              <div>
                <DSBadge status={c.payment_status || 'pendente'} />
              </div>
            </div>
          ))}
        </DSTable>
      </DSCard>

      {billing.length > 0 && (
        <DSCard className="overflow-hidden">
          <div className="p-4 border-b border-zinc-800 border-dashed flex justify-between items-center">
            <DSLabel>Histórico de Cobranças</DSLabel>
            <DSDot />
          </div>
          <DSTable headers={['Mês', 'Cliente', 'Valor', 'Status', 'Ações']}>
            {billing.map((b) => (
              <div
                key={b.id}
                className="grid grid-cols-5 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors"
              >
                <div className="font-mono text-xs text-zinc-400">{b.month}</div>
                <div className="text-sm text-zinc-300">
                  {clientName(b.client_id)}
                </div>
                <div className="text-sm text-white font-mono font-medium">
                  R$ {b.amount.toFixed(2)}
                </div>
                <div>
                  <DSBadge status={b.status} />
                </div>
                <div>
                  {b.status !== 'pago' && (
                    <DSButton
                      variant="ghost"
                      size="sm"
                      onClick={() => markPaid(b)}
                    >
                      Marcar Pago
                    </DSButton>
                  )}
                </div>
              </div>
            ))}
          </DSTable>
        </DSCard>
      )}
    </div>
  );
}
